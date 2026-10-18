# @unframed/core

## 0.7.0

### Patch Changes

- 2f168c9: `toast()` does nothing when called on the server instead of throwing, and every build checks that all modules import on a server. `uf-tabs` no longer renders twice to pick its first tab (Lit's "change-in-update" warning in development).
- Updated dependencies [18903e9]
  - @unframed/tokens@0.7.0

## 0.6.1

### Patch Changes

- e69bcb5: Disabled checkboxes, switches and radios are grey, with muted labels, instead of faded, like disabled fields.
- @unframed/tokens@0.6.1

## 0.6.0

### Minor Changes

- 68a7151: Built-in translations for Italian, French, German, Spanish and Portuguese, one file per language: `import it from '@unframed/core/locales/it'; setTranslations(it, 'it')`.
- a5e9cab: Popovers, menus, dropdowns, the combobox and date picker lists, and dialogs get an accent edge and glow in dark mode, like elevated cards, instead of a black shadow that barely shows. Two new theme tokens: `--uf-shadow-overlay` and `--uf-shadow-modal` (the usual soft shadows in light mode).

### Patch Changes

- 9830033: Disabled inputs, textareas, selects, comboboxes and date pickers are grey, with muted text, instead of faded, so they no longer look like fields you can type in.
- Updated dependencies [a192b82]
- Updated dependencies [a5e9cab]
  - @unframed/tokens@0.6.0

## 0.5.0

### Minor Changes

- 65aec48: New Date picker (`<uf-date-picker>`): type a date in the page language's format or pick one from a calendar popup. The value is `YYYY-MM-DD`; `min`, `max`, `isDateDisabled` and `required` validate natively in forms; `v-model` and Angular forms work. The calendar is also its own element, `<uf-calendar>`. New translation keys for its texts, and for the combobox's result count, which was English only.
- 9103ad2: The secondary button is grey at rest, with the accent tint on hover, so it no longer looks like a disabled primary. New theme token: `--uf-color-neutral-fill`.

### Patch Changes

- 9103ad2: Elevated cards are visible in dark mode: instead of a black shadow, which barely shows on dark backgrounds, they get a faint accent edge and an accent glow. It comes from a new theme token, `--uf-shadow-raised` (a soft shadow in light mode), and can be changed per card with `--uf-card-shadow`.
- 1a3c437: Disabled controls no longer react to hover: buttons keep their text and background color, and tabs, radios, checkboxes and field borders stay as they are.
- Updated dependencies [9103ad2]
- Updated dependencies [9103ad2]
  - @unframed/tokens@0.5.0

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
