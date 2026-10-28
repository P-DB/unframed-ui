---
'@unframed/core': minor
'@unframed/react': minor
'@unframed/vue': minor
'@unframed/angular': minor
'@unframed/tokens': minor
'@unframed/cli': patch
---

API review before 1.0. Some names change, so check the migration notes.

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
