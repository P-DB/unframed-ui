# Unframed

**UI components that don't care about your framework.**

Unframed is a library of accessible, themeable web components built with [Lit](https://lit.dev). They work in React, Vue, Angular, Svelte, Astro, plain HTML, or anything else that renders the DOM.

> Status: early development (v0). APIs may change before 1.0.

## Packages

| Package | Description |
|---|---|
| [`@unframed/core`](packages/core) | The web components (`<uf-button>`, …) |
| [`@unframed/tokens`](packages/tokens) | Design tokens as CSS custom properties (light + dark) |
| [`@unframed/react`](packages/react) | Typed React wrappers, generated from the components' manifest |

## Components

| Component | Tag | Notes |
|---|---|---|
| Button | `<uf-button>` | 5 variants, 3 sizes, loading, link mode, form submit/reset |
| Icon | `<uf-icon>` | Built-in set, plus `registerIcons()` for your own |
| Input | `<uf-input>` | Label, hint and validation built in; form-associated |
| Textarea | `<uf-textarea>` | `resize="auto"` grows with content |
| Select | `<uf-select>` | Wraps the native `<select>`: write plain `<option>` children |
| Checkbox | `<uf-checkbox>` | Indeterminate state |
| Switch | `<uf-switch>` | `role="switch"` |
| Radio group | `<uf-radio-group>` + `<uf-radio>` | Arrow-key navigation, roving focus |
| Tabs | `<uf-tabs>` + `<uf-tab>` + `<uf-tab-panel>` | Automatic or manual activation, vertical layout |
| Dialog | `<uf-dialog>` | Native modal `<dialog>`, cancellable close, `data-dialog="close"` |
| Popover | `<uf-popover>` | Popover API, flips at viewport edges |
| Tooltip | `<uf-tooltip>` | Hover and focus, Escape to dismiss, exposed as `aria-description` |
| Toast | `toast()` / `<uf-toaster>` | Live region in the top layer, pauses on hover |

Every form control works inside a native `<form>`: it submits its value, resets, validates (`required`, `pattern`, `min`…), and respects `<fieldset disabled>`. Errors show inline after the user interacts or tries to submit, and `:state(user-invalid)` lets you style them.

## Quick start

```bash
npm install @unframed/core @unframed/tokens
```

```js
import '@unframed/tokens/tokens.css';
import '@unframed/core/button'; // registers <uf-button>; one import per component
```

```html
<form>
  <uf-input name="email" type="email" label="Email" required></uf-input>
  <uf-select name="country" label="Country" placeholder="Choose…">
    <option value="it">Italy</option>
    <option value="fr">France</option>
  </uf-select>
  <uf-checkbox name="terms" required>I accept the terms</uf-checkbox>
  <uf-button type="submit">Create account</uf-button>
</form>
```

```js
import '@unframed/core'; // registers every component (or import them one by one)
import { toast } from '@unframed/core/toast';

toast('Saved', { variant: 'success' });
```

### React

```bash
npm install @unframed/react @unframed/tokens
```

```tsx
import '@unframed/tokens/tokens.css';
import { UfButton, UfTabs } from '@unframed/react';

<UfButton variant="danger" loading={saving} onClick={remove}>Delete</UfButton>;
<UfTabs onUfTabChange={(e) => setTab(e.detail.name)}>…</UfTabs>;
```

React 19 also supports the elements directly; the wrappers add typed props and camelCase event handlers.

## Theming

Everything is driven by CSS custom properties. Three levels, from broad to precise:

```css
/* 1. Retheme everything: override a primitive or semantic token */
:root {
  --uf-palette-accent-600: #0f766e;
  --uf-radius-md: 999px;
}

/* 2. Restyle one component */
uf-button.pill {
  --uf-button-radius: 999px;
}

/* 3. Reach inside with parts */
uf-button::part(base) {
  text-transform: uppercase;
}
```

Dark mode follows `prefers-color-scheme` automatically. Force a theme with `data-uf-theme="light"` or `"dark"` on any element.

## Conventions

- **Tags:** `uf-*` · **Events:** `uf-*` (e.g. `uf-change`) · **CSS:** `--uf-*` and `::part()`
- Each component lives in `packages/core/src/components/<name>/` with `<name>.ts`, `<name>.styles.ts` and `<name>.test.ts`.
- Components document their API with JSDoc (`@tag`, `@slot`, `@csspart`, `@cssprop`, `@event`). The build turns that into `custom-elements.json`, which drives IDE autocomplete, the React wrappers and (soon) the docs.
- Form controls are form-associated through `ElementInternals`.
- Every component has an axe accessibility test.

## Development

```bash
npm install
npx playwright install chromium   # once, for browser tests
npm run dev        # playground at http://localhost:5180
npm run build      # tokens → core (+ manifest) → react wrappers
npm test           # Vitest browser mode in headless Chromium
npm run changeset  # describe a change for the next release
```

## License

MIT © Patrizio Di Bartolomeo
