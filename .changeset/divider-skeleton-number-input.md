---
'@unframed/core': minor
'@unframed/react': minor
'@unframed/vue': minor
'@unframed/angular': minor
'@unframed/tokens': patch
'@unframed/cli': patch
---

Three new components:

- `<uf-divider>`: a horizontal or vertical separator, with an optional label like "or".
- `<uf-skeleton>`: a placeholder for content that's loading, as lines of text, a block or a circle, with a shimmer that stops for reduced motion. It's hidden from screen readers: mark the loading region with `aria-busy="true"`.
- `<uf-number-input>`: a number field with minus and plus buttons, `min`, `max` and `step`, and `stepUp()`/`stepDown()`. Its value is a number, or `null` while empty: `v-model` in Vue, and `ngModel`/`formControl` in Angular with the new `UfOptionalNumberValueAccessor`. New translatable texts `decrease` and `increase`, in every built-in language.
