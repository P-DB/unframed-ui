// Builds data.json: what the server knows about every component (summary,
// tags, imports, and its docs as Markdown). Generated from the same sources as
// the website and the CLI's agent skill, and shipped with the package, so the
// server works offline and always matches its version.
import { writeFileSync } from 'node:fs';
import { componentMarkdown, componentPages, coreVersion, elementsByTag, pageImports } from '../../../scripts/docs-markdown.mjs';

const elements = elementsByTag();
const pages = componentPages();

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
};

writeFileSync(new URL('../data.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`data: ${data.components.length} components, Unframed ${data.version}`);
