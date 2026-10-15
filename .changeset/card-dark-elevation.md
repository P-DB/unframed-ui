---
'@unframed/tokens': minor
'@unframed/core': patch
---

Elevated cards are visible in dark mode: instead of a black shadow, which barely shows on dark backgrounds, they get a faint accent edge and an accent glow. It comes from a new theme token, `--uf-shadow-raised` (a soft shadow in light mode), and can be changed per card with `--uf-card-shadow`.
