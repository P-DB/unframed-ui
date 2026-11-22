// Builds data.json: what the server knows about every component (summary,
// tags, imports, and its docs as Markdown) and every element's API, for
// validate_usage. Generated from the same sources as the website and the CLI's
// agent skill, and shipped with the package, so the server works offline and
// always matches its version.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentMarkdown, componentPages, coreVersion, elementsByTag, frameworkGuides, pageImports } from '../../../scripts/docs-markdown.mjs';
import { coreImportPath, formModels } from '../../../scripts/form-models.mjs';

const elements = elementsByTag();
const pages = componentPages();

/** String literal unions declared in the core source, e.g. ButtonVariant → ['primary', …]. */
function literalTypes() {
  const types = new Map();
  const src = fileURLToPath(new URL('../../core/src/', import.meta.url));
  const files = readdirSync(src, { recursive: true }).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'));
  for (const file of files) {
    const source = readFileSync(join(src, file), 'utf8');
    for (const [, name, body] of source.matchAll(/export type (\w+) =\s*((?:\|?\s*'[^']*'\s*)+);/g)) {
      types.set(name, [...body.matchAll(/'([^']*)'/g)].map((m) => m[1]));
    }
  }
  return types;
}

/** The values an attribute accepts, when its type is a closed list of strings. */
function values(typeText, types) {
  const members = (typeText ?? '').split('|').map((t) => t.trim()).filter((t) => t !== 'undefined' && t !== 'null');
  if (!members.length) return undefined;
  const out = [];
  for (const member of members) {
    if (/^'[^']*'$/.test(member)) out.push(member.slice(1, -1));
    else if (types.has(member)) out.push(...types.get(member));
    else return undefined;
  }
  return out;
}

// The labelling rules of the agent skill (packages/cli/skill-template/SKILL.md):
// form controls and tables need `label`, a button needs it when it only holds an
// icon, and checkboxes, switches and radios take their label as content.
const isFormControl = (el) => el.attributes?.some((a) => a.name === 'label') && el.members?.some((m) => m.name === 'validity');
const labelRule = (el) => {
  if (isFormControl(el) || ['uf-checkbox-group', 'uf-table'].includes(el.tagName)) return 'required';
  if (el.tagName === 'uf-button') return 'icon-only';
  if (['uf-checkbox', 'uf-switch', 'uf-radio'].includes(el.tagName)) return 'content';
  return undefined;
};

const types = literalTypes();

/** The wrapper components of a page (UfTabs, UfTab, UfTabPanel), and their Angular entry points. */
function wrappers(page) {
  const els = page.tags.filter((tag) => elements.has(tag)).map((tag) => elements.get(tag));
  const names = els.map((el) => el.name);
  const angular = new Map();
  for (const el of els) {
    const entry = coreImportPath(el.modulePath).replace('@unframed/core/', '@unframed/angular/');
    angular.set(entry, [...(angular.get(entry) ?? []), el.name]);
  }
  return { names, angular: [...angular].map(([entry, list]) => `import { ${list.join(', ')} } from '${entry}';`) };
}

/**
 * The imports in each framework, inserted after the Tags line of a page's docs.
 * The examples are HTML: agents writing React or Vue need the wrapper names, and
 * guess subpaths like @unframed/react/button without them.
 */
function importSection(page) {
  const { names, angular } = wrappers(page);
  const list = names.join(', ');
  return [
    '## Import in each framework',
    '',
    '```ts',
    `// HTML, Lit, Svelte and others: register the tags`,
    ...pageImports(page, elements).map((p) => `import '${p}';`),
    `// React: one entry point, no subpaths`,
    `import { ${list} } from '@unframed/react';`,
    `// Vue: one entry point, no subpaths`,
    `import { ${list} } from '@unframed/vue';`,
    `// Angular: per-component entry points, or UNFRAMED from '@unframed/angular' for all`,
    ...angular,
    '```',
    '',
    `The examples below are HTML. In React and Vue, use \`<${names[0]}>\` and pass the properties in the API tables as props (camelCase in React, like \`rowKey\`). get_framework_guide has the setup, events and v-model.`,
  ].join('\n');
}

/** A page's docs with the framework imports after its Tags line. */
function docsWithImports(page) {
  const docs = componentMarkdown(page, elements);
  const at = docs.indexOf('\n\n', docs.indexOf('\nTags: ') + 1);
  return `${docs.slice(0, at)}\n\n${importSection(page)}${docs.slice(at)}`;
}
const isPublicField = (m) => m.kind === 'field' && !m.static && m.privacy !== 'private' && m.privacy !== 'protected';

const data = {
  version: coreVersion(),
  frameworks: await frameworkGuides(),
  components: pages.map((page) => ({
    name: page.slug,
    title: page.title,
    summary: elements.get(page.tags[0])?.summary ?? '',
    tags: page.tags,
    imports: pageImports(page, elements),
    wrappers: wrappers(page).names,
    docs: docsWithImports(page),
  })),
  elements: Object.fromEntries(
    [...elements.values()].map((el) => [
      el.tagName,
      {
        attributes: (el.attributes ?? []).map((a) => ({
          name: a.name,
          ...(a.type?.text === 'boolean' ? { boolean: true } : {}),
          ...(values(a.type?.text, types) ? { values: values(a.type?.text, types) } : {}),
        })),
        properties: (el.members ?? []).filter(isPublicField).map((m) => m.name),
        events: (el.events ?? []).map((e) => e.name),
        ...(labelRule(el) ? { label: labelRule(el) } : {}),
        // Form controls get v-model in Vue: modelValue and update:modelValue, plus v-model:<synced>.
        ...(formModels[el.tagName] ? { model: { synced: formModels[el.tagName].synced ?? [] } } : {}),
      },
    ]),
  ),
};

writeFileSync(new URL('../data.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`data: ${data.components.length} components, ${Object.keys(data.elements).length} elements, Unframed ${data.version}`);
