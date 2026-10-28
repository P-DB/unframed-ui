# @unframed/cli

## 0.10.0

### Patch Changes

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

## 0.9.0

### Patch Changes

- cfc8621: Two new components:
  
  - `<uf-file-upload>`: choose files with a button or by dragging them onto a drop zone; `accept` and `max-size` refuse files with a clear message; submits like a native file input. `v-model` in Vue binds the files, and Angular gets `UfFilesValueAccessor` for `ngModel` and `formControl`.
  - `<uf-date-range-picker>`: type or pick a start and an end date; the value is an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, with `start` and `end` for the two dates. `<uf-calendar range>` picks a range inline.
  
  New built-in icons `upload` and `file`, and new translatable texts for both components, in every built-in language. The date picker no longer stays open when it's closed from code while still opening.
  
  The Unframed skill is also a Claude Code plugin: `/plugin marketplace add P-DB/unframed-ui`, then `/plugin install unframed@unframed`.

## 0.8.0

No changes in this release.

## 0.7.0

No changes in this release.

## 0.6.1

No changes in this release.

## 0.6.0

No changes in this release.

## 0.5.0

No changes in this release.

## 0.4.0

No changes in this release.

## 0.3.0

### Minor Changes

- c9e81b9: New `skill` command: `npx @unframed/cli skill` installs an Agent Skill (`SKILL.md` plus references with every component's API and examples, for this version) in `.claude/skills/unframed`, or in another assistant's folder with `--dir`.

## 0.2.0

No changes in this release.

## 0.1.0

### Minor Changes

- b82e173: First public release: 20 accessible, form-ready web components with design tokens and light/dark themes; React, Vue and Angular packages; and a CLI to copy components into your project.
