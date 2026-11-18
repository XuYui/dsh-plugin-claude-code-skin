/**
 * Browser half of dsh-plugin-claude-code-skin.
 *
 * Two jobs:
 *   1. paint the skin: one plugin-owned stylesheet scoped by
 *      `html[data-dsh-cc-skin]`, plus the hero surface the stock shell leaves
 *      empty (greeting + usage overview card);
 *   2. read the usage summary this package's host half serves at
 *      `/claude-code-skin/usage` and render it.
 *
 * The build step wraps this file together with src/skin.css into the lazy-CJS
 * bundle the client module system expects: running the bundle only registers a
 * factory, and `apply` runs when the plugin materializes.
 */

const PLUGIN_ID = "dsh-plugin-claude-code-skin";
const STYLE_KEY = `${PLUGIN_ID}/skin.css`;
const ROOT_ATTRIBUTE = "data-dsh-cc-skin";
const USAGE_URL = "claude-code-skin/usage";
const GATSBY_TOKENS = 120_000;
const HEAT_DAYS = 287;

/**
 * Mount the skin. `ctx.effect` re-runs on reload and disposes on unload, so
 * disabling the plugin returns the GUI to the stock theme without a refresh.
 * @param ctx - client plugin context.
 */
export function apply(ctx) {
  ctx.effect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute(ROOT_ATTRIBUTE);
    root.setAttribute(ROOT_ATTRIBUTE, "");

    for (const stale of document.querySelectorAll(`style[data-plugin-css="${STYLE_KEY}"]`)) stale.remove();
    const style = document.createElement("style");
    style.dataset.plugin = PLUGIN_ID;
    style.dataset.pluginCss = STYLE_KEY;
    style.textContent = CSS;
    document.head.appendChild(style);

    const disposeHero = mountHero();
    const disposeTitle = decorateTitle();

    return () => {
      disposeHero();
      disposeTitle();
      style.remove();
      if (previous === null) root.removeAttribute(ROOT_ATTRIBUTE);
      else root.setAttribute(ROOT_ATTRIBUTE, previous);
    };
  }, `${PLUGIN_ID}: skin stylesheet`);
}

/** No service is required: the skin paints the DOM and reads one local route. */
export const inject = [];

/**
 * Keep the Claude Code mark on the window title while the skin is mounted.
 * @returns disposer restoring the plain title.
 */
function decorateTitle() {
  const paint = () => {
    const current = document.title;
    if (current.length > 0 && !current.startsWith("✻")) document.title = `✻ ${current}`;
  };
  paint();
  const observer = new MutationObserver(paint);
  const title = document.querySelector("title");
  if (title) observer.observe(title, { childList: true, characterData: true, subtree: true });
  return () => {
    observer.disconnect();
    document.title = document.title.replace(/^✻\s*/u, "");
  };
}

/* -------------------------------------------------------------------------- */
/* hero surface                                                               */
/* -------------------------------------------------------------------------- */

const HERO_ATTR = "data-cc-hero";

/**
 * Build one element with a class, optional text, and attributes.
 * @param {string} tag - tag name.
 * @param {string} className - class list.
 * @param {string} [text] - text content.
 * @returns {HTMLElement} the element.
 */
