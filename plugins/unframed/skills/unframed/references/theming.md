# Theming

Everything is driven by CSS custom properties, at three levels.

## 1. Design tokens

Change a token and every component follows. Semantic tokens (`--uf-color-accent`, `--uf-color-danger`…) point at palettes (`--uf-palette-accent-50` … `-950`), so retheme by overriding either. Load overrides after `@unframed/tokens/tokens.css`.

```css
:root {
  --uf-palette-accent-600: #0f766e;   /* the accent; generate the whole palette with the theme generator */
  --uf-radius-control: 6px;           /* rounded buttons and fields */
  --uf-font-family-sans: 'Inter', sans-serif;
}
```

The theme generator (https://p-db.github.io/unframed-ui/docs/theme-generator) builds a full palette from one color, with contrast checks, and outputs this CSS.

## 2. Component properties

Each component documents its own custom properties, e.g. `--uf-button-radius`, `--uf-dialog-width`, `--uf-table-max-height`.

```css
uf-button.pill { --uf-button-radius: 999px; }
uf-dialog.wide { --uf-dialog-width: 48rem; }
```

## 3. CSS parts

Shadow DOM keeps page CSS out by accident; `::part()` styles named internal elements on purpose. Any CSS property works on the part, plus states and pseudo-elements on it; you can't select inside a part.

```css
uf-button::part(base) { text-transform: uppercase; }
uf-input:state(user-invalid)::part(box) { background: #fff5f5; }
```

Use custom properties first; parts for anything they don't cover.

## Dark mode

Dark mode follows the operating system. Force a theme on the page or any section with `data-uf-theme="light"` or `data-uf-theme="dark"`.
