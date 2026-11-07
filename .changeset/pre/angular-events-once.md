---
'@unframed/angular': patch
---

Handlers of custom events, like `(uf-hide)` or `(uf-tab-change)`, run once per event instead of twice. Angular already listens to the element's native event, and the outputs re-emitted it. The outputs still type `$event`, but no longer emit: to listen from code, use `addEventListener` on the component's `el`.
