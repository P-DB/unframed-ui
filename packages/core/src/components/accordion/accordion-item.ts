import { LitElement, css, html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { defineElement } from '../../internal/define.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { hostStyles } from '../../internal/shared.styles.js';

/**
 * A collapsible section, built on the native `<details>` element: the header
 * is a real disclosure button, and the browser's find-in-page opens a closed
 * item when it contains the match. Use it alone or inside `<uf-accordion>`.
 *
 * @summary A section that expands and collapses.
 * @tag uf-accordion-item
 *
 * @slot - The content.
 * @slot summary - The header, when you need markup. Overrides `summary`.
 *
 * @event uf-show - The item opened.
 * @event uf-hide - The item closed.
 *
 * @csspart base - The native `<details>`.
 * @csspart header - The clickable header (`<summary>`).
 * @csspart chevron - The arrow icon.
 * @csspart content - The content wrapper.
 *
 * @cssprop --uf-accordion-padding - Horizontal padding of header and content.
 */
export class UfAccordionItem extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        --_padding: var(--uf-accordion-padding, var(--uf-space-1));
        display: block;
        border-bottom: 1px solid var(--uf-color-border);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        color: var(--uf-color-text);
        /* Lets block-size animate to and from auto, where supported. */
        interpolate-size: allow-keywords;
        /* Gets going right away and glides to a stop: responsive, but smooth. */
        --_duration: var(--uf-duration-base);
        --_easing: cubic-bezier(0.4, 0, 0.2, 1);
      }

      summary {
        display: flex;
        align-items: center;
        gap: var(--uf-space-2);
        padding: var(--uf-space-3) var(--_padding);
        font-weight: var(--uf-font-weight-medium);
        line-height: 1.4;
        cursor: pointer;
        list-style: none;
        user-select: none;
      }

      summary::-webkit-details-marker {
        display: none;
      }

      summary:hover {
        background: var(--uf-color-accent-tint);
        color: var(--uf-color-on-accent-tint);
      }

      summary:focus-visible {
        outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
        outline-offset: calc(var(--uf-focus-ring-width) * -1);
      }

      .summary {
        flex: 1;
        min-width: 0;
      }

      .icon {
        flex: none;
        width: 1.125rem;
        height: 1.125rem;
        color: var(--uf-color-text-muted);
        transition: rotate var(--_duration) var(--_easing);
      }

      details[open] .icon {
        rotate: 180deg;
      }

      .content {
        padding: 0 var(--_padding) var(--uf-space-4);
        line-height: 1.5;
        color: var(--uf-color-text-muted);
        opacity: 0;
        transition: opacity var(--_duration) var(--_easing);
      }

      /* The content fades in as the panel opens, instead of appearing all at once. */
      details[open] .content {
        opacity: 1;
      }

      details::details-content {
        block-size: 0;
        overflow: clip;
        transition:
          block-size var(--_duration) var(--_easing),
          content-visibility var(--_duration) allow-discrete;
      }

      details[open]::details-content {
        block-size: auto;
      }

      :host([disabled]) summary {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host([disabled]) summary:hover {
        background: none;
        color: inherit;
      }

      @media (prefers-reduced-motion: reduce) {
        details::details-content,
        .icon,
        .content {
          transition: none;
        }
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    open: { type: Boolean, reflect: true },
    summary: {},
    disabled: { type: Boolean, reflect: true },
  };

  /** Whether the item is expanded. */
  declare open: boolean;
  /** Header text. */
  declare summary: string | undefined;
  /** Prevents the user from toggling the item. */
  declare disabled: boolean;

  constructor() {
    super();
    this.open = false;
    this.disabled = false;
  }

  get #details(): HTMLDetailsElement | null {
    return this.renderRoot.querySelector('details');
  }

  /** The header element, for keyboard navigation between items. */
  get header(): HTMLElement | null {
    return this.renderRoot.querySelector('summary');
  }

  /** Expands the item. */
  show(): void {
    this.open = true;
  }

  /** Collapses the item. */
  hide(): void {
    this.open = false;
  }

  /** Focuses the header. */
  override focus(options?: FocusOptions): void {
    this.header?.focus(options);
  }

  override updated(changed: PropertyValues<this>): void {
    const details = this.#details;
    if (details && changed.has('open') && details.open !== this.open) details.open = this.open;
  }

  #onSummaryClick = (event: MouseEvent): void => {
    if (this.disabled) event.preventDefault();
  };

  /** The last state announced with uf-show / uf-hide. */
  #reported = false;

  override firstUpdated(): void {
    this.#reported = this.open;
  }

  /** Fires for user clicks, find-in-page and programmatic changes alike. */
  #onToggle = (): void => {
    const open = this.#details!.open;
    this.open = open;
    if (open === this.#reported) return;
    this.#reported = open;
    this.dispatchEvent(new Event(open ? 'uf-show' : 'uf-hide'));
  };

  override render() {
    return html`
      <details part="base" ?open=${this.open} @toggle=${this.#onToggle}>
        <summary part="header" aria-disabled=${this.disabled ? 'true' : 'false'} @click=${this.#onSummaryClick}>
          <span class="summary"><slot name="summary">${this.summary}</slot></span>
          ${iconSvg(icons['chevron-down'], 'chevron')}
        </summary>
        <div class="content" part="content"><slot></slot></div>
      </details>
    `;
  }
}

defineElement('uf-accordion-item', UfAccordionItem);

declare global {
  interface HTMLElementTagNameMap {
    'uf-accordion-item': UfAccordionItem;
  }
}
