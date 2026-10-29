# @unframed/react

## 0.12.0

### Minor Changes

- 5163e46: Three new components:
  
  - `<uf-divider>`: a horizontal or vertical separator, with an optional label like "or".
  - `<uf-skeleton>`: a placeholder for content that's loading, as lines of text, a block or a circle, with a shimmer that stops for reduced motion. It's hidden from screen readers: mark the loading region with `aria-busy="true"`.
  - `<uf-number-input>`: a number field with minus and plus buttons, `min`, `max` and `step`, and `stepUp()`/`stepDown()`. Its value is a number, or `null` while empty: `v-model` in Vue, and `ngModel`/`formControl` in Angular with the new `UfOptionalNumberValueAccessor`. New translatable texts `decrease` and `increase`, in every built-in language.

### Patch Changes

- Updated dependencies [69320d1]
- Updated dependencies [5163e46]
- Updated dependencies [fcfe53f]
  - @unframed/core@0.12.0

## 0.11.0

### Minor Changes

- 2e09890: New `<uf-alert>`: a message in the page, like "Your trial ends in 3 days". Six variants by meaning (`info` by default), each with its icon; a `heading`, `actions` below the message, and `closable` for a close button that hides it (`hide()`, `show()`, `uf-hide`, `uf-show`). `warning` and `danger` alerts are announced right away, the others politely.

### Patch Changes

- Updated dependencies [2e09890]
- Updated dependencies [ad59a0b]
- Updated dependencies [f79c00c]
  - @unframed/core@0.11.0

## 0.10.0

### Minor Changes

- 0d36b86: API review before 1.0. Some names change, so check the migration notes.
  
  **Breaking changes**
  
  - `uf-show` and `uf-hide` no longer bubble. Closing a dropdown, combobox or date picker inside a dialog used to fire the dialog's `uf-hide` too (in React, `onUfHide={() => setOpen(false)}` closed the whole dialog). Listen on the component itself, as before; a listener on an ancestor needs `{ capture: true }`.
  - `<uf-tabs>`: `active` is now `value`, like the other components that hold a selection. `<uf-tabs active="billing">` becomes `<uf-tabs value="billing">`, `tabs.active` becomes `tabs.value`.
  - `<uf-card>`: `variant` is now `appearance`, like on the badge (`variant` is a color, `appearance` a style). The type `CardVariant` is now `CardAppearance`.
  - CSS custom properties: `--uf-radio-checked-color` is now `--uf-radio-checked-bg` (like the checkbox and switch), `--uf-slider-fill-color` is now `--uf-slider-indicator-color` (like progress and spinner).
  - `<uf-checkbox-group>`: `sync()` is gone. "Select all" now updates by itself when a checkbox is checked from code.
  
  **New**
  
  - `size="lg"` on badge, pagination and progress.
  - `size` (`sm`, `md`, `lg`) on checkbox, switch, slider and file upload, and on the radio group for its radios.
  - `<uf-tooltip>` emits `uf-show` and `uf-hide`.
  - Toasts have an `accent` variant, with new `--uf-color-toast-accent-*` tokens.
  - The combobox documents the `--uf-field-*` custom properties it already supported.

### Patch Changes

- Updated dependencies [9c5e420]
- Updated dependencies [0d36b86]
- Updated dependencies [bc08067]
  - @unframed/core@0.10.0

## 0.9.0

### Minor Changes

- cfc8621: Two new components:
  
  - `<uf-file-upload>`: choose files with a button or by dragging them onto a drop zone; `accept` and `max-size` refuse files with a clear message; submits like a native file input. `v-model` in Vue binds the files, and Angular gets `UfFilesValueAccessor` for `ngModel` and `formControl`.
  - `<uf-date-range-picker>`: type or pick a start and an end date; the value is an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, with `start` and `end` for the two dates. `<uf-calendar range>` picks a range inline.
  
  New built-in icons `upload` and `file`, and new translatable texts for both components, in every built-in language. The date picker no longer stays open when it's closed from code while still opening.
  
  The Unframed skill is also a Claude Code plugin: `/plugin marketplace add P-DB/unframed-ui`, then `/plugin install unframed@unframed`.

