import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController } from '../../internal/slot.js';

export type AlertVariant = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';

const variantIcons = {
  neutral: icons.info,
  accent: icons.info,
  info: icons.info,
  success: icons['check-circle'],
  warning: icons['alert-triangle'],
  danger: icons['alert-circle'],
} as const;

/**
 * A message in the page, like "Your trial ends in 3 days" or "We couldn't save
 * your changes". Unlike a toast it stays where it is until it's dismissed.
 *
 * `warning` and `danger` alerts are announced right away (`role="alert"`), the
 * others politely (`role="status"`). Assistive tech announces an alert when it's
 * added to the page or shown, not when the page loads with it.
 *
 * @summary Shows a message in the page, by meaning: info, success, warning or danger.
 * @tag uf-alert
 *
 * @slot - The message.
 * @slot heading - The heading, when you need markup. Overrides `heading`.
 * @slot icon - Replaces the variant's icon.
 * @slot actions - Buttons or links below the message.
 *
 * @event uf-show - The alert was shown with `show()`.
 * @event uf-hide - The alert was hidden, with the close button or `hide()`.
 *
 * @csspart base - The alert.
 * @csspart icon - The icon.
 * @csspart content - The wrapper around the heading, message and actions.
 * @csspart heading - The heading.
 * @csspart message - The message.
 * @csspart actions - The wrapper around the actions.
 * @csspart close-button - The close button, when `closable` is set.
 *
 * @cssprop --uf-alert-bg - Background color.
 * @cssprop --uf-alert-border-color - Border color.
 * @cssprop --uf-alert-color - Text color.
 * @cssprop --uf-alert-icon-color - Icon color.
 * @cssprop --uf-alert-radius - Corner radius.
 * @cssprop --uf-alert-padding - Space inside the alert.
 */
export class UfAlert extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
        --_bg: var(--uf-color-surface-hover);
        --_border: var(--uf-color-border);
        --_icon: var(--uf-color-text-muted);
      }

      :host([hidden]) {
        display: none;
      }

      :host([variant='accent']) {
        --_bg: var(--uf-color-accent-subtle);
        --_icon: var(--uf-color-accent-strong);
      }
      :host([variant='info']) {
        --_bg: var(--uf-color-info-subtle);
        --_icon: var(--uf-color-info);
      }
      :host([variant='success']) {
        --_bg: var(--uf-color-success-subtle);
        --_icon: var(--uf-color-success);
      }
      :host([variant='warning']) {
        --_bg: var(--uf-color-warning-subtle);
        --_icon: var(--uf-color-warning);
      }
      :host([variant='danger']) {
        --_bg: var(--uf-color-danger-subtle);
        --_icon: var(--uf-color-danger-text);
      }
      /* A border in the variant's color, faint enough to keep the text the focus. */
      :host(:not([variant='neutral'])) {
        --_border: color-mix(in srgb, var(--_icon) 35%, transparent);
      }

      .base {
        display: flex;
        align-items: flex-start;
        gap: var(--uf-space-3);
        padding: var(--uf-alert-padding, var(--uf-space-3) var(--uf-space-4));
        border: 1px solid var(--uf-alert-border-color, var(--_border));
        border-radius: var(--uf-alert-radius, var(--uf-radius-md));
        background: var(--uf-alert-bg, var(--_bg));
        color: var(--uf-alert-color, var(--uf-color-text));
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        line-height: 1.5;
      }

      .icon-slot {
        display: inline-flex;
        flex: none;
        /* Centers the icon on the first line of text. */
        margin-top: calc((1.5em - 1.125rem) / 2);
        color: var(--uf-alert-icon-color, var(--_icon));
      }

      .icon-slot .icon,
      ::slotted([slot='icon']) {
        width: 1.125rem;
        height: 1.125rem;
      }

      .content {
        flex: 1;
        min-width: 0;
      }

      .heading {
        display: block;
        font-weight: var(--uf-font-weight-semibold);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--uf-space-2);
        margin-top: var(--uf-space-3);
      }

      .close {
        display: inline-flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        /* Lines up with the first line of text, without making the alert taller. */
        margin: calc((1.5em - 1.75rem) / 2) calc(var(--uf-space-1) * -1) 0 0;
        padding: 0;
        border: 0;
        border-radius: var(--uf-radius-sm);
        background: transparent;
        color: var(--uf-color-text-muted);
        cursor: pointer;
      }

      .close:hover {
        background: color-mix(in srgb, currentColor 14%, transparent);
        color: var(--uf-color-text);
      }

      .close:focus-visible {
        outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
        outline-offset: 0;
      }

      .close .icon {
        width: 1rem;
        height: 1rem;
      }

      [hidden] {
        display: none !important;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    variant: { reflect: true },
    heading: {},
    closable: { type: Boolean, reflect: true },
    withoutIcon: { type: Boolean, reflect: true, attribute: 'without-icon' },
  };

  /** Color, icon and urgency, by meaning: `neutral`, `accent`, `info`, `success`, `warning` or `danger`. */
  declare variant: AlertVariant;
  /** Bold first line. */
  declare heading: string | undefined;
  /** Shows a close button that hides the alert. */
  declare closable: boolean;
  /** Hides the icon. */
  declare withoutIcon: boolean;

  readonly #slots = new HasSlotController(this, 'heading', 'actions');
  readonly #translator = new Translator(this);

  constructor() {
    super();
    this.variant = 'info';
    this.closable = false;
    this.withoutIcon = false;
  }

  /** Shows the alert again after it was hidden. */
  show(): void {
    if (!this.hidden) return;
    this.hidden = false;
    this.dispatchEvent(new Event('uf-show'));
  }

  /** Hides the alert, like its close button. */
  hide(): void {
    if (this.hidden) return;
    this.hidden = true;
    this.dispatchEvent(new Event('uf-hide'));
  }

  override render() {
    const hasHeading = Boolean(this.heading) || this.#slots.has('heading');
    const urgent = this.variant === 'warning' || this.variant === 'danger';
    return html`
      <div class="base" part="base" role=${urgent ? 'alert' : 'status'}>
        <span class="icon-slot" part="icon" ?hidden=${this.withoutIcon}>
          <slot name="icon">${iconSvg(variantIcons[this.variant] ?? icons.info, '')}</slot>
        </span>
        <div class="content" part="content">
          <strong class="heading" part="heading" ?hidden=${!hasHeading}><slot name="heading">${this.heading ?? nothing}</slot></strong>
          <div class="message" part="message"><slot></slot></div>
          <div class="actions" part="actions" ?hidden=${!this.#slots.has('actions')}><slot name="actions"></slot></div>
        </div>
        ${this.closable
          ? html`<button class="close" part="close-button" type="button" aria-label=${this.#translator.t('close')} @click=${() => this.hide()}>
              ${iconSvg(icons.x, '')}
            </button>`
          : nothing}
      </div>
    `;
  }
}

defineElement('uf-alert', UfAlert);

declare global {
  interface HTMLElementTagNameMap {
    'uf-alert': UfAlert;
  }
}
