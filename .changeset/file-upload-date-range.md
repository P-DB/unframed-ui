---
'@unframed/core': minor
'@unframed/react': minor
'@unframed/vue': minor
'@unframed/angular': minor
'@unframed/tokens': patch
'@unframed/cli': patch
---

Two new components:

- `<uf-file-upload>`: choose files with a button or by dragging them onto a drop zone; `accept` and `max-size` refuse files with a clear message; submits like a native file input. `v-model` in Vue binds the files, and Angular gets `UfFilesValueAccessor` for `ngModel` and `formControl`.
- `<uf-date-range-picker>`: type or pick a start and an end date; the value is an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, with `start` and `end` for the two dates. `<uf-calendar range>` picks a range inline.

New built-in icons `upload` and `file`, and new translatable texts for both components, in every built-in language. The date picker no longer stays open when it's closed from code while still opening.

The Unframed skill is also a Claude Code plugin: `/plugin marketplace add P-DB/unframed-ui`, then `/plugin install unframed@unframed`.