function h(tag, className, text) {
  const node = document.createElement(tag);
  if (className !== "") node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function compact(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

const EXACT = new Intl.NumberFormat("en-US");
const DAY_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** Grouped digits: a tooltip has room to show the exact number. */
function exact(value) {
  return Number.isFinite(value) ? EXACT.format(value) : "—";
}

function plural(count, word) {
  return `${String(count)} ${word}${count === 1 ? "" : "s"}`;
}

/** `2026-11-18` → `Wed, Nov 18, 2026`; falls back to the raw key. */
function dayLabel(key) {
  const ms = Date.parse(`${String(key)}T00:00:00`);
  return Number.isFinite(ms) ? DAY_FORMAT.format(ms) : String(key);
}

function dayKey(ms) {
  const date = new Date(ms);
  return `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function streakOf(days) {
  if (days.length === 0) return { current: 0, longest: 0 };
  const sorted = [...days].sort();
  let longest = 1;
  let run = 1;
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = Date.parse(`${sorted[index - 1]}T00:00:00`);
    const current = Date.parse(`${sorted[index]}T00:00:00`);
    if (current - previous === 86_400_000) {
      run += 1;
      longest = Math.max(longest, run);
    } else run = 1;
  }
  const today = dayKey(Date.now());
  const yesterday = dayKey(Date.now() - 86_400_000);
  const last = sorted[sorted.length - 1];
  if (last !== today && last !== yesterday) return { current: 0, longest };
  let current = 1;
  for (let index = sorted.length - 1; index > 0; index -= 1) {
    const gap = Date.parse(`${sorted[index]}T00:00:00`) - Date.parse(`${sorted[index - 1]}T00:00:00`);
    if (gap !== 86_400_000) break;
    current += 1;
  }
  return { current, longest };
}

function hourLabel(hour) {
  if (hour === null || hour === undefined) return "—";
  if (hour === 0) return "12AM";
  if (hour < 12) return `${String(hour)}AM`;
  if (hour === 12) return "12PM";
  return `${String(hour - 12)}PM`;
}

function accountName() {
  // The account control lives in the shell's settings launcher row.
  const launcher = document.querySelector('[data-slot="settings.launcher"]');
  const scopes = launcher === null ? [document.querySelector('[data-slot="sidebar"]')] : [launcher];
  for (const scope of scopes) {
    if (scope === null) continue;
    const raw = (scope.textContent ?? "").trim();
    const name = raw.split(/[·•|]/u)[0].trim();
    if (name.length > 0 && name.length < 40) return name;
  }
  return "";
}

/**
 * Own the hero surface: wait for the stock hero, keep our block inside it, and
 * paint the greeting plus the usage overview.
 * @returns disposer removing the block and listeners.
 */
function mountHero() {
  /** @type {HTMLElement|null} */
  let host = null;
  /** @type {HTMLElement|null} */
  let block = null;
  /** @type {{ tab: "overview"|"models", range: "all"|"30d"|"7d" }} */
  const state = { tab: "overview", range: "all" };
  /** @type {object|null} */
  let usage = null;
  let loading = false;
  let disposed = false;
  /** @type {HTMLElement|null} one tooltip for the whole card, parked on <body>. */
  let tip = null;

  const heroHost = () => {
    const mark = document.querySelector('[data-slot="conversation.hero.brand.mark"]');
    if (mark === null) return null;
    const headline = mark.closest('[class*="headline"]') ?? mark.parentElement;
    const stack = headline?.parentElement ?? null;
    if (stack === null) return null;
    const body = [...stack.children].find((child) => child !== headline);
    if (body === undefined || body === null) return null;
    body.setAttribute(HERO_ATTR, "");
    return body;
  };

  const load = () => {
    if (loading) return;
    loading = true;
    fetch(new URL(USAGE_URL, document.baseURI), { credentials: "same-origin", cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${String(response.status)}`))))
      .then((payload) => {
        if (disposed) return;
        usage = payload;
        loading = false;
        render();
      })
      .catch(() => {
        if (disposed) return;
        usage = null;
        loading = false;
        render();
      });
  };

  const windowRows = () => {
    const rows = Array.isArray(usage?.sessions) ? usage.sessions : [];
    if (state.range === "all") return rows;
    const days = state.range === "7d" ? 7 : 30;
    const from = Date.now() - days * 86_400_000;
    return rows.filter((row) => Number(row.createdAt) >= from);
  };

  const summaryOf = (rows) => {
    const days = new Set();
    const byHour = new Map();
    const byModel = new Map();
    let messages = 0;
    let tokens = 0;
    let cacheRead = 0;
    for (const row of rows) {
      messages += Number(row.messages ?? 0);
      tokens += Number(row.tokens ?? 0);
      cacheRead += Number(row.cacheReadTokens ?? 0);
      days.add(dayKey(Number(row.createdAt)));
      const hour = new Date(Number(row.createdAt)).getHours();
      byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
      if (typeof row.model === "string" && row.model.length > 0) {
        const entry = byModel.get(row.model) ?? { model: row.model, sessions: 0, tokens: 0 };
        entry.sessions += 1;
        entry.tokens += Number(row.tokens ?? 0);
        byModel.set(row.model, entry);
      }
    }
    const streak = streakOf([...days]);
    let peakHour = null;
    let peak = 0;
    for (const [hour, count] of byHour) {
      if (count > peak || (count === peak && peakHour !== null && hour < peakHour)) {
        peakHour = hour;
        peak = count;
      }
    }
    let favorite = null;
    let favoriteCount = 0;
    let models = [];
    for (const entry of byModel.values()) {
      if (entry.sessions > favoriteCount) {
        favorite = entry.model;
        favoriteCount = entry.sessions;
      }
      models.push(entry);
    }
    models = models.sort((a, b) => b.tokens - a.tokens);
    return {
      sessions: rows.length,
      messages,
      tokens,
      cacheRead,
      activeDays: days.size,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      peakHour,
      favorite,
      models,
      days,
    };
  };

  const segment = (label, active, onClick) => {
    const button = h("button", `cc-seg${active ? " is-on" : ""}`, label);
    button.type = "button";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      onClick();
      render();
    });
    return button;
  };

  const buildSkeleton = () => {
    const wrapper = h("div", "cc-hero");
    wrapper.setAttribute("data-cc-hero-block", "");

    const name = accountName();
    const greeting = h("h1", "cc-greeting", name.length > 0 ? `What's up next, ${name}?` : "What's up next?");
    const subtitle = h("p", "cc-sub", "Start a new session below");
    const card = h("section", "cc-card");
    card.setAttribute("aria-label", "Usage overview");
    wrapper.append(greeting, subtitle, card);
    return { wrapper, card };
  };

  const renderTiles = (grid, summary) => {
    const tiles = [
      ["Sessions", String(summary.sessions)],
      ["Messages", String(summary.messages)],
      ["Total tokens", compact(summary.tokens)],
      ["Active days", String(summary.activeDays)],
      ["Current streak", `${String(summary.currentStreak)}d`],
      ["Longest streak", `${String(summary.longestStreak)}d`],
      ["Peak hour", hourLabel(summary.peakHour)],
      ["Favorite model", summary.favorite === null ? "—" : summary.favorite],
    ];
    grid.replaceChildren(
      ...tiles.map(([key, value]) => {
        const tile = h("div", "cc-tile");
        tile.append(h("span", "cc-tile-k", key), h("span", "cc-tile-v", value));
        return tile;
      }),
    );
  };

  const renderModels = (grid, summary) => {
    if (summary.models.length === 0) {
      grid.replaceChildren(h("p", "cc-empty", "No model usage recorded in this range."));
      return;
    }
    const list = h("div", "cc-models");
    for (const entry of summary.models.slice(0, 6)) {
      const row = h("div", "cc-model-row");
      row.append(
        h("span", "cc-model-name", entry.model),
        h("span", "cc-model-meta", `${String(entry.sessions)} sessions`),
        h("span", "cc-model-tokens", compact(entry.tokens)),
      );
      list.append(row);
    }
    grid.replaceChildren(list);
  };

  const hideTip = () => {
    if (tip !== null) tip.classList.remove("is-on");
  };

  /**
   * Place the tooltip above the hovered cell, below it when the card sits near
   * the top of the viewport, and inside the viewport horizontally.
   * @param {HTMLElement} cell - the heat cell under the pointer or focus.
   */
  const showTip = (cell) => {
    if (tip === null || !tip.isConnected) {
      tip = h("div", "cc-heat-tip");
      tip.setAttribute("aria-hidden", "true");
      document.body.append(tip);
    }
    const sessions = Number(cell.dataset.sessions ?? 0);
    const messages = Number(cell.dataset.messages ?? 0);
    const tokens = Number(cell.dataset.tokens ?? 0);
    const lines = [h("span", "cc-heat-tip-day", dayLabel(cell.dataset.day ?? ""))];
    if (sessions === 0) {
      lines.push(h("span", "cc-heat-tip-none", "No sessions recorded"));
    } else {
      const meta = messages > 0 ? `${plural(sessions, "session")} · ${plural(messages, "message")}` : plural(sessions, "session");
      lines.push(h("strong", "cc-heat-tip-tokens", `${exact(tokens)} tokens`));
      lines.push(h("span", "cc-heat-tip-meta", meta));
    }
    tip.replaceChildren(...lines);

    tip.classList.add("is-on");
    tip.style.visibility = "hidden";
    tip.style.left = "-9999px";
    tip.style.top = "0px";
    const box = tip.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    const margin = 8;
    const gap = 6;
    const limit = Math.max(margin, window.innerWidth - box.width - margin);
    const left = Math.min(Math.max(margin, rect.left + rect.width / 2 - box.width / 2), limit);
    let top = rect.top - box.height - gap;
    if (top < margin) top = rect.bottom + gap;
    top = Math.min(top, window.innerHeight - box.height - margin);
    tip.style.left = `${String(Math.round(left))}px`;
    tip.style.top = `${String(Math.round(Math.max(margin, top)))}px`;
    tip.style.visibility = "";
  };

  const bindHeat = (container) => {
    const cellOf = (target) => (target instanceof Element ? target.closest(".cc-heat-cell") : null);
    container.addEventListener("mouseover", (event) => {
      const cell = cellOf(event.target);
      if (cell !== null && container.contains(cell)) showTip(cell);
    });
    container.addEventListener("mouseleave", hideTip);
    container.addEventListener("focusin", (event) => {
      const cell = cellOf(event.target);
      if (cell !== null) showTip(cell);
    });
    container.addEventListener("focusout", hideTip);
  };

  const renderHeat = (container, rows) => {
    const days = new Map();
    for (const row of rows) {
      const key = dayKey(Number(row.createdAt));
      const entry = days.get(key) ?? { sessions: 0, messages: 0, tokens: 0 };
      entry.sessions += 1;
      entry.messages += Number(row.messages ?? 0);
      entry.tokens += Number(row.tokens ?? 0);
      days.set(key, entry);
    }
    const cells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let offset = HEAT_DAYS - 1; offset >= 0; offset -= 1) {
      const date = new Date(today.getTime() - offset * 86_400_000);
      const key = dayKey(date.getTime());
      const entry = days.get(key);
      const count = entry?.sessions ?? 0;
      const tokens = entry?.tokens ?? 0;
      const messages = entry?.messages ?? 0;
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
      const cell = h("span", `cc-heat-cell is-${String(level)}`);
      cell.dataset.day = key;
      cell.dataset.sessions = String(count);
      cell.dataset.messages = String(messages);
      cell.dataset.tokens = String(tokens);
      if (count === 0) {
        cell.setAttribute("aria-hidden", "true");
      } else {
        // Empty days carry no data, so only days with sessions enter the tab
        // order. Both hover and focus open the same tooltip.
        cell.tabIndex = 0;
        cell.setAttribute("role", "img");
        cell.setAttribute(
          "aria-label",
          `${dayLabel(key)}: ${exact(tokens)} tokens, ${plural(count, "session")}, ${plural(messages, "message")}`,
        );
      }
      cells.push(cell);
    }
    container.replaceChildren(...cells);
    bindHeat(container);
  };

  const renderFooter = (foot, summary) => {
    if (usage === null) {
      foot.textContent = "Usage summary unavailable — the host route could not be read.";
      return;
    }
    const cached = summary.cacheRead;
    const cacheNote = cached > 0 ? ` ${compact(cached)} tokens were served from the prompt cache.` : "";
    if (summary.tokens >= GATSBY_TOKENS) {
      const multiple = Math.round((summary.tokens / GATSBY_TOKENS) * 10) / 10;
      foot.textContent = `Well past one Great Gatsby (=120K tokens): ${String(multiple)}× the novel.${cacheNote}`;
      return;
    }
    const percent = Math.round((summary.tokens / GATSBY_TOKENS) * 100);
    foot.textContent = `Not quite one Great Gatsby (=120K tokens) yet — ${String(percent)}% of the way there.${cacheNote}`;
  };

  function render() {
    try {
      paint();
    } catch (error) {
      window.__ccSkinError = String((error && error.stack) || error);
    }
  }

  function paint() {
    if (block === null || disposed) return;
    const card = block.querySelector(".cc-card");
    if (card === null) return;
    hideTip();
    const rows = windowRows();
    const summary = summaryOf(rows);

    const top = h("header", "cc-card-top");
    const tabs = h("div", "cc-tabs");
    tabs.append(
      segment("Overview", state.tab === "overview", () => {
        state.tab = "overview";
      }),
      segment("Models", state.tab === "models", () => {
        state.tab = "models";
      }),
    );
    const ranges = h("div", "cc-tabs cc-tabs-end");
    ranges.append(
      segment("All", state.range === "all", () => {
        state.range = "all";
      }),
      segment("30d", state.range === "30d", () => {
        state.range = "30d";
      }),
      segment("7d", state.range === "7d", () => {
        state.range = "7d";
      }),
    );
    top.append(tabs, ranges);

    const grid = h("div", "cc-grid");
    if (state.tab === "overview") renderTiles(grid, summary);
    else renderModels(grid, summary);

    const heat = h("div", "cc-heat");
    heat.setAttribute("role", "group");
    heat.setAttribute("aria-label", `Daily usage over the last ${String(HEAT_DAYS)} days`);
    renderHeat(heat, rows);

    const foot = h("p", "cc-foot");
    renderFooter(foot, summary);

    card.replaceChildren(top, grid, heat, foot);
  }

  const updateGreeting = () => {
    if (block === null) return;
    const greeting = block.querySelector(".cc-greeting");
    if (greeting === null) return;
    const name = accountName();
    const text = name.length > 0 ? `What's up next, ${name}?` : "What's up next?";
    if (greeting.textContent !== text) greeting.textContent = text;
  };

  const ensure = () => {
    if (disposed) return;
    const next = heroHost();
    if (next === null) {
      if (block !== null) {
        block.remove();
        block = null;
        host = null;
        hideTip();
      }
      return;
    }
    if (host === next && block !== null && block.isConnected) {
      updateGreeting();
      return;
    }
    host = next;
    const built = buildSkeleton();
    block = built.wrapper;
    host.replaceChildren(block);
    render();
    load();
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") hideTip();
  };
  const dismissTip = () => hideTip();
  window.addEventListener("scroll", dismissTip, { capture: true, passive: true });
  window.addEventListener("resize", dismissTip);
  window.addEventListener("keydown", onKeyDown);

  const timer = window.setInterval(ensure, 400);
  const observer = new MutationObserver(ensure);
  observer.observe(document.body, { childList: true, subtree: true });
  ensure();

  return () => {
    disposed = true;
    window.clearInterval(timer);
    window.removeEventListener("scroll", dismissTip, { capture: true });
    window.removeEventListener("resize", dismissTip);
    window.removeEventListener("keydown", onKeyDown);
    observer.disconnect();
    block?.remove();
    block = null;
    host?.removeAttribute(HERO_ATTR);
    host = null;
    tip?.remove();
    tip = null;
  };
}
