---
name: unframed
description: Builds UI with Unframed web components (@unframed/core, @unframed/react, @unframed/vue, @unframed/angular, <uf-*> tags) in HTML, React, Vue or Angular, including forms, events, tables, dialogs and theming with --uf-* tokens. Use when the project depends on @unframed/* packages, the code uses <uf-*> tags, or the user asks for Unframed components.
---

# Unframed UI

Unframed {{version}}: accessible UI components as standard custom elements (Lit). Every tag starts with `uf-`. They work in plain HTML and every framework; React, Vue and Angular have wrapper packages for typed props, events and form bindings.

## Before writing code

1. Check `package.json` for which packages the project uses: `@unframed/react`, `@unframed/vue`, `@unframed/angular`, or `@unframed/core` alone. If `unframed.json` exists, components were copied into the project with the CLI: import them from that folder, not from npm.
2. Read the setup for that framework in [references/frameworks.md](references/frameworks.md).
3. Before using a component, read its section in [references/components.md](references/components.md): attributes, events, slots and an example. Don't guess attribute names.

## Rules

- **Tokens once.** Load `@unframed/tokens/tokens.css` once (app entry or global stylesheet), before any overrides.
- **Import what you use.** `import '@unframed/core/<component>'` registers that component and the ones it needs. In React/Vue/Angular, import the components from the wrapper package instead.
- **Booleans are presence attributes** in HTML: `<uf-button disabled>`, never `disabled="false"`. Props/inputs take real booleans.
- **Events.** Form controls fire native `input` (while typing) and `change` (on commit); read the value from the element (`event.target.value` / `.checked`). Other components fire `uf-*` events (`uf-show`, `uf-hide`, `uf-select`, `uf-tab-change`, `uf-sort`, `uf-page-change`, `uf-request-close`) with data in `event.detail`. React: `onUfHide`, `onUfPageChange`…; Vue: `@uf-hide`; Angular: `(uf-hide)`.
- **Forms.** Form controls are form-associated: give them a `name` and put them in a `<form>`; `required`, `pattern`, `min`… validate natively and errors show under the field. Vue: `v-model`. Angular: `ngModel` / `formControl` / `formControlName` (import the form directives, e.g. `UNFRAMED` or `UfTextValueAccessor`).
- **Labels.** Form controls take `label` (and `hint`); icon-only buttons need `label`; `uf-icon` needs `label` only when it means something; tables need `label`; two `uf-pagination` on one page need different `label`s.
- **Options are children.** `uf-select` and `uf-combobox` take plain `<option>`/`<optgroup>` children. `uf-radio-group` takes `uf-radio`. `uf-tabs` takes `uf-tab` + `uf-tab-panel` (matched by `panel`/`name`).
- **Objects are properties.** `uf-table`'s `columns` and `rows` are arrays: set them as properties (React/Vue/Angular props do this). Only in plain HTML use JSON attributes.
- **Dialogs.** Open with `open` or `.show()`; any child with `data-dialog="close"` closes it; cancel a close in `uf-request-close` with `preventDefault()`.
- **Toasts.** `import { toast } from '@unframed/core'` and call `toast('Saved', { variant: 'success' })`; no element needed.
- **Theming.** Change colors and shapes with `--uf-*` custom properties (global tokens, then per-component ones like `--uf-button-radius`), then `::part()`. Don't style internals any other way, and don't re-implement a component that exists. See [references/theming.md](references/theming.md).
- **Translations.** Built-in texts (dialog close button, "No results", pagination labels, a few error messages) are English. Translate them with `setTranslations({ close: 'Chiudi', page: 'Pagina {page}' }, 'it')` from `@unframed/core`, once at startup; components follow the nearest `lang` attribute. Don't add `aria-label`s to override them.
- **Dark mode** follows the OS; force it with `data-uf-theme="dark"` (or `"light"`) on any element.

## Components

{{components}}

The full API of each, with examples: [references/components.md](references/components.md). Docs: https://p-db.github.io/unframed-ui/
