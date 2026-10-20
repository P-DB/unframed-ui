# @unframed/tokens

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
