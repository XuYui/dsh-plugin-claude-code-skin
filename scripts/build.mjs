// Build the browser bundle: wrap src/boot.js + src/skin.css in the lazy-CJS
// registration form the DSH client module system expects.
//
//   window.__ModuleLoader__.load({ id, factory })
//
// Executing the bundle only registers the factory; everything else runs when
// the plugin materializes. Run with: node scripts/build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const css = fs.readFileSync(path.join(root, 'src/skin.css'), 'utf8');
const boot = fs.readFileSync(path.join(root, 'src/boot.js'), 'utf8');

// The bundle is a function body, not an ES module: drop the export keywords and
// publish the same names on module.exports at the end.
const body = boot
  .replace(/^export function apply/mu, 'function apply')
  .replace(/^export const inject/mu, 'const inject')
  .replace(/^export\s+/gmu, '');

if (/\bimport\s/u.test(body)) throw new Error('src/boot.js must not import: the bundle is self-contained');

const bundle = `window.__ModuleLoader__.load({
	id: ${JSON.stringify(pkg.name)},
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const CSS = ${JSON.stringify(css)};
${body
  .split('\n')
  .map((line) => (line.length > 0 ? '\t\t' + line : line))
  .join('\n')}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
`;

fs.mkdirSync(path.join(root, 'lib'), { recursive: true });
fs.writeFileSync(path.join(root, 'lib/client.js'), bundle);
fs.writeFileSync(path.join(root, 'lib/skin.css'), css);
console.log('built lib/client.js (%d bytes) and lib/skin.css (%d bytes)', bundle.length, css.length);
