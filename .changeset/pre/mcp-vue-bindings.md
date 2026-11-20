---
'@unframed/mcp': patch
---

`validate_usage` no longer reports false errors in Vue templates: a bound value like `:sort-direction="dir"` is read as an expression, not as the text `dir`, and `v-model` written out (`:model-value` with `@update:model-value`, or `v-model:indeterminate`) is accepted on form controls. Static values on `<UfX>` wrappers are still checked.
