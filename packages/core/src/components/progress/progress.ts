import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

export type ProgressVariant = 'accent' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

/**
 * A bar that shows how far a task has got. Without a `value` it's
 * indeterminate: an animated bar for work whose length isn't known, like a
 * native `<progress>`.
 *
 * @summary Shows how far a task has got.
 * @tag uf-progress
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 *
 * @csspart base - The wrapper around label and bar.
 * @csspart label - The label.
 * @csspart value - The percentage, when `show-value` is set.
 * @csspart track - The bar's background.
 * @csspart indicator - The filled part of the bar.
 *
 * @cssprop --uf-progress-height - Height of the bar.
 * @cssprop --uf-progress-radius - Corner radius of the bar. Use `999px` for a pill.
 * @cssprop --uf-progress-track-color - Color of the bar's background.
 * @cssprop --uf-progress-indicator-color - Color of the filled part.
 */
export class UfProgress extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
        --_height: var(--uf-progress-height, 0.5rem);
        --_color: var(--uf-color-accent);
      }

      :host([size='sm']) {
        --_height: var(--uf-progress-height, 0.25rem);
      }

      :host([size='lg']) {
        --_height: var(--uf-progress-height, 0.75rem);
      }

      :host([variant='success']) {
        --_color: var(--uf-color-success);
      }
      :host([variant='warning']) {
        --_color: var(--uf-color-warning);
      }
      :host([variant='danger']) {
        --_color: var(--uf-color-danger);
      }

      .base {
        display: flex;
        flex-direction: column;
        gap: var(--uf-space-1);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-sm);
        color: var(--uf-color-text);
      }

      .header {
        display: flex;
        justify-content: space-between;
        gap: var(--uf-space-2);
      }

      .label {
        font-weight: var(--uf-font-weight-medium);
      }

      .value {
        color: var(--uf-color-text-muted);
        font-variant-numeric: tabular-nums;
      }

      .track {
        position: relative;
        height: var(--_height);
        border-radius: var(--uf-progress-radius, var(--uf-radius-control));
        background: var(--uf-progress-track-color, var(--uf-color-surface-hover));
        overflow: hidden;
      }

      .indicator {
        height: 100%;
        border-radius: inherit;
        background: var(--uf-progress-indicator-color, var(--_color));
        transition: width var(--uf-duration-base) ease;
      }

      .indeterminate .indicator {
        position: absolute;
        width: 40%;
        animation: uf-progress-slide 1.5s ease-in-out infinite;
      }

      @keyframes uf-progress-slide {
        from {
          left: -40%;
        }
        to {
          left: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .indicator {
          transition: none;
        }
        .indeterminate .indicator {
          animation-duration: 4s;
        }
      }

      [hidden] {
        display: none !important;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    value: { type: Number },
    max: { type: Number },
    label: {},
    showValue: { type: Boolean, attribute: 'show-value' },
    variant: { reflect: true },
    size: { reflect: true },
  };

  /** Progress so far, from 0 to `max`. Leave it out for an indeterminate bar. */
  declare value: number | undefined;
  /** The value that means done. */
  declare max: number;
  /** Visible label, also the bar's accessible name. Without one, it's named "Progress". */
  declare label: string | undefined;
  /** Shows the percentage next to the label. */
  declare showValue: boolean;
  /** Color, by meaning: `accent`, `success`, `warning` or `danger`. */
  declare variant: ProgressVariant;
  /** Height of the bar: `sm`, `md` or `lg`. */
  declare size: ProgressSize;

  readonly #slots = new HasSlotController(this, 'label');
  readonly #id = uniqueId('uf-progress');
  readonly #translator = new Translator(this);

  constructor() {
    super();
    this.max = 100;
    this.showValue = false;
    this.variant = 'accent';
    this.size = 'md';
  }

  /** The value as a percentage, or undefined when indeterminate. */
  get #percent(): number | undefined {
    if (this.value == null || Number.isNaN(this.value)) return undefined;
    const max = this.max > 0 ? this.max : 100;
    return Math.round((Math.min(Math.max(this.value, 0), max) / max) * 100);
  }

  override render() {
    const percent = this.#percent;
    const indeterminate = percent === undefined;
    const hasLabel = Boolean(this.label) || this.#slots.has('label');
    const showValue = this.showValue && !indeterminate;
    const labelId = `${this.#id}-label`;
    return html`
      <div class="base" part="base">
        <div class="header" ?hidden=${!hasLabel && !showValue}>
          <span id=${labelId} class="label" part="label" ?hidden=${!hasLabel}><slot name="label">${this.label}</slot></span>
          ${showValue ? html`<span class="value" part="value" aria-hidden="true">${percent}%</span>` : nothing}
        </div>
        <div
          class="track ${indeterminate ? 'indeterminate' : ''}"
          part="track"
          role="progressbar"
          aria-labelledby=${ifDefined(hasLabel ? labelId : undefined)}
          aria-label=${ifDefined(hasLabel ? undefined : this.#translator.t('progress'))}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${ifDefined(percent)}
        >
          <div class="indicator" part="indicator" style=${indeterminate ? '' : `width: ${percent}%`}></div>
        </div>
      </div>
    `;
  }
}

defineElement('uf-progress', UfProgress);

declare global {
  interface HTMLElementTagNameMap {
    'uf-progress': UfProgress;
  }
}
