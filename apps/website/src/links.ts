/** Storybook runs on its own dev server locally, and is deployed next to the site. */
export const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006' : `${import.meta.env.BASE_URL}storybook/`;

/** A component's docs page in Storybook, from its story title: "Radio group" -> components-radio-group--docs. */
export function storybookDocsUrl(title: string): string {
  const id = `components-${title.toLowerCase().replace(/\s+/g, '-')}--docs`;
  return `${storybookUrl.replace(/\/?$/, '/')}?path=/docs/${id}`;
}
