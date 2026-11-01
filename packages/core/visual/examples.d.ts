declare module 'virtual:examples' {
  /** The component pages of the docs site, from scripts/docs-markdown.mjs. */
  const pages: { slug: string; title: string; examples: { title: string; html: string }[] }[];
  export default pages;
}
