---
'@unframed/core': minor
'@unframed/react': minor
'@unframed/vue': minor
'@unframed/angular': minor
'@unframed/tokens': patch
---

Five new components:

- `<uf-progress>`: a progress bar, with a value or indeterminate, an optional percentage, and colors by meaning.
- `<uf-spinner>`: shows that something is loading; announced as "Loading" (translatable) or its `label`.
- `<uf-slider>`: picks a number in a range, built on the native range input; submits with forms, `v-model` in Vue, `ngModel` and `formControl` in Angular (new `UfNumberValueAccessor`).
- `<uf-breadcrumbs>` and `<uf-breadcrumb-item>`: the path to the current page, as a navigation landmark, with custom separators.
- `<uf-drawer>`: a modal panel that slides in from any edge, with everything `<uf-dialog>` does.

New translatable texts: `progress`, `loading` and `breadcrumb`, in every built-in language.
