// Builds the agent skill that `unframed skill` installs (skill/unframed/):
//   SKILL.md                    rules and a component index, from skill-template/SKILL.md
//   references/components.md    every component: examples and full API
//   references/frameworks.md    setup and usage for HTML, React, Vue and Angular
//   references/theming.md       tokens, custom properties, parts, dark mode
// Generated from the same sources as the website, so it matches this version.
// Also copied into plugins/unframed/ at the repository root: the Claude Code
// plugin that /plugin installs from this repository's marketplace. That copy is
// committed, and CI checks it is up to date.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { componentMarkdown, componentPages, coreVersion, elementsByTag, frameworkGuides, pageImports } from '../../../scripts/docs-markdown.mjs';

const root = new URL('../', import.meta.url);
const out = new URL('skill/unframed/', root);

const elements = elementsByTag();
const pages = componentPages();
const guides = await frameworkGuides();
const version = coreVersion();

const index = [
  '| Component | Tags | Import |',
  '|---|---|---|',
  ...pages.map((p) => `| ${p.title}: ${elements.get(p.tags[0])?.summary ?? ''} | ${p.tags.map((t) => `\`<${t}>\``).join(' ')} | ${pageImports(p, elements).map((i) => `\`${i}\``).join(' ')} |`),
].join('\n');

const skill = (await readFile(new URL('skill-template/SKILL.md', root), 'utf8')).replace('{{version}}', version).replace('{{components}}', index);
const components = `# Unframed ${version} components\n\n${pages.map((p) => componentMarkdown(p, elements, { headingLevel: 2 })).join('\n')}`;
const frameworks = `# Using Unframed ${version} in each framework\n\n${['html', 'react', 'vue', 'angular']
  .map((fw) => guides[fw].replace(/^#/gm, '##'))
  .join('\n')}`;
const theming = await readFile(new URL('../../apps/website/llms/theming.md', root), 'utf8');

await rm(new URL('skill/', root), { recursive: true, force: true });
await mkdir(new URL('references/', out), { recursive: true });
await writeFile(new URL('SKILL.md', out), skill);
await writeFile(new URL('references/components.md', out), components);
await writeFile(new URL('references/frameworks.md', out), frameworks);
await writeFile(new URL('references/theming.md', out), theming);
const plugin = new URL('../../plugins/unframed/skills/unframed/', root);
await rm(plugin, { recursive: true, force: true });
await cp(out, plugin, { recursive: true });
// The plugin's version follows the library's: Claude Code updates installed plugins when it changes.
const manifestUrl = new URL('../../plugins/unframed/.claude-plugin/plugin.json', root);
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
await writeFile(manifestUrl, `${JSON.stringify({ ...manifest, version }, null, 2)}\n`);
console.log(`skill: SKILL.md and 3 references for ${pages.length} components, also in plugins/unframed/`);