### Patch Changes

- Updated dependencies [8023897]
- Updated dependencies [cfc8621]
- Updated dependencies [1a13a33]
- Updated dependencies [e5e2a12]
  - @unframed/core@0.9.0

## 0.8.0

### Minor Changes

- 38e5886: Five new components:
  
  - `<uf-progress>`: a progress bar, with a value or indeterminate, an optional percentage, and colors by meaning.
  - `<uf-spinner>`: shows that something is loading; announced as "Loading" (translatable) or its `label`.
  - `<uf-slider>`: picks a number in a range, built on the native range input; submits with forms, `v-model` in Vue, `ngModel` and `formControl` in Angular (new `UfNumberValueAccessor`).
  - `<uf-breadcrumbs>` and `<uf-breadcrumb-item>`: the path to the current page, as a navigation landmark, with custom separators.
  - `<uf-drawer>`: a modal panel that slides in from any edge, with everything `<uf-dialog>` does.
  
  New translatable texts: `progress`, `loading` and `breadcrumb`, in every built-in language.

### Patch Changes

- Updated dependencies [38e5886]
  - @unframed/core@0.8.0

## 0.7.0

### Minor Changes

- 5b6a0c3: Server-side rendering: every component is a client component (`'use client'`), so it can be used in Next.js server components, and server-rendered HTML now includes the components' attributes (`variant`, `label`, `value`, `checked`, `disabled`…), so each element starts in the right state before React hydrates. Tabs no longer show every panel on server-rendered pages.

### Patch Changes

- Updated dependencies [2f168c9]
  - @unframed/core@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [e69bcb5]
  - @unframed/core@0.6.1

## 0.6.0

### Patch Changes

- Updated dependencies [68a7151]
- Updated dependencies [9830033]
- Updated dependencies [a5e9cab]
  - @unframed/core@0.6.0

## 0.5.0

### Minor Changes

- 65aec48: New Date picker (`<uf-date-picker>`): type a date in the page language's format or pick one from a calendar popup. The value is `YYYY-MM-DD`; `min`, `max`, `isDateDisabled` and `required` validate natively in forms; `v-model` and Angular forms work. The calendar is also its own element, `<uf-calendar>`. New translation keys for its texts, and for the combobox's result count, which was English only.

### Patch Changes

- Updated dependencies [9103ad2]
- Updated dependencies [65aec48]
- Updated dependencies [9103ad2]
- Updated dependencies [1a3c437]
  - @unframed/core@0.5.0

## 0.4.0

### Patch Changes

- Updated dependencies [89941ad]
  - @unframed/core@0.4.0

## 0.3.0

### Minor Changes

- 453f778: New components: Badge (`<uf-badge>`), Avatar (`<uf-avatar>`), Card (`<uf-card>`), Table (`<uf-table>`) with sorting and custom cells, and Pagination (`<uf-pagination>`). They come with React, Vue and Angular wrappers, and the CLI can copy them. Tokens add `--uf-color-info` and `--uf-color-info-subtle`, and the icon set adds `user`.

### Patch Changes

- f721e60: Angular: every component has its own entry point, like `@unframed/angular/input`, which loads only that component and exports its form directive. Importing components by name from `@unframed/angular` is tree-shaken too: an app using only `UfButton` now bundles about 26 KB of Unframed code instead of 140 KB. `UNFRAMED` still brings everything.
  
  React and Vue: the wrappers for sub-elements (`UfTab`, `UfTabPanel`, `UfMenuItem`, `UfAccordionItem`) load only their component's module instead of the whole library.
- Updated dependencies [453f778]
- Updated dependencies [89fb75d]
  - @unframed/core@0.3.0

## 0.2.0

### Patch Changes

- Updated dependencies [6982a9b]
  - @unframed/core@0.2.0

## 0.1.0

### Minor Changes

- b82e173: First public release: 20 accessible, form-ready web components with design tokens and light/dark themes; React, Vue and Angular packages; and a CLI to copy components into your project.

### Patch Changes

- Updated dependencies [b82e173]
  - @unframed/core@0.1.0
