---
'@unframed/core': minor
'@unframed/react': minor
'@unframed/vue': minor
'@unframed/angular': minor
'@unframed/tokens': patch
'@unframed/cli': patch
---

New `<uf-alert>`: a message in the page, like "Your trial ends in 3 days". Six variants by meaning (`info` by default), each with its icon; a `heading`, `actions` below the message, and `closable` for a close button that hides it (`hide()`, `show()`, `uf-hide`, `uf-show`). `warning` and `danger` alerts are announced right away, the others politely.
