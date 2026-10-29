---
name: unframed
description: Builds UI with Unframed web components (@unframed/core, @unframed/react, @unframed/vue, @unframed/angular, <uf-*> tags) in HTML, React, Vue or Angular, including forms, events, tables, dialogs and theming with --uf-* tokens. Use when the project depends on @unframed/* packages, the code uses <uf-*> tags, or the user asks for Unframed components.
---

# Unframed UI

Unframed 0.10.0: accessible UI components as standard custom elements (Lit). Every tag starts with `uf-`. They work in plain HTML and every framework; React, Vue and Angular have wrapper packages for typed props, events and form bindings.

## Before writing code

1. Check `package.json` for which packages the project uses: `@unframed/react`, `@unframed/vue`, `@unframed/angular`, or `@unframed/core` alone. If `unframed.json` exists, components were copied into the project with the CLI: import them from that folder, not from npm.
2. Read the setup for that framework in [references/frameworks.md](references/frameworks.md).
3. Before using a component, read its section in [references/components.md](references/components.md): attributes, events, slots and an example. Don't guess attribute names.

## Rules

- **Tokens once.** Load `@unframed/tokens/tokens.css` once (app entry or global stylesheet), before any overrides.
- **Import what you use.** `import '@unframed/core/<component>'` registers that component and the ones it needs. In React/Vue/Angular, import the components from the wrapper package instead.
- **Booleans are presence attributes** in HTML: `<uf-button disabled>`, never `disabled="false"`. Props/inputs take real booleans.
- **Events.** Form controls fire native `input` (while typing) and `change` (on commit); read the value from the element (`event.target.value` / `.checked`). Other components fire `uf-*` events (`uf-show`, `uf-hide`, `uf-select`, `uf-tab-change`, `uf-sort`, `uf-page-change`, `uf-request-close`) with data in `event.detail`. React: `onUfHide`, `onUfPageChange`…; Vue: `@uf-hide`; Angular: `(uf-hide)`.
- **Forms.** Form controls are form-associated: give them a `name` and put them in a `<form>`; `required`, `pattern`, `min`… validate natively and errors show under the field. Vue: `v-model`. Angular: `ngModel` / `formControl` / `formControlName` (import the form directives, e.g. `UNFRAMED` or `UfTextValueAccessor`).
- **Labels.** Form controls take `label` (and `hint`); icon-only buttons need `label`; `uf-icon` needs `label` only when it means something; tables need `label`; two `uf-pagination` on one page need different `label`s.
- **Options are children.** `uf-select` and `uf-combobox` take plain `<option>`/`<optgroup>` children. `uf-radio-group` takes `uf-radio`. `uf-tabs` takes `uf-tab` + `uf-tab-panel` (matched by `panel`/`name`).
- **Objects are properties.** `uf-table`'s `columns` and `rows` are arrays: set them as properties (React/Vue/Angular props do this). Only in plain HTML use JSON attributes.
- **Dialogs.** Open with `open` or `.show()`; any child with `data-dialog="close"` closes it; cancel a close in `uf-request-close` with `preventDefault()`.
- **Toasts.** `import { toast } from '@unframed/core'` and call `toast('Saved', { variant: 'success' })`; no element needed.
- **Theming.** Change colors and shapes with `--uf-*` custom properties (global tokens, then per-component ones like `--uf-button-radius`), then `::part()`. Don't style internals any other way, and don't re-implement a component that exists. See [references/theming.md](references/theming.md).
- **Server-side rendering.** Works in Next.js, Nuxt and Angular SSR with no extra setup. In the Next.js App Router, `@unframed/react` components are client components already: use them in server components, and put event handlers and state in a `'use client'` file. Don't wrap them in `dynamic(..., { ssr: false })` or client-only guards.
- **Translations.** Built-in texts (dialog close button, "No results", pagination labels, a few error messages) are English. Italian, French, German, Spanish and Portuguese are built in: `import it from '@unframed/core/locales/it'; setTranslations(it, 'it')` (codes `it`, `fr`, `de`, `es`, `pt`), once at startup. For other languages, pass the texts yourself: `setTranslations({ close: 'Zamknij', page: 'Strona {page}' }, 'pl')`; components follow the nearest `lang` attribute. Don't add `aria-label`s to override them.
- **Dark mode** follows the OS; force it with `data-uf-theme="dark"` (or `"light"`) on any element.

## Components

| Component | Tags | Import |
|---|---|---|
| Accordion: A stack of sections that expand and collapse. | `<uf-accordion>` `<uf-accordion-item>` | `@unframed/core/accordion` |
| Alert: Shows a message in the page, by meaning: info, success, warning or danger. | `<uf-alert>` | `@unframed/core/alert` |
| Avatar: Shows a person's picture, initials or icon. | `<uf-avatar>` | `@unframed/core/avatar` |
| Badge: Labels a status, a category or a count. | `<uf-badge>` | `@unframed/core/badge` |
| Breadcrumbs: Shows the path to the current page. | `<uf-breadcrumbs>` `<uf-breadcrumb-item>` | `@unframed/core/breadcrumbs` |
| Button: Triggers an action or navigates to a URL. | `<uf-button>` | `@unframed/core/button` |
| Card: Groups related content and actions. | `<uf-card>` | `@unframed/core/card` |
| Checkbox: Lets users turn an option on or off, or pick several options. | `<uf-checkbox>` `<uf-checkbox-group>` | `@unframed/core/checkbox` `@unframed/core/checkbox-group` |
| Combobox: Lets users search a list and pick one option. | `<uf-combobox>` | `@unframed/core/combobox` |
| Date picker: Lets users type or pick a date. | `<uf-date-picker>` `<uf-calendar>` | `@unframed/core/date-picker` `@unframed/core/calendar` |
| Date range picker: Lets users type or pick a start and an end date. | `<uf-date-range-picker>` `<uf-calendar>` | `@unframed/core/date-range-picker` `@unframed/core/calendar` |
| Dialog: Shows content in a modal window on top of the page. | `<uf-dialog>` | `@unframed/core/dialog` |
| Drawer: A panel that slides in from an edge of the screen. | `<uf-drawer>` | `@unframed/core/drawer` |
| Dropdown menu: Opens a menu of actions from a button. | `<uf-dropdown>` `<uf-menu>` `<uf-menu-item>` | `@unframed/core/dropdown` `@unframed/core/menu` |
| File upload: Lets users choose files to upload. | `<uf-file-upload>` | `@unframed/core/file-upload` |
| Icon: Shows a small symbol. | `<uf-icon>` | `@unframed/core/icon` |
| Input: Lets users enter a single line of text. | `<uf-input>` | `@unframed/core/input` |
| Pagination: Moves between the pages of a long list. | `<uf-pagination>` | `@unframed/core/pagination` |
| Popover: Shows floating content next to a trigger. | `<uf-popover>` | `@unframed/core/popover` |
| Progress: Shows how far a task has got. | `<uf-progress>` | `@unframed/core/progress` |
| Radio group: Lets users pick exactly one option from a list. | `<uf-radio-group>` `<uf-radio>` | `@unframed/core/radio-group` `@unframed/core/radio` |
| Select: Lets users pick one option from a dropdown list. | `<uf-select>` | `@unframed/core/select` |
| Slider: Lets users pick a number in a range. | `<uf-slider>` | `@unframed/core/slider` |
| Spinner: Shows that something is loading. | `<uf-spinner>` | `@unframed/core/spinner` |
| Switch: Turns a setting on or off. | `<uf-switch>` | `@unframed/core/switch` |
| Table: Shows data in rows and columns, with sorting. | `<uf-table>` | `@unframed/core/table` |
| Tabs: Organizes content into panels, one visible at a time. | `<uf-tabs>` `<uf-tab>` `<uf-tab-panel>` | `@unframed/core/tabs` |
| Textarea: Lets users enter multiple lines of text. | `<uf-textarea>` | `@unframed/core/textarea` |
| Toast: Shows short, temporary notifications. | `<uf-toaster>` | `@unframed/core/toast` |
| Tooltip: Shows a short hint for the element it wraps. | `<uf-tooltip>` | `@unframed/core/tooltip` |

The full API of each, with examples: [references/components.md](references/components.md). Docs: https://p-db.github.io/unframed-ui/
