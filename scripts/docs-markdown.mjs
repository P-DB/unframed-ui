// Markdown docs for AI assistants, from the same sources as the website:
// the Custom Elements Manifest (API), the website's examples (apps/website/src/demos.tsx)
// and its framework guides (apps/website/src/pages/frameworks/snippets.ts).
// Used by the website's llms.txt and by the CLI's agent skill.
import { readFileSync } from 'node:fs';
import { coreImportPath, readElements } from './form-models.mjs';

const repo = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, repo), 'utf8');

export const manifest = () => JSON.parse(read('packages/core/custom-elements.json'));
export const coreVersion = () => JSON.parse(read('packages/core/package.json')).version;

/** Every custom element in the manifest, keyed by tag. */
export function elementsByTag() {
  return new Map(readElements(manifest()).map((el) => [el.tagName, el]));
}

const cell = (text = '') => String(text).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
const table = (head, rows) =>
  rows.length ? [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n') : '';
const code = (text) => (text ? `\`${String(text).replace(/`/g, "'")}\`` : '');

/** One element's API as Markdown: attributes, properties, methods, events, slots, parts, CSS properties. */
export function elementApi(el) {
  const fields = (el.members ?? []).filter((m) => m.kind === 'field' && !m.static && m.privacy !== 'private' && m.privacy !== 'protected');
  const methods = (el.members ?? []).filter((m) => m.kind === 'method' && !m.static && m.privacy !== 'private' && m.privacy !== 'protected');
  const sections = [
    ['Attributes and properties', table(
      ['Attribute', 'Property', 'Type', 'Default', 'Description'],
      fields.filter((f) => f.attribute).map((f) => [code(f.attribute), f.name === f.attribute ? '' : code(f.name), code(f.type?.text), code(f.default), f.description]),
    )],
    ['Properties only', table(
      ['Property', 'Type', 'Description'],
      fields.filter((f) => !f.attribute).map((f) => [code(f.name), code(f.type?.text), `${f.readonly ? 'Read-only. ' : ''}${f.description ?? ''}`]),
    )],
    ['Methods', table(
      ['Method', 'Description'],
      methods.map((m) => [code(`${m.name}(${(m.parameters ?? []).map((p) => `${p.name}${p.default ? '?' : ''}: ${p.type?.text ?? 'unknown'}`).join(', ')})`), m.description]),
    )],
    ['Events', table(['Event', 'Type', 'Description'], (el.events ?? []).map((e) => [code(e.name), code(e.type?.text), e.description]))],
    ['Slots', table(['Slot', 'Description'], (el.slots ?? []).map((s) => [s.name ? code(s.name) : '(default)', s.description]))],
    ['CSS parts', table(['Part', 'Description'], (el.cssParts ?? []).map((p) => [code(p.name), p.description]))],
    ['CSS custom properties', table(['Property', 'Description'], (el.cssProperties ?? []).map((p) => [code(p.name), p.description]))],
  ];
  return sections.filter(([, body]) => body).map(([title, body]) => `#### ${title}\n\n${body}`).join('\n\n');
}

// --- Examples from the website's demos.tsx -----------------------------------

const quoted = String.raw`'((?:[^'\\]|\\.)*)'`;
const unescape = (s) => s.replace(/\\(.)/g, '$1');

/**
 * The component pages of the website, read from demos.tsx: slug, title, tags,
 * core module, and each example's title, description, HTML and notes.
 */
