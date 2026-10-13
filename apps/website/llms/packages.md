# Packages

Unframed is six npm packages under the `@unframed` scope, released together with the same version. You install two: the tokens, and either the components or your framework's package. While the version starts with `0.`, a minor release may include breaking changes, listed in the changelog.

| Package | What it is | Install it |
|---|---|---|
| `@unframed/tokens` | Design tokens as CSS custom properties (`--uf-*`), light and dark. Exports `tokens.css`, `tokens.json`. | Always |
| `@unframed/core` | The web components, built with Lit. `@unframed/core` registers all; `@unframed/core/<component>` registers one. Exports `toast()`, `registerIcons()`, the classes and types, and `custom-elements.json`. | Plain HTML, Svelte, Solid, Astro, Lit… |
| `@unframed/react` | React components (`UfButton`…) with typed props and `onUfX` event handlers. | React 18+ |
| `@unframed/vue` | Vue components with typed props and `v-model`; `UnframedVue` plugin; `isUnframedElement` for plain tags. | Vue 3 |
| `@unframed/angular` | Standalone components and form directives (`ngModel`, reactive forms). `UNFRAMED` imports everything; `@unframed/angular/<component>` entry points ship only one. | Angular 20+ |
| `@unframed/cli` | Copies component source into your project (`init`, `add`, `list`, `diff`) and installs the AI skill (`skill`). | Run with npx |

```bash
npm install @unframed/react @unframed/tokens     # React
npm install @unframed/vue @unframed/tokens       # Vue
npm install @unframed/angular @unframed/tokens   # Angular
npm install @unframed/core @unframed/tokens      # anything else
```
