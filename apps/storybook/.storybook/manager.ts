import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// The documentation website. Storybook is deployed at its /storybook/ path.
const docsUrl = 'https://p-db.github.io/unframed-ui/';

addons.setConfig({
  theme: create({
    base: 'light',
    // The title in the sidebar's top-left corner links back to the docs.
    brandTitle: 'Unframed · back to the docs',
    brandUrl: docsUrl,
    brandTarget: '_self',
    colorPrimary: '#6930c3',
    colorSecondary: '#6930c3',
  }),
});
