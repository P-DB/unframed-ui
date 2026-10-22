# @unframed/vue

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
