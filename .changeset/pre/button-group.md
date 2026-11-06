---
'@unframed/core': minor
'@unframed/react': minor
'@unframed/vue': minor
'@unframed/angular': minor
'@unframed/tokens': patch
---

New `<uf-button-group>`: related buttons joined into one bar. Neighbors share one border, only the outer corners are rounded, and filled or ghost buttons get a thin line between them. Buttons stay joined when wrapped in a tooltip or used as a dropdown trigger, so it makes split buttons too. `orientation="vertical"` stacks them, and a `label` names the group for assistive tech.
