// Writes the docs for AI assistants into public/, so the dev server and the build serve them (llmstxt.org):
//   llms.txt                 an index: what Unframed is, and links to every page as Markdown
//   llms-full.txt            all of it in one file
//   llms/<page>.md           Installation, Packages, Theming (hand-written, in ../llms)
//   llms/frameworks/<fw>.md  the framework guides
//   llms/components/<c>.md   every component: examples and full API
// The site itself is rendered with JavaScript, so these are what assistants can read.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { componentMarkdown, componentPages, coreVersion, elementsByTag, frameworkGuides } from '../../../scripts/docs-markdown.mjs';

const site = (process.env.SITE_URL ?? 'https://p-db.github.io/unframed-ui/').replace(/\/?$/, '/');
// Generated, so ignored by git; run before dev and build.
const dist = new URL('../public/', import.meta.url);
const handWritten = new URL('../llms/', import.meta.url);

const write = async (path, text) => {
  const url = new URL(path, dist);
  await mkdir(new URL('./', url), { recursive: true });
  await writeFile(url, text);
};

const elements = elementsByTag();
const pages = componentPages();
const guides = await frameworkGuides();
const docs = await Promise.all(
  [
    ['installation', 'Installation', 'Install from npm or copy the source; the AI skill.'],
    ['packages', 'Packages', 'The six packages, what each exports, and which to install.'],
    ['theming', 'Theming', 'Design tokens, component custom properties, CSS parts, dark mode.'],
    ['translations', 'Translations', 'setTranslations(): built-in texts in other languages, per page or per lang attribute.'],
    ['ssr', 'Server-side rendering', 'Next.js, Nuxt and Angular SSR: setup, and what the server renders.'],
    ['ai-assistants', 'AI assistants', 'The Unframed agent skill: install it, what it contains, how to customize it.'],
    ['stability', 'Stability', 'Versioning, what counts as a breaking change, supported browsers and frameworks, deprecations.'],
  ].map(async ([slug, title, summary]) => ({ slug, title, summary, text: await readFile(new URL(`${slug}.md`, handWritten), 'utf8') })),
);
const frameworks = [
  ['html', 'HTML & JavaScript', 'Plain HTML, any other framework, or a CDN.'],
  ['react', 'React', 'Typed components, camelCase event handlers, refs.'],
  ['vue', 'Vue', 'Typed components, v-model on every form control.'],
  ['angular', 'Angular', 'Standalone components, Angular forms, per-component entry points.'],
];

for (const doc of docs) await write(`llms/${doc.slug}.md`, doc.text);
for (const [slug] of frameworks) await write(`llms/frameworks/${slug}.md`, guides[slug]);
for (const page of pages) await write(`llms/components/${page.slug}.md`, componentMarkdown(page, elements));

const intro = `# Unframed

> Accessible UI components as standard web components: they work in React, Vue, Angular, any other framework, or plain HTML. Built with Lit, themed with CSS custom properties, form controls work inside native forms. Version ${coreVersion()}.

- Tags start with \`uf-\` (\`<uf-button>\`, \`<uf-dialog>\`…). Load \`@unframed/tokens/tokens.css\` once, then import components: \`import '@unframed/core/dialog'\`.
- React, Vue and Angular use \`@unframed/react\`, \`@unframed/vue\` or \`@unframed/angular\` for typed props, events and form bindings.
- Form controls (\`uf-input\`, \`uf-select\`, \`uf-checkbox\`…) submit, reset and validate like native ones. Other components fire \`uf-*\` events.
- Style with \`--uf-*\` custom properties first, \`::part()\` for anything else.`;

const index = `${intro}

## Docs

${docs.map((d) => `- [${d.title}](${site}llms/${d.slug}.md): ${d.summary}`).join('\n')}

## Frameworks

${frameworks.map(([slug, title, summary]) => `- [${title}](${site}llms/frameworks/${slug}.md): ${summary}`).join('\n')}

## Components

${pages.map((p) => `- [${p.title}](${site}llms/components/${p.slug}.md): ${elements.get(p.tags[0])?.summary ?? ''}`).join('\n')}

## Optional

- [Everything in one file](${site}llms-full.txt)
- [Custom Elements Manifest](https://unpkg.com/@unframed/core@${coreVersion()}/custom-elements.json): the full API as JSON
- [Storybook](${site}storybook/): every component and state, with live controls
- [Source on GitHub](https://github.com/P-DB/unframed-ui)
`;

const full = [
  intro,
  ...docs.map((d) => d.text),
  ...frameworks.map(([slug]) => guides[slug]),
  '# Components',
  ...pages.map((page) => componentMarkdown(page, elements, { headingLevel: 2 })),
].join('\n\n');

await write('llms.txt', index);
await write('llms-full.txt', full);
console.log(`llms: llms.txt, llms-full.txt (${Math.round(full.length / 1024)} KB), ${docs.length + frameworks.length + pages.length} Markdown pages`);
