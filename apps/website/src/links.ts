/** Storybook runs on its own dev server locally, and is deployed next to the site. */
export const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006' : `${import.meta.env.BASE_URL}storybook/`;
