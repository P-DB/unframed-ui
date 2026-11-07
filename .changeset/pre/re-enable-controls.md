---
'@unframed/core': patch
---

Buttons and form controls that start disabled can be enabled again. Setting `disabled` back to `false`, as frameworks do when a form becomes valid, left `<uf-button>`, `<uf-input>`, `<uf-number-input>`, `<uf-textarea>`, `<uf-checkbox>`, `<uf-switch>` and `<uf-radio-group>` disabled inside until something else made them render.
