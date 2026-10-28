---
'@unframed/core': patch
'@unframed/tokens': minor
---

`<uf-drawer>` has its own shadow, `--uf-shadow-drawer`, even on every side. It used the dialog's shadow, which falls downward: too strong under a top drawer and invisible above a bottom one.
