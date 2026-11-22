---
'@unframed/mcp': patch
---

The server tells agents how to import the components in each framework. `list_components` and `get_component` give the React, Vue and Angular imports, like `import { UfButton } from '@unframed/react'`. Before, they only gave the core entry (`@unframed/core/button`), and agents guessed `@unframed/react/button`, which doesn't exist. The new `get_framework_guide` tool returns the setup for HTML, React, Vue or Angular. `validate_usage` also flags imports that don't exist: subpaths of `@unframed/react` and `@unframed/vue`, unknown Angular entries, and names without the `Uf` prefix, like `Button`.
