---
'@unframed/core': minor
'@unframed/react': minor
'@unframed/vue': minor
'@unframed/angular': minor
'@unframed/tokens': patch
'@unframed/cli': patch
---

Three new components:

- `<uf-empty-state>`: an icon, a heading, an explanation and actions, for empty lists and searches without results. New built-in icon `inbox`.
- `<uf-segmented-control>`: one choice among a few options side by side, from plain `<option>` children. A radio group with arrow keys, a form control with `v-model` and `ngModel`.
- `<uf-multi-select>`: pick several options from a list you can search, shown as chips with remove buttons. Every value is submitted under the field's name; `v-model` and `ngModel` bind an array. New translatable text `removeOption`, in every built-in language.
