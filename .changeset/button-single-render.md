---
'@unframed/core': patch
---

`<uf-button>` works out whether it's icon-only before rendering, so icon-only buttons render once instead of twice, without Lit's "change-in-update" warning in development.