export function componentPages() {
  const source = read('apps/website/src/demos.tsx');
  const start = source.indexOf('export const pages: Page[] = [');
  const chunks = source.slice(start).split(/\n  \{\n    slug: /).slice(1);
  const pages = chunks.map((chunk) => {
    const field = (name) => unescape(new RegExp(`\\b${name}: ${quoted}`).exec(chunk)?.[1] ?? '');
    const slug = unescape(new RegExp(`^${quoted}`).exec(chunk)?.[1] ?? '');
    const tags = [...(/tags: \[([^\]]*)\]/.exec(chunk)?.[1] ?? '').matchAll(new RegExp(quoted, 'g'))].map((m) => m[1]);
    const examples = chunk
      .split(/\n      \{\n        title: /)
      .slice(1)
      .map((ex) => ({
        title: unescape(new RegExp(`^${quoted}`).exec(ex)?.[1] ?? ''),
        description: unescape(new RegExp(`\\n        description: ${quoted}`).exec(ex)?.[1] ?? ''),
        html: /\n        html: code\(`([\s\S]*?)`\)/.exec(ex)?.[1].trim() ?? '',
        notes: [...(/\n        notes: \[([\s\S]*?)\n?\s*\],/.exec(ex)?.[1] ?? '').matchAll(new RegExp(quoted, 'g'))].map((m) => unescape(m[1])),
      }));
    return { slug, title: field('title'), tags, module: field('module'), examples };
  });
  // A change in demos.tsx's layout must not silently drop examples.
  const empty = pages.filter((p) => !p.slug || !p.tags.length || !p.examples.length || p.examples.some((e) => !e.html));
  if (!pages.length || empty.length) {
    throw new Error(`docs-markdown: could not read examples for ${empty.map((p) => p.slug || '?').join(', ') || 'any page'} from demos.tsx`);
  }
  return pages;
}

/** The @unframed/core entries that register a page's tags, e.g. checkbox and checkbox-group. */
export function pageImports(page, elements) {
  const paths = page.tags.filter((tag) => elements.has(tag)).map((tag) => coreImportPath(elements.get(tag).modulePath));
  return [...new Set([`@unframed/core/${page.module}`, ...paths])];
}

/** A component page as Markdown: description, import, examples, then the API of each tag. */
export function componentMarkdown(page, elements, { headingLevel = 1 } = {}) {
  const h = (n) => '#'.repeat(headingLevel + n - 1);
  const main = elements.get(page.tags[0]);
  const parts = [
    `${h(1)} ${page.title}`,
    main?.description ?? main?.summary ?? '',
    `Tags: ${page.tags.map((t) => `\`<${t}>\``).join(', ')}. Import: ${pageImports(page, elements).map((p) => `\`import '${p}';\``).join(', ')} (or \`npx @unframed/cli add ${pageImports(page, elements).map((p) => p.replace('@unframed/core/', '')).join(' ')}\` to copy the source).`,
    ...page.examples.flatMap((ex) => [
      `${h(2)} ${ex.title}`,
      ex.description,
      `\`\`\`html\n${ex.html}\n\`\`\``,
      ex.notes.length ? ex.notes.map((n) => `- ${n}`).join('\n') : '',
    ]),
    ...page.tags.filter((tag) => elements.has(tag)).flatMap((tag) => [`${h(2)} \`<${tag}>\` API`, elementApi(elements.get(tag)).replace(/^#### /gm, `${h(3)} `)]),
  ];
  return `${parts.filter(Boolean).join('\n\n')}\n`;
}

// --- Framework guides from snippets.ts ---------------------------------------

/** The framework guides as Markdown, keyed by html, react, vue and angular. */
export async function frameworkGuides() {
  const s = await import(new URL('apps/website/src/pages/frameworks/snippets.ts', repo).href);
  const block = (lang, text) => `\`\`\`${lang}\n${text}\n\`\`\``;
  return {
    html: `# HTML & JavaScript

Unframed components are standard custom elements: use them in plain HTML, or in any framework without its own package (Svelte, Solid, Astro, Lit…).

## Install

${block('bash', s.html.install)}

## Set up

Load the tokens once, then import the components you use. Each import registers its tags.

${block('js', s.html.setup)}

## Use the components

Form controls join the surrounding \`<form>\` like native ones: \`required\`, \`FormData\`, reset and validation messages work. Form controls fire native \`input\` and \`change\`; other components fire \`uf-*\` events (\`uf-show\`, \`uf-hide\`, \`uf-tab-change\`…). Methods like \`dialog.show()\` are on the elements.

${block('html', s.html.markup)}

${block('js', s.html.script)}

## Without a build step

${block('html', s.html.cdn)}

## TypeScript

Importing a component adds its tag to \`HTMLElementTagNameMap\`:

${block('ts', s.html.types)}
`,
    react: `# React

\`@unframed/react\` has a React component for every element (\`UfButton\`, \`UfDialog\`…), with typed props and camelCase event handlers. React 18 and 19.

## Install

${block('bash', s.react.install)}

## Set up

${block('tsx', s.react.setup)}

## Use the components

Props are the element's properties. Events: \`onInput\` and \`onChange\` for form controls, \`on\` + the camelCase event name for the rest (\`uf-hide\` → \`onUfHide\`). Read values from \`event.target\` (the element). \`toast()\` and \`registerIcons()\` come from \`@unframed/core\`.

${block('tsx', s.react.app)}

## Methods and refs

${block('tsx', s.react.ref)}
`,
    vue: `# Vue

\`@unframed/vue\` has a Vue component for every element, with typed props and events, and \`v-model\` on every form control. No Vite configuration needed.

## Install

${block('bash', s.vue.install)}

## Set up

${block('ts', s.vue.setup)}

## Use the components

\`v-model\` binds \`value\` on inputs, textareas, selects, comboboxes and radio groups, \`checked\` on checkboxes and switches, and an array on checkbox groups (\`v-model:indeterminate\` for a checkbox's indeterminate state). Events keep their names: \`@input\`, \`@change\`, \`@uf-hide\`. Slots are the element's slots: \`slot="footer"\` on the child.

${block('vue', s.vue.app)}

## Register globally

${block('ts', s.vue.plugin)}

## Plain <uf-*> tags

${block('ts', s.vue.plainTags)}
`,
    angular: `# Angular

\`@unframed/angular\` has standalone components with typed inputs and outputs, and form directives for \`ngModel\`, \`formControl\` and \`formControlName\`. Angular 20 or later. No \`CUSTOM_ELEMENTS_SCHEMA\` needed.

## Install

${block('bash', s.angular.install)}

## Set up

${block('css', s.angular.setup)}

## Use the components

Outputs keep the event names: \`(input)\`, \`(change)\`, \`(uf-hide)\`. \`UNFRAMED\` imports every component and form directive (and bundles all of them); import single components by name, or from their entry point (\`@unframed/angular/input\`), to ship only what you use.

${block('ts', s.angular.component)}

${block('html', s.angular.template)}

## Bundle only what you use

${block('ts', s.angular.entries)}

## Template-driven forms

${block('ts', s.angular.ngModel)}

## Methods

Each component exposes its element as \`el\`:

${block('ts', s.angular.methods)}
`,
  };
}
