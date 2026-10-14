# @unframed/core

## 0.4.0

### Minor Changes

- 89941ad: Translations: `setTranslations()` replaces the built-in texts (a dialog's close button, "No results", pagination labels, a few error messages), for one language or several. Components follow the nearest `lang` attribute and update when it changes. The combobox's "No results" message is now a disabled option, so the open list stays valid for screen readers.

### Patch Changes

- @unframed/tokens@0.4.0

## 0.3.0

### Minor Changes

- 453f778: New components: Badge (`<uf-badge>`), Avatar (`<uf-avatar>`), Card (`<uf-card>`), Table (`<uf-table>`) with sorting and custom cells, and Pagination (`<uf-pagination>`). They come with React, Vue and Angular wrappers, and the CLI can copy them. Tokens add `--uf-color-info` and `--uf-color-info-subtle`, and the icon set adds `user`.

### Patch Changes

- 89fb75d: Form controls update their form value and validity as soon as `value`, `checked`, `required` or a constraint is set from code. Before, `field.value = 'x'; form.requestSubmit()` could be blocked by the old validity, and `new FormData(form)` could miss the new value.
- Updated dependencies [453f778]
  - @unframed/tokens@0.3.0

## 0.2.0

### Minor Changes

- 6982a9b: Buttons get a `link` variant: a text link look, with no fill or side padding and an underline on hover. The danger palette now centers on `#7c162e`, a deeper wine red.

### Patch Changes

- Updated dependencies [6982a9b]
  - @unframed/tokens@0.2.0

## 0.1.0

### Minor Changes

- b82e173: First public release: 20 accessible, form-ready web components with design tokens and light/dark themes; React, Vue and Angular packages; and a CLI to copy components into your project.

### Patch Changes

- Updated dependencies [b82e173]
  - @unframed/tokens@0.1.0
