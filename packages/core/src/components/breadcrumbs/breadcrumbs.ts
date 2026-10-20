import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';

/**
 * One step of a breadcrumb trail, inside `<uf-breadcrumbs>`. The last item is
 * the current page: plain text, announced as the current page.
 *
 * @summary A step in a breadcrumb trail.
 * @tag uf-breadcrumb-item
 *
 * @slot - The label.
 * @slot prefix - An icon before the label.
 * @slot separator - Set by `<uf-breadcrumbs>`; you don't need it yourself.
 *
 * @csspart link - The link, for items with `href`.
 * @csspart label - The current page's label, or an item without `href`.
 * @csspart separator - The separator after the item.
 */
export class UfBreadcrumbItem extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        min-width: 0;
      }

      .link,
      .label {
        display: inline-flex;
        align-items: center;
        gap: var(--uf-space-1);
        min-width: 0;
        border-radius: var(--uf-radius-sm);
      }

      .link {
        color: var(--uf-color-text-muted);
        text-decoration: none;
      }

      .link:hover {
        color: var(--uf-color-text);
        text-decoration: underline;
      }

      .link:focus-visible {
        ${focusRing}
      }

      .label {
        color: var(--uf-color-text);
      }

      :host([current]) .label {
        font-weight: var(--uf-font-weight-medium);
      }

      .separator {
        display: inline-flex;
        margin: 0 var(--uf-space-2);
        color: var(--uf-color-text-muted);
      }

      .separator .icon {
        width: 1em;
        height: 1em;
      }

      ::slotted([slot='prefix']) {
        display: inline-flex;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    href: {},
    target: {},
    current: { type: Boolean, reflect: true },
  };

  /** Link to this step. */
  declare href: string | undefined;
  /** Link target, used with `href`. */
  declare target: string | undefined;
  /** The current page. `<uf-breadcrumbs>` sets it on the last item. */
  declare current: boolean;

  constructor() {
    super();
    this.current = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  override render() {
    const content = html`<slot name="prefix"></slot><slot></slot>`;
    return html`
      ${this.href && !this.current
        ? html`<a class="link" part="link" href=${this.href} target=${ifDefined(this.target)}>${content}</a>`
        : html`<span class="label" part="label" aria-current=${ifDefined(this.current ? 'page' : undefined)}>${content}</span>`}
      ${this.current
        ? nothing
        : html`<span class="separator" part="separator" aria-hidden="true"><slot name="separator">${iconSvg(icons['chevron-right'])}</slot></span>`}
    `;
  }
}

/**
 * Shows where the current page sits in the site: a trail of links, from the
 * top level to here. It's a navigation landmark with a list inside, and the
 * last item is marked as the current page.
 *
 * @summary Shows the path to the current page.
 * @tag uf-breadcrumbs
 *
 * @slot - `<uf-breadcrumb-item>` elements.
 * @slot separator - A custom separator, e.g. `<span slot="separator">/</span>`. Copied between the items.
 *
 * @csspart base - The `<nav>` element.
 * @csspart list - The list of items.
 */
export class UfBreadcrumbs extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        row-gap: var(--uf-space-1);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-sm);
        line-height: 1.5;
      }

      slot[name='separator'] {
        display: none;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    label: {},
  };

  /** Accessible name of the navigation. Defaults to "Breadcrumb", in the page's language. */
  declare label: string | undefined;

  readonly #translator = new Translator(this);

  get #items(): UfBreadcrumbItem[] {
    return [...this.children].filter((el): el is UfBreadcrumbItem => el.localName === 'uf-breadcrumb-item');
  }

  /** Marks the last item as current, and copies a custom separator into the others. */
  #sync = (): void => {
    const items = this.#items;
    const separator = this.querySelector<HTMLElement>(':scope > [slot="separator"]');
    items.forEach((item, i) => {
      item.current = i === items.length - 1;
      item.querySelectorAll(':scope > [data-uf-separator]').forEach((copy) => copy.remove());
      if (separator && !item.current) {
        const copy = separator.cloneNode(true) as HTMLElement;
        copy.setAttribute('data-uf-separator', '');
        item.append(copy);
      }
    });
  };

  override render() {
    return html`
      <nav part="base" aria-label=${this.label || this.#translator.t('breadcrumb')}>
        <div class="list" part="list" role="list"><slot @slotchange=${this.#sync}></slot></div>
      </nav>
      <slot name="separator" @slotchange=${this.#sync}></slot>
    `;
  }
}

defineElement('uf-breadcrumb-item', UfBreadcrumbItem);
defineElement('uf-breadcrumbs', UfBreadcrumbs);

declare global {
  interface HTMLElementTagNameMap {
    'uf-breadcrumb-item': UfBreadcrumbItem;
    'uf-breadcrumbs': UfBreadcrumbs;
  }
}
