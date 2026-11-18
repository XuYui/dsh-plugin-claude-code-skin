/**
 * Host half of dsh-plugin-claude-code-skin.
 *
 * The visual layer is entirely browser-side. This half adds exactly one thing
 * the browser cannot read on its own: an aggregate usage summary for the
 * profile, served over the local web server so the overview card in the hero
 * can show real numbers.
 *
 * Data source: dsh's own session projection cache
 * (`$DSH_HOME/storages/session_projcache/sessions/session-*.json`), which holds
 * per-session title, token totals, round counts and the last used model. The
 * scan is read-only, cached per file mtime, and never leaves the machine.
 *
 * Nothing here touches model-facing tools, prompts, or requests.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROUTE_PATH = "/claude-code-skin/usage";
const RECOMPUTE_MS = 5_000;
const MAX_BYTES = 8 * 1024 * 1024;

/** @type {Map<string, { mtimeMs: number, size: number, row: object }>} */
const fileCache = new Map();
let lastCollect = 0;
let lastPayload = null;

function dshHome() {
  return process.env.DSH_HOME || join(homedir(), ".dsh");
}

function projcacheDir() {
  return join(dshHome(), "storages", "session_projcache", "sessions");
}

const MODEL_LABELS = {
  "deepseek-flash": "DeepSeek Flash",
  "deepseek-pro": "DeepSeek Pro",
  "deepseek-reasoner": "DeepSeek Reasoner",
  "deepseek-chat": "DeepSeek Chat",
};

function modelLabel(id) {
  if (typeof id !== "string" || id.length === 0) return null;
  if (MODEL_LABELS[id] !== undefined) return MODEL_LABELS[id];
  const cleaned = id.replace(/^(deepseek|claude)-/u, "").replaceAll(/[-_]+/gu, " ");
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => (/^v?[\d.]/u.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}


/**
 * Fold one projection record into the summary row the card needs.
 * @param {{ record?: object }} file - parsed projection cache file.
 * @param {number} parsedAt - mtime of the cache file in milliseconds.
 * @returns {object|null} the row, or null when the file is not a session.
 */
function rowOf(file, parsedAt, fileId) {
  const record = file?.record;
  if (record === null || typeof record !== "object") return null;
  const identity = record.identity ?? {};
  const rows = record.rows ?? {};
  const createdAt = Number.isFinite(identity.createdAt) ? identity.createdAt : parsedAt;
  const totals = rows.tokenUsage?.val?.totals ?? {};
  const tokenInput = totals.uncachedInputTokens ?? 0;
  const tokenOutput = totals.outputTokens ?? 0;
  const tokenCacheRead = totals.cacheReadTokens ?? 0;
  const tokenCacheWrite = totals.cacheWriteTokens ?? 0;
  const tokens = tokenInput + tokenOutput + tokenCacheWrite;
  const turns = rows.sessionStats?.val?.turns ?? 0;
  const messages = rows.titleInput?.val?.count ?? 0;
  const model = rows.modelSelection?.val?.lastUsed?.model ?? null;
  return {
    id: typeof record.id === "string" ? record.id : (fileId ?? null),
    createdAt,
    parsedAt,
    title: typeof rows.title?.val === "string" ? rows.title.val : "",
    cwd: typeof identity.cwd === "string" ? identity.cwd : "",
    delegationDepth: Number.isFinite(identity.delegationDepth) ? identity.delegationDepth : 0,
    messages,
    turns,
    tokens,
    tokenInput,
    tokenOutput,
    tokenCacheRead,
    tokenCacheWrite,
    model,
  };
}

/**
 * Read the projection cache, re-parsing only files whose mtime or size moved.
 * @returns {Promise<object[]>} summary rows for every readable session.
 */
async function readRows() {
  const dir = projcacheDir();
  let names;
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }
  const rows = [];
  const seen = new Set();
  for (const name of names) {
    if (!name.startsWith("session-") || !name.endsWith(".json")) continue;
    const path = join(dir, name);
    seen.add(path);
    let info;
    try {
      info = await stat(path);
    } catch {
      continue;
    }
    if (!info.isFile() || info.size > MAX_BYTES) continue;
    const cached = fileCache.get(path);
    if (cached !== undefined && cached.mtimeMs === info.mtimeMs && cached.size === info.size) {
      rows.push(cached.row);
      continue;
    }
    try {
      const parsed = JSON.parse(await readFile(path, "utf8"));
      const row = rowOf(parsed, info.mtimeMs, name.slice("session-".length, -".json".length));
      if (row === null) continue;
      fileCache.set(path, { mtimeMs: info.mtimeMs, size: info.size, row });
      rows.push(row);
    } catch {
      /* a half-written or foreign file is skipped, never fatal */
    }
  }
  for (const path of [...fileCache.keys()]) if (!seen.has(path)) fileCache.delete(path);
  return rows;
}

/**
 * Build the usage payload the browser renders.
 *
 * The browser owns presentation and range filtering, so the host answers raw
 * per-session rows plus a profile-wide total. Aggregating here as well keeps
 * `curl` useful without the UI.
 * @returns {Promise<object>} session rows and totals.
 */
async function collect() {
  const now = Date.now();
  if (lastPayload !== null && now - lastCollect < RECOMPUTE_MS) return lastPayload;

  const all = await readRows();
  const top = all.filter((row) => row.delegationDepth === 0);
  const sessions = (top.length === 0 ? all : top).sort((a, b) => a.createdAt - b.createdAt);

  const totals = { sessions: sessions.length, messages: 0, turns: 0, tokens: 0 };
  const rows = [];
  for (const row of sessions) {
    totals.messages += row.messages;
    totals.turns += row.turns;
    totals.tokens += row.tokens;
    rows.push({
      id: row.id,
      createdAt: row.createdAt,
      lastActiveAt: row.parsedAt,
      title: row.title,
      messages: row.messages,
      turns: row.turns,
      tokens: row.tokens,
      tokenInput: row.tokenInput,
      tokenOutput: row.tokenOutput,
      tokenCacheRead: row.tokenCacheRead,
      cacheReadTokens: row.tokenCacheRead,
      model: row.model === null ? null : modelLabel(row.model),
    });
  }

  lastPayload = {
    version: 1,
    generatedAt: now,
    totals,
    sessions: rows,
  };
  lastCollect = now;
  return lastPayload;
}

/**
 * Answer the usage route.
 * @param {import("node:http").IncomingMessage} req - request.
 * @param {import("node:http").ServerResponse} res - response.
 */
async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8", allow: "GET, HEAD" });
    res.end("method not allowed");
    return;
  }
  let payload;
  try {
    payload = await collect();
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    res.end(JSON.stringify({ version: 1, error: String(error?.message ?? error) }));
    return;
  }
  const body = JSON.stringify(payload);
  res.writeHead(200, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  res.end(req.method === "HEAD" ? undefined : body);
}

/**
 * Mount the read-only usage route on the host web server.
 * @param ctx - host plugin context.
 */
export function apply(ctx) {
  ctx.inject(["webServer"], (scoped) => {
    scoped.effect(
      () => scoped.webServer.register({ kind: "prefix", path: ROUTE_PATH, handler }),
      "claude-code-skin: usage route",
    );
  });
}
