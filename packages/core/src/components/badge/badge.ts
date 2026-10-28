import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { hostStyles } from '../../internal/shared.styles.js';

export type BadgeVariant = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeAppearance = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * A short label for a status, a category or a count. It's plain text for
 * assistive tech: write text that makes sense out of context ("3 unread", not
 * just "3"), or describe it in the surrounding element's label.
 *
 * @summary Labels a status, a category or a count.
 * @tag uf-badge
 *
 * @slot - The badge text.
 * @slot prefix - An icon before the text.
 *
 * @csspart base - The badge.
 * @csspart dot - The status dot, when `dot` is set.
 *
 * @cssprop --uf-badge-bg - Background color.
 * @cssprop --uf-badge-color - Text color.
 * @cssprop --uf-badge-border-color - Border color.
 * @cssprop --uf-badge-radius - Corner radius. Use `999px` for a pill.
 */
export class UfBadge extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        --_bg: var(--uf-color-surface-hover);
        --_fg: var(--uf-color-text);
        --_border: transparent;
      }

      .base {
        display: inline-flex;
        align-items: center;
        gap: 0.375em;
        min-height: 1.5rem;
        padding: 0 var(--uf-space-2);
        border: 1px solid var(--uf-badge-border-color, var(--_border));
        border-radius: var(--uf-badge-radius, var(--uf-radius-sm));
        background: var(--uf-badge-bg, var(--_bg));
        color: var(--uf-badge-color, var(--_fg));
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-sm);
        font-weight: var(--uf-font-weight-medium);
        line-height: 1;
        white-space: nowrap;
      }

      :host([size='sm']) .base {
        min-height: 1.25rem;
        padding: 0 var(--uf-space-1);
        font-size: 0.75rem;
      }

      :host([size='lg']) .base {
        min-height: 1.75rem;
        padding: 0 var(--uf-space-3);
        font-size: var(--uf-font-size-md);
      }

      .dot {
        width: 0.5em;
        height: 0.5em;
        border-radius: 50%;
        background: currentColor;
      }

      ::slotted([slot='prefix']) {
        display: inline-flex;
        font-size: 1.1em;
      }

      /* Soft (default): a subtle background with strong text. */
      :host([variant='accent']) {
        --_bg: var(--uf-color-accent-tint);
        --_fg: var(--uf-color-on-accent-tint);
      }
      :host([variant='info']) {
        --_bg: var(--uf-color-info-subtle);
        --_fg: var(--uf-color-info);
      }
      :host([variant='success']) {
        --_bg: var(--uf-color-success-subtle);
        --_fg: var(--uf-color-success);
      }
      :host([variant='warning']) {
        --_bg: var(--uf-color-warning-subtle);
        --_fg: var(--uf-color-warning);
      }
      :host([variant='danger']) {
        --_bg: var(--uf-color-danger-subtle);
        --_fg: var(--uf-color-danger-text);
      }

      /* Solid: the bold colors of toasts. */
      :host([appearance='solid']) {
        --_bg: var(--uf-color-toast-neutral-bg);
        --_fg: var(--uf-color-toast-neutral-text);
      }
      :host([appearance='solid'][variant='accent']) {
        --_bg: var(--uf-color-accent);
        --_fg: var(--uf-color-on-accent);
      }
      :host([appearance='solid'][variant='info']) {
        --_bg: var(--uf-color-toast-info-bg);
        --_fg: var(--uf-color-toast-info-text);
      }
      :host([appearance='solid'][variant='success']) {
        --_bg: var(--uf-color-toast-success-bg);
        --_fg: var(--uf-color-toast-success-text);
      }
      :host([appearance='solid'][variant='warning']) {
        --_bg: var(--uf-color-toast-warning-bg);
        --_fg: var(--uf-color-toast-warning-text);
      }
      :host([appearance='solid'][variant='danger']) {
        --_bg: var(--uf-color-toast-danger-bg);
        --_fg: var(--uf-color-toast-danger-text);
      }

      /* Outline: no fill, the text color as border. */
      :host([appearance='outline']) {
        --_bg: transparent;
        --_border: currentColor;
      }
      :host([appearance='outline'][variant='neutral']) {
        --_border: var(--uf-color-border-strong);
      }
      :host([appearance='outline'][variant='accent']) {
        --_fg: var(--uf-color-accent-strong);
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    variant: { reflect: true },
    appearance: { reflect: true },
    size: { reflect: true },
    dot: { type: Boolean, reflect: true },
  };

  /** Color, by meaning: `neutral`, `accent`, `info`, `success`, `warning` or `danger`. */
  declare variant: BadgeVariant;
  /** `soft` (tinted background), `solid` (bold background) or `outline` (border only). */
  declare appearance: BadgeAppearance;
  /** Size: `sm`, `md` or `lg`. */
  declare size: BadgeSize;
  /** Shows a status dot before the text. */
  declare dot: boolean;

  constructor() {
    super();
    this.variant = 'neutral';
    this.appearance = 'soft';
    this.size = 'md';
    this.dot = false;
  }

  override render() {
    return html`<span class="base" part="base">
      ${this.dot ? html`<span class="dot" part="dot" aria-hidden="true"></span>` : null}
      <slot name="prefix"></slot>
      <slot></slot>
    </span>`;
  }
}

defineElement('uf-badge', UfBadge);

declare global {
  interface HTMLElementTagNameMap {
    'uf-badge': UfBadge;
  }
}
