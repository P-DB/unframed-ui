// Fails the build when a public attribute, property, method or event has no
// description: the docs site, Storybook and IDE tooltips all show these.
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('../custom-elements.json', import.meta.url), 'utf8'));
const missing = [];
for (const mod of manifest.modules) {
  for (const d of mod.declarations ?? []) {
    if (!d.tagName) continue;
    if (!d.summary) missing.push(`<${d.tagName}> @summary`);
    for (const item of [...(d.attributes ?? []), ...(d.members ?? []), ...(d.events ?? [])]) {
      if (!item.description) missing.push(`<${d.tagName}> ${item.name}`);
    }
  }
}
if (missing.length) {
  console.error(`Undocumented public API (add a JSDoc comment):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log('docs: every public API member is documented');
