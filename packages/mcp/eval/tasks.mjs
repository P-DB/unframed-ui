// The eval's tasks: requests written the way a developer would ask, without
// hinting at attribute or event names. `uses` lists the components the result
// must contain, as custom element tags (React and Vue components are matched
// by their tag, e.g. UfSelect is uf-select).
export const tasks = [
  {
    id: 'react-settings',
    file: 'src/SettingsForm.tsx',
    prompt:
      'Create src/SettingsForm.tsx: a React component SettingsForm for account settings. Fields: display name, ' +
      'language (English, Italiano, Español), a dark mode switch and an "email me about updates" checkbox. ' +
      'At the bottom, Cancel and Save buttons; Save submits the form.',
    uses: ['uf-input', 'uf-select', 'uf-switch', 'uf-checkbox', 'uf-button'],
  },
  {
    id: 'react-orders',
    file: 'src/OrdersTable.tsx',
    prompt:
      'Create src/OrdersTable.tsx: a React component OrdersTable that takes `orders: { id: string; customer: string; ' +
      'date: string; amount: number }[]` and shows them in a table that can be sorted by date and by amount, with ' +
      'pagination of 20 rows per page.',
    uses: ['uf-table', 'uf-pagination'],
  },
  {
    id: 'react-delete',
    file: 'src/DeleteProjectButton.tsx',
    prompt:
      'Create src/DeleteProjectButton.tsx: a React component DeleteProjectButton({ onDelete }: { onDelete: () => void }). ' +
      'It shows a red "Delete project" button that opens a confirmation dialog with a title, a short warning, and ' +
      'Cancel and Delete buttons. Delete calls onDelete, closes the dialog and shows a success toast.',
    uses: ['uf-button', 'uf-dialog'],
  },
  {
    id: 'react-toolbar',
    file: 'src/EditorToolbar.tsx',
    prompt:
      'Create src/EditorToolbar.tsx: a React component EditorToolbar for a text editor. It has small buttons with ' +
      'only an icon for bold, italic and link, each with a tooltip, and a "more" button that opens a menu with ' +
      'Duplicate and Delete.',
    uses: ['uf-button', 'uf-icon', 'uf-tooltip'],
  },
  {
    id: 'vue-filters',
    file: 'src/components/FilterBar.vue',
    prompt:
      'Create src/components/FilterBar.vue (Vue 3, <script setup lang="ts">): a filter bar with a search field, ' +
      'a status filter where several statuses can be picked (Open, Closed, Archived), a date range picker and a ' +
      'Reset button. It emits "change" with the current filters whenever one changes.',
    uses: ['uf-input', 'uf-multi-select', 'uf-date-range-picker', 'uf-button'],
  },
  {
    id: 'html-signup',
    file: 'signup.html',
    prompt:
      'Create signup.html: a plain HTML sign-up page (no framework) with email, password, an "I accept the terms" ' +
      'checkbox and a Create account button that submits the form. Load the components from @unframed/core in a ' +
      'module script, as a bundler would resolve them.',
    uses: ['uf-input', 'uf-checkbox', 'uf-button'],
  },
];

/** What each condition gives the agent. */
export const conditions = {
  baseline: { skill: false, mcp: false },
  skill: { skill: true, mcp: false },
  mcp: { skill: false, mcp: true },
  'skill+mcp': { skill: true, mcp: true },
};
