# @unframed/tokens

## 0.12.0

### Patch Changes

- 5163e46: Three new components:
  
  - `<uf-divider>`: a horizontal or vertical separator, with an optional label like "or".
  - `<uf-skeleton>`: a placeholder for content that's loading, as lines of text, a block or a circle, with a shimmer that stops for reduced motion. It's hidden from screen readers: mark the loading region with `aria-busy="true"`.
  - `<uf-number-input>`: a number field with minus and plus buttons, `min`, `max` and `step`, and `stepUp()`/`stepDown()`. Its value is a number, or `null` while empty: `v-model` in Vue, and `ngModel`/`formControl` in Angular with the new `UfOptionalNumberValueAccessor`. New translatable texts `decrease` and `increase`, in every built-in language.

## 0.11.0

### Patch Changes

- 2e09890: New `<uf-alert>`: a message in the page, like "Your trial ends in 3 days". Six variants by meaning (`info` by default), each with its icon; a `heading`, `actions` below the message, and `closable` for a close button that hides it (`hide()`, `show()`, `uf-hide`, `uf-show`). `warning` and `danger` alerts are announced right away, the others politely.

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
- bc08067: `<uf-drawer>` has its own shadow, `--uf-shadow-drawer`, even on every side. It used the dialog's shadow, which falls downward: too strong under a top drawer and invisible above a bottom one.

## 0.9.0

### Patch Changes

- cfc8621: Two new components:
  
  - `<uf-file-upload>`: choose files with a button or by dragging them onto a drop zone; `accept` and `max-size` refuse files with a clear message; submits like a native file input. `v-model` in Vue binds the files, and Angular gets `UfFilesValueAccessor` for `ngModel` and `formControl`.
  - `<uf-date-range-picker>`: type or pick a start and an end date; the value is an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, with `start` and `end` for the two dates. `<uf-calendar range>` picks a range inline.
  
  New built-in icons `upload` and `file`, and new translatable texts for both components, in every built-in language. The date picker no longer stays open when it's closed from code while still opening.
  
  The Unframed skill is also a Claude Code plugin: `/plugin marketplace add P-DB/unframed-ui`, then `/plugin install unframed@unframed`.

## 0.8.0

### Patch Changes

- 38e5886: Five new components:
  
  - `<uf-progress>`: a progress bar, with a value or indeterminate, an optional percentage, and colors by meaning.
  - `<uf-spinner>`: shows that something is loading; announced as "Loading" (translatable) or its `label`.
  - `<uf-slider>`: picks a number in a range, built on the native range input; submits with forms, `v-model` in Vue, `ngModel` and `formControl` in Angular (new `UfNumberValueAccessor`).
  - `<uf-breadcrumbs>` and `<uf-breadcrumb-item>`: the path to the current page, as a navigation landmark, with custom separators.
  - `<uf-drawer>`: a modal panel that slides in from any edge, with everything `<uf-dialog>` does.
  
  New translatable texts: `progress`, `loading` and `breadcrumb`, in every built-in language.

## 0.7.0

### Minor Changes

- 18903e9: On server-rendered pages, components stay invisible but in place until their JavaScript loads, and content that only shows once opened (a closed dialog, a menu, a select's options) takes no space, so no raw content flashes.

## 0.6.1

No changes in this release.

## 0.6.0

### Minor Changes

- a5e9cab: Popovers, menus, dropdowns, the combobox and date picker lists, and dialogs get an accent edge and glow in dark mode, like elevated cards, instead of a black shadow that barely shows. Two new theme tokens: `--uf-shadow-overlay` and `--uf-shadow-modal` (the usual soft shadows in light mode).

### Patch Changes

- a192b82: In light mode, danger buttons, error messages and danger toasts use a lighter red (`palette.danger.500`), so they no longer look brown on white. Dark mode is unchanged.

## 0.5.0

### Minor Changes

- 9103ad2: Elevated cards are visible in dark mode: instead of a black shadow, which barely shows on dark backgrounds, they get a faint accent edge and an accent glow. It comes from a new theme token, `--uf-shadow-raised` (a soft shadow in light mode), and can be changed per card with `--uf-card-shadow`.
- 9103ad2: The secondary button is grey at rest, with the accent tint on hover, so it no longer looks like a disabled primary. New theme token: `--uf-color-neutral-fill`.

## 0.4.0

No changes in this release.

## 0.3.0

### Minor Changes

- 453f778: New components: Badge (`<uf-badge>`), Avatar (`<uf-avatar>`), Card (`<uf-card>`), Table (`<uf-table>`) with sorting and custom cells, and Pagination (`<uf-pagination>`). They come with React, Vue and Angular wrappers, and the CLI can copy them. Tokens add `--uf-color-info` and `--uf-color-info-subtle`, and the icon set adds `user`.

## 0.2.0

### Minor Changes

- 6982a9b: Buttons get a `link` variant: a text link look, with no fill or side padding and an underline on hover. The danger palette now centers on `#7c162e`, a deeper wine red.

## 0.1.0

### Minor Changes

- b82e173: First public release: 20 accessible, form-ready web components with design tokens and light/dark themes; React, Vue and Angular packages; and a CLI to copy components into your project.
