# Unframed

[![npm](https://img.shields.io/npm/v/@unframed/core?label=npm&color=6930c3)](https://www.npmjs.com/org/unframed)
[![CI](https://github.com/P-DB/unframed-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/P-DB/unframed-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/@unframed/core?color=6930c3)](LICENSE)
[![Docs](https://img.shields.io/badge/docs-p--db.github.io-6930c3)](https://p-db.github.io/unframed-ui/)

**UI components that don't care about your framework.**

Unframed is a library of accessible, themeable web components built with [Lit](https://lit.dev). They work in React, Vue, Angular, Svelte, Astro, plain HTML, or anything else that renders the DOM.

> Status: early development (v0). APIs may change before 1.0.

## Packages

| Package | Version | Description |
|---|---|---|
| [`@unframed/core`](packages/core) | [![npm](https://img.shields.io/npm/v/@unframed/core?label=&color=6930c3)](https://www.npmjs.com/package/@unframed/core) | The web components (`<uf-button>`, …) |
| [`@unframed/tokens`](packages/tokens) | [![npm](https://img.shields.io/npm/v/@unframed/tokens?label=&color=6930c3)](https://www.npmjs.com/package/@unframed/tokens) | Design tokens as CSS custom properties (light + dark) |
| [`@unframed/react`](packages/react) | [![npm](https://img.shields.io/npm/v/@unframed/react?label=&color=6930c3)](https://www.npmjs.com/package/@unframed/react) | Typed React wrappers, generated from the components' manifest |
| [`@unframed/vue`](packages/vue) | [![npm](https://img.shields.io/npm/v/@unframed/vue?label=&color=6930c3)](https://www.npmjs.com/package/@unframed/vue) | Vue components with `v-model` and typed template props, generated from the manifest |
| [`@unframed/angular`](packages/angular) | [![npm](https://img.shields.io/npm/v/@unframed/angular?label=&color=6930c3)](https://www.npmjs.com/package/@unframed/angular) | Angular standalone components and form directives (`ngModel`, `formControl`), generated from the manifest |
| [`@unframed/cli`](packages/cli) | [![npm](https://img.shields.io/npm/v/@unframed/cli?label=&color=6930c3)](https://www.npmjs.com/package/@unframed/cli) | Copies components into your project so you own the code |

## Components

| Component | Tag | Notes |
|---|---|---|
| Button | `<uf-button>` | 6 variants (including `link`), 3 sizes, loading, link mode, form submit/reset |
| Icon | `<uf-icon>` | Built-in set, plus `registerIcons()` for your own |
| Input | `<uf-input>` | Label, hint and validation built in; form-associated |
| Textarea | `<uf-textarea>` | `resize="auto"` grows with content |
| Select | `<uf-select>` | Wraps the native `<select>`: write plain `<option>` children |
| Combobox | `<uf-combobox>` | Searchable, fully styled list; same `<option>` children as select |
| Date picker | `<uf-date-picker>` + `<uf-calendar>` | Type or pick a date; format, month names and first weekday follow `lang`; value is `YYYY-MM-DD` |
| Date range picker | `<uf-date-range-picker>` | Type or pick a start and an end date; value is an ISO interval, `YYYY-MM-DD/YYYY-MM-DD`; `<uf-calendar range>` inline |
| Checkbox | `<uf-checkbox>` | Indeterminate state |
| Switch | `<uf-switch>` | `role="switch"` |
| Radio group | `<uf-radio-group>` + `<uf-radio>` | Arrow-key navigation, roving focus |
| Tabs | `<uf-tabs>` + `<uf-tab>` + `<uf-tab-panel>` | Automatic or manual activation, vertical layout |
| Accordion | `<uf-accordion>` + `<uf-accordion-item>` | Native `<details>`, one or many open, arrow keys, find-in-page |
| Dropdown menu | `<uf-dropdown>` + `<uf-menu>` + `<uf-menu-item>` | Menu-button pattern, typeahead, checkbox items, `<hr>` separators |
| Dialog | `<uf-dialog>` | Native modal `<dialog>`, cancellable close, `data-dialog="close"` |
| Popover | `<uf-popover>` | Popover API, flips at viewport edges |
| Tooltip | `<uf-tooltip>` | Hover and focus, Escape to dismiss, exposed as `aria-description` |
| Toast | `toast()` / `<uf-toaster>` | Live region in the top layer, pauses on hover |
| Alert | `<uf-alert>` | A message in the page: 6 colors by meaning, heading, actions, closable |
| Badge | `<uf-badge>` | 6 colors by meaning, soft, solid or outline, status dot |
| Avatar | `<uf-avatar>` | Image, then initials, then an icon; 4 sizes, circle or square |
| Divider | `<uf-divider>` | Horizontal or vertical separator, with an optional label like "or" |
| Card | `<uf-card>` | Media, header, content and footer slots; empty ones take no space |
| Table | `<uf-table>` | Native `<table>` from `columns` and `rows`, sorting, custom cells, sticky header |
| Pagination | `<uf-pagination>` | Collapsing page ranges, keyboard friendly, pairs with the table |
| Slider | `<uf-slider>` | Native range input, label and hint, `v-model` and `ngModel` as a number |
| Number input | `<uf-number-input>` | Minus and plus buttons, `min`/`max`/`step`, a number or `null` for `v-model` and `ngModel` |
| Progress | `<uf-progress>` | Value or indeterminate, percentage, colors by meaning |
| Spinner | `<uf-spinner>` | Announced as "Loading", 3 sizes, slows down for reduced motion |
| Skeleton | `<uf-skeleton>` | Text lines, block or circle placeholders, hidden from screen readers, still for reduced motion |
| Breadcrumbs | `<uf-breadcrumbs>` + `<uf-breadcrumb-item>` | Navigation landmark, current page marked, custom separators |
| Drawer | `<uf-drawer>` | A modal panel from any edge, with everything the dialog does |
| File upload | `<uf-file-upload>` | Button and drop zone, `accept` and `max-size` with clear refusals, submits like a native file input |

Built-in texts (a dialog's close button, "No results"…) can be translated with `setTranslations()`, for one language or several, following the page's `lang`.

Every form control works inside a native `<form>`: it submits its value, resets, validates (`required`, `pattern`, `min`…), and respects `<fieldset disabled>`. Errors show inline after the user interacts or tries to submit, and `:state(user-invalid)` lets you style them.

## Quick start

```bash
npm install @unframed/core @unframed/tokens
```

```js
import '@unframed/tokens/tokens.css';
import '@unframed/core/button'; // registers <uf-button>; one import per component
```

```html
<form>
  <uf-input name="email" type="email" label="Email" required></uf-input>
  <uf-select name="country" label="Country" placeholder="Choose…">
    <option value="it">Italy</option>
    <option value="fr">France</option>
  </uf-select>
  <uf-checkbox name="terms" required>I accept the terms</uf-checkbox>
  <uf-button type="submit">Create account</uf-button>
</form>
```

```js
import '@unframed/core'; // registers every component (or import them one by one)
import { toast } from '@unframed/core/toast';

toast('Saved', { variant: 'success' });
```

### Vue

```bash
npm install @unframed/vue @unframed/tokens
```

```vue
<script setup lang="ts">
import '@unframed/tokens/tokens.css';
import { UfCheckbox, UfInput } from '@unframed/vue';
const email = ref('');
const agree = ref(false);
</script>

<template>
  <UfInput v-model="email" type="email" label="Email" required />
  <UfCheckbox v-model="agree">I accept the terms</UfCheckbox>
</template>
```

Props and events are type-checked in templates (vue-tsc / Volar). `app.use(UnframedVue)` registers everything globally.

### Angular

```bash
npm install @unframed/angular @unframed/tokens
```

```ts
@Component({
  imports: [UNFRAMED, ReactiveFormsModule],
  template: `<uf-input [formControl]="email" type="email" label="Email" required />`,
})
export class SignupComponent {
  email = new FormControl('');
}
```

Standalone components with typed inputs and outputs (`(uf-tab-change)`), plus form directives so `ngModel`, `formControl` and `formControlName` work. No `CUSTOM_ELEMENTS_SCHEMA` needed.

### Own the code

Prefer to edit components yourself? Copy them into your project instead of installing them:

```bash
npx @unframed/cli init          # choose a folder, TS or JS, and how to get the tokens
npx @unframed/cli add dialog combobox
```

This copies each component's source, plus the shared helpers and other components it needs, into `src/components/uf-ui/` (configurable in `unframed.json`). The files are yours: change anything. `add` never overwrites a file you edited unless you pass `--overwrite`, and `npx @unframed/cli diff` shows how your copies differ from the latest version. `npx @unframed/cli add tokens` copies the tokens CSS too.

Use each component either from npm or as a copy, not both: they register the same tag (e.g. `<uf-button>`).

### React

```bash
npm install @unframed/react @unframed/tokens
```

```tsx
import '@unframed/tokens/tokens.css';
import { UfButton, UfTabs } from '@unframed/react';

<UfButton variant="danger" loading={saving} onClick={remove}>Delete</UfButton>;
<UfTabs onUfTabChange={(e) => setTab(e.detail.name)}>…</UfTabs>;
```

React 19 also supports the elements directly; the wrappers add typed props and camelCase event handlers.

## Theming

Everything is driven by CSS custom properties. Three levels, from broad to precise:

```css
/* 1. Retheme everything: override a primitive or semantic token */
:root {
  --uf-palette-accent-600: #0f766e;
  --uf-radius-md: 999px;
}

/* 2. Restyle one component */
uf-button.pill {
  --uf-button-radius: 999px;
}

/* 3. Reach inside with parts */
uf-button::part(base) {
  text-transform: uppercase;
}
```

Dark mode follows `prefers-color-scheme` automatically. Force a theme with `data-uf-theme="light"` or `"dark"` on any element.

## Conventions

- **Tags:** `uf-*` · **Events:** `uf-*` (e.g. `uf-change`) · **CSS:** `--uf-*` and `::part()`
- Each component lives in `packages/core/src/components/<name>/` with `<name>.ts`, `<name>.styles.ts` and `<name>.test.ts`.
- Components document their API with JSDoc (`@tag`, `@slot`, `@csspart`, `@cssprop`, `@event`). The build turns that into `custom-elements.json`, which drives IDE autocomplete, the React wrappers and (soon) the docs.
- Form controls are form-associated through `ElementInternals`.
- Every component has an axe accessibility test, and the tests run in Chromium, Firefox and WebKit.

## Apps

| App | What | Run |
|---|---|---|
| [`apps/storybook`](apps/storybook) | Workbench: every component with live controls, API tables from `custom-elements.json`, and axe checks per story | `npm run storybook` → http://localhost:6006 |
| [`apps/website`](apps/website) | Public docs and showcase (React + React Router), dogfooding `@unframed/react` | `npm run website` → http://localhost:5190 |

Both read the component sources directly, so edits show up without rebuilding. API tables on both come from the same manifest; the core build fails if a public attribute, property, method or event has no JSDoc description.

## Development

```bash
npm install
npx playwright install chromium firefox webkit   # once, for browser tests
npm run dev        # playground at http://localhost:5180
npm run storybook  # Storybook at http://localhost:6006
npm run website    # docs site at http://localhost:5190
npm run build      # tokens → core (+ manifest) → react wrappers
npm test           # Vitest browser mode: core in headless Chromium, Firefox and WebKit
npm run changeset  # describe a change for the next release
```

## License

MIT © Patrizio Di Bartolomeo
