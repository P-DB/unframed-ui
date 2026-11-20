// Builds data.json: what the server knows about every component (summary,
// tags, imports, and its docs as Markdown) and every element's API, for
// validate_usage. Generated from the same sources as the website and the CLI's
// agent skill, and shipped with the package, so the server works offline and
// always matches its version.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentMarkdown, componentPages, coreVersion, elementsByTag, pageImports } from '../../../scripts/docs-markdown.mjs';
import { formModels } from '../../../scripts/form-models.mjs';

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
const isPublicField = (m) => m.kind === 'field' && !m.static && m.privacy !== 'private' && m.privacy !== 'protected';

const data = {
  version: coreVersion(),
  components: pages.map((page) => ({
    name: page.slug,
    title: page.title,
    summary: elements.get(page.tags[0])?.summary ?? '',
    tags: page.tags,
    imports: pageImports(page, elements),
    docs: componentMarkdown(page, elements),
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
