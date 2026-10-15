import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { defineElement } from '../../internal/define.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController } from '../../internal/slot.js';

export type CardVariant = 'outline' | 'elevated' | 'filled';
export type CardOrientation = 'vertical' | 'horizontal';

/**
 * A container that groups related content: an optional image, a header, the
 * content and actions. Empty sections take no space.
 *
 * A card is a plain container for assistive tech. To make a whole card a link,
 * put a link in the header and let it cover the card with CSS, so the card's
 * buttons stay usable.
 *
 * @summary Groups related content and actions.
 * @tag uf-card
 *
 * @slot - The main content.
 * @slot media - An image or video, edge to edge at the top (or the start, when horizontal).
 * @slot header - The title area, e.g. a heading and a subtitle.
 * @slot footer - Actions or details at the bottom.
 *
 * @csspart base - The card.
 * @csspart media - The media wrapper.
 * @csspart header - The header wrapper.
 * @csspart body - The main content wrapper.
 * @csspart footer - The footer wrapper.
 *
 * @cssprop --uf-card-padding - Padding of header, body and footer.
 * @cssprop --uf-card-bg - Background color.
 * @cssprop --uf-card-border-color - Border color.
 * @cssprop --uf-card-radius - Corner radius.
 * @cssprop --uf-card-shadow - Shadow of an elevated card. Defaults to a soft shadow in light mode and an accent glow in dark mode.
 * @cssprop --uf-card-media-width - Width of the media in a horizontal card. Defaults to 40%.
 */
export class UfCard extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
        --_padding: var(--uf-card-padding, var(--uf-space-5));
      }

      .base {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        border: 1px solid var(--uf-card-border-color, var(--uf-color-border));
        border-radius: var(--uf-card-radius, var(--uf-radius-md));
        background: var(--uf-card-bg, var(--uf-color-surface-raised));
        color: var(--uf-color-text);
        font-family: var(--uf-font-family-sans);
      }

      /* A shadow in light mode, an accent glow in dark mode (--uf-shadow-raised). */
      :host([variant='elevated']) .base {
        border-color: var(--uf-card-border-color, transparent);
        box-shadow: var(--uf-card-shadow, var(--uf-shadow-raised));
      }

      :host([variant='filled']) .base {
        border-color: var(--uf-card-border-color, transparent);
        background: var(--uf-card-bg, var(--uf-color-surface-hover));
      }

      .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
      }

      .media ::slotted(*) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .header,
      .body,
      .footer {
        padding: var(--_padding);
      }

      .header {
        padding-bottom: 0;
      }

      .body {
        flex: 1;
      }

      .footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--uf-space-2);
        padding-top: 0;
      }

      /* A body after a header only needs half the gap. */
      .has-header .body {
        padding-top: var(--uf-space-3);
      }

      /* Without a body, the header and footer keep their own padding. */
      .no-body .header {
        padding-bottom: var(--_padding);
      }
      .no-body.has-header .footer {
        padding-top: 0;
      }

      .empty {
        display: none;
      }

      :host([orientation='horizontal']) .base {
        flex-direction: row;
      }

      :host([orientation='horizontal']) .media {
        flex: 0 0 var(--uf-card-media-width, 40%);
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    variant: { reflect: true },
    orientation: { reflect: true },
  };

  /** `outline` (a border), `elevated` (a shadow, or an accent glow in dark mode) or `filled` (a tinted background). */
  declare variant: CardVariant;
  /** `vertical`, or `horizontal` to put the media beside the content. */
  declare orientation: CardOrientation;

  readonly #slots = new HasSlotController(this, 'media', 'header', 'footer', '');

  constructor() {
    super();
    this.variant = 'outline';
    this.orientation = 'vertical';
  }

  /** True when the default slot has elements or non-blank text. */
  #hasBody(): boolean {
    return [...this.childNodes].some(
      (node) =>
        (node.nodeType === Node.ELEMENT_NODE && !(node as Element).hasAttribute('slot')) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent!.trim() !== ''),
    );
  }

  override render() {
    const has = { media: this.#slots.has('media'), header: this.#slots.has('header'), footer: this.#slots.has('footer') };
    const body = this.#hasBody();
    return html`<div class=${classMap({ base: true, 'has-header': has.header, 'no-body': !body })} part="base">
      <div class=${classMap({ media: true, empty: !has.media })} part="media"><slot name="media"></slot></div>
      <div class="content">
        <div class=${classMap({ header: true, empty: !has.header })} part="header"><slot name="header"></slot></div>
        <div class=${classMap({ body: true, empty: !body })} part="body"><slot></slot></div>
        <div class=${classMap({ footer: true, empty: !has.footer })} part="footer"><slot name="footer"></slot></div>
      </div>
    </div>`;
  }
}

defineElement('uf-card', UfCard);

declare global {
  interface HTMLElementTagNameMap {
    'uf-card': UfCard;
  }
}
