# @unframed/core

## 0.12.0

### Minor Changes

- 5163e46: Three new components:
  
  - `<uf-divider>`: a horizontal or vertical separator, with an optional label like "or".
  - `<uf-skeleton>`: a placeholder for content that's loading, as lines of text, a block or a circle, with a shimmer that stops for reduced motion. It's hidden from screen readers: mark the loading region with `aria-busy="true"`.
  - `<uf-number-input>`: a number field with minus and plus buttons, `min`, `max` and `step`, and `stepUp()`/`stepDown()`. Its value is a number, or `null` while empty: `v-model` in Vue, and `ngModel`/`formControl` in Angular with the new `UfOptionalNumberValueAccessor`. New translatable texts `decrease` and `increase`, in every built-in language.

### Patch Changes

- 69320d1: `<uf-calendar>` and the date pickers: clicking a day of the previous or next month selects that day. The pointer focused it first, which moved the grid to its month before the click landed, so another day was picked.
- fcfe53f: Form controls show their validation error only inline: a blocked submission or `reportValidity()` no longer opens the browser's bubble on top of it, which repeated the message. The first invalid control of a submission still gets focus, as with native fields.
- Updated dependencies [5163e46]
  - @unframed/tokens@0.12.0

## 0.11.0

### Minor Changes

- 2e09890: New `<uf-alert>`: a message in the page, like "Your trial ends in 3 days". Six variants by meaning (`info` by default), each with its icon; a `heading`, `actions` below the message, and `closable` for a close button that hides it (`hide()`, `show()`, `uf-hide`, `uf-show`). `warning` and `danger` alerts are announced right away, the others politely.

### Patch Changes

- ad59a0b: `<uf-button>` works out whether it's icon-only before rendering, so icon-only buttons render once instead of twice, without Lit's "change-in-update" warning in development.
- f79c00c: Enter in `<uf-input>` submits its form, like a native input: through the form's first submit button (unless it's disabled), or, without one, when it's the form's only text field.
- Updated dependencies [2e09890]
  - @unframed/tokens@0.11.0

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

- 9c5e420: `<uf-accordion-item>` opens and closes more smoothly: a curve that starts right away and glides to a stop, and the content fades in and out with the panel.
- bc08067: `<uf-drawer>` has its own shadow, `--uf-shadow-drawer`, even on every side. It used the dialog's shadow, which falls downward: too strong under a top drawer and invisible above a bottom one.
- Updated dependencies [0d36b86]
- Updated dependencies [bc08067]
  - @unframed/tokens@0.10.0

## 0.9.0

### Minor Changes

- cfc8621: Two new components:
  
  - `<uf-file-upload>`: choose files with a button or by dragging them onto a drop zone; `accept` and `max-size` refuse files with a clear message; submits like a native file input. `v-model` in Vue binds the files, and Angular gets `UfFilesValueAccessor` for `ngModel` and `formControl`.
  - `<uf-date-range-picker>`: type or pick a start and an end date; the value is an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, with `start` and `end` for the two dates. `<uf-calendar range>` picks a range inline.
  
  New built-in icons `upload` and `file`, and new translatable texts for both components, in every built-in language. The date picker no longer stays open when it's closed from code while still opening.
  
  The Unframed skill is also a Claude Code plugin: `/plugin marketplace add P-DB/unframed-ui`, then `/plugin install unframed@unframed`.

### Patch Changes

- 8023897: `<uf-drawer>` rounds the corners on its open side, like cards and tables (`--uf-radius-md`); the side against the screen edge stays square. Change it with `--uf-drawer-radius`.
- 1a13a33: Tooltips have square corners, like the rest of the controls. Round them with `--uf-tooltip-radius`.
- e5e2a12: `<uf-table>`: in flex and grid layouts it now shrinks to the space available and scrolls sideways, instead of making the page wider than the screen on phones. `<code>` elements in cells (from a column's `format`) are styled like inline code, e.g. for API reference tables.
- Updated dependencies [cfc8621]
  - @unframed/tokens@0.9.0

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
  - @unframed/tokens@0.8.0

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
