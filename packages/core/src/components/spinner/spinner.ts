import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { hostStyles } from '../../internal/shared.styles.js';

export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * A spinning circle for work in progress whose length isn't known. Screen
 * readers announce it as "Loading" (translatable), or as its `label`.
 *
 * @summary Shows that something is loading.
 * @tag uf-spinner
 *
 * @csspart base - The spinner.
 *
 * @cssprop --uf-spinner-size - Diameter. Overrides `size`.
 * @cssprop --uf-spinner-track-color - Color of the circle.
 * @cssprop --uf-spinner-indicator-color - Color of the moving arc.
 */
export class UfSpinner extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        --_size: var(--uf-spinner-size, 1.5rem);
      }

      :host([size='sm']) {
        --_size: var(--uf-spinner-size, 1rem);
      }

      :host([size='lg']) {
        --_size: var(--uf-spinner-size, 2.5rem);
      }

      .base {
        width: var(--_size);
        height: var(--_size);
        border: max(2px, calc(var(--_size) / 10)) solid var(--uf-spinner-track-color, var(--uf-color-surface-hover));
        border-top-color: var(--uf-spinner-indicator-color, var(--uf-color-accent));
        border-radius: 50%;
        animation: uf-spin 0.7s linear infinite;
      }

      @keyframes uf-spin {
        to {
          rotate: 360deg;
        }
      }

      /* Still turning, so it still says "working", but slowly. */
      @media (prefers-reduced-motion: reduce) {
        .base {
          animation-duration: 2s;
        }
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    label: {},
    size: { reflect: true },
  };

  /** Accessible name. Defaults to "Loading", in the page's language. */
  declare label: string | undefined;
  /** Size: `sm`, `md` or `lg`. */
  declare size: SpinnerSize;

  readonly #translator = new Translator(this);

  constructor() {
    super();
    this.size = 'md';
  }

  override render() {
    return html`<div class="base" part="base" role="progressbar" aria-label=${this.label || this.#translator.t('loading')}></div>`;
  }
}

defineElement('uf-spinner', UfSpinner);

declare global {
  interface HTMLElementTagNameMap {
    'uf-spinner': UfSpinner;
  }
}
