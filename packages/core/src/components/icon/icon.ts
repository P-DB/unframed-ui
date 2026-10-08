import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { defineElement } from '../../internal/define.js';
import { iconSvg, icons, type BuiltInIconName } from '../../internal/icons.js';

const registry = new Map<string, string>();
const instances = new Set<UfIcon>();

/**
 * Registers custom icons by name, as SVG markup. The markup is trusted and
 * inserted as-is, so only register icons from your own code, never user input.
 *
 * @example registerIcons({ heart: '<svg viewBox="0 0 24 24">…</svg>' })
 */
export function registerIcons(svgs: Record<string, string>): void {
  for (const [name, markup] of Object.entries(svgs)) registry.set(name, markup);
  for (const icon of instances) icon.requestUpdate();
}

/**
 * An icon from the built-in set, or one added with `registerIcons()`.
 * Icons are decorative unless you give them a `label`.
 *
 * @summary Shows a small symbol.
 * @tag uf-icon
 *
 * @csspart svg - The `<svg>` element.
 *
 * @cssprop --uf-icon-size - Width and height. Defaults to `1em`, so it follows the font size.
 * @cssprop --uf-icon-stroke-width - Stroke width of built-in icons.
 */
export class UfIcon extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      width: var(--uf-icon-size, 1em);
      height: var(--uf-icon-size, 1em);
      flex: none;
      vertical-align: -0.125em;
    }

    svg {
      width: 100%;
      height: 100%;
      stroke-width: var(--uf-icon-stroke-width, 2);
    }
  `;

  static override properties: PropertyDeclarations = {
    name: { reflect: true },
    label: {},
  };

  /** Icon name: a built-in icon or one added with `registerIcons()`. */
  declare name: BuiltInIconName | (string & {});
  /** Accessible label. Without it the icon is hidden from assistive tech. */
  declare label: string | undefined;

  constructor() {
    super();
    this.name = '';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    instances.add(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    instances.delete(this);
  }

  override updated(): void {
    if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  override render() {
    const custom = registry.get(this.name);
    if (custom) return html`${unsafeSVG(custom)}`;
    const builtIn = icons[this.name as BuiltInIconName];
    return builtIn ? iconSvg(builtIn, 'svg') : nothing;
  }
}

defineElement('uf-icon', UfIcon);

declare global {
  interface HTMLElementTagNameMap {
    'uf-icon': UfIcon;
  }
}
