---
'@unframed/angular': minor
'@unframed/react': patch
'@unframed/vue': patch
---

Angular: every component has its own entry point, like `@unframed/angular/input`, which loads only that component and exports its form directive. Importing components by name from `@unframed/angular` is tree-shaken too: an app using only `UfButton` now bundles about 26 KB of Unframed code instead of 140 KB. `UNFRAMED` still brings everything.

React and Vue: the wrappers for sub-elements (`UfTab`, `UfTabPanel`, `UfMenuItem`, `UfAccordionItem`) load only their component's module instead of the whole library.
