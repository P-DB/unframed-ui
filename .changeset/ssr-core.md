---
'@unframed/core': patch
---

`toast()` does nothing when called on the server instead of throwing, and every build checks that all modules import on a server. `uf-tabs` no longer renders twice to pick its first tab (Lit's "change-in-update" warning in development).
