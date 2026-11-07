---
'@unframed/tokens': minor
'@unframed/core': minor
---

One corner radius everywhere: 2px. `--uf-radius-control` (buttons and fields) goes from 0 to 2px, and `--uf-radius-sm`, `--uf-radius-md` and `--uf-radius-lg` (cards, menus, dialogs) from 4, 8 and 12px to 2px, so controls and the surfaces around them match. Tooltips follow `--uf-radius-sm` instead of being always square.

To get the previous look back, set `--uf-radius-control: 0px`, `--uf-radius-sm: 4px`, `--uf-radius-md: 8px` and `--uf-radius-lg: 12px` on `:root`.
