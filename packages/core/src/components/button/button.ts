import { LitElement, html, nothing, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { buttonStyles } from './button.styles.js';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * A button that works like a native `<button>`, inside or outside a form,
 * or renders as a link when `href` is set.
 *
 * @summary Triggers an action or navigates to a URL.
 * @tag uf-button
 *
 * @slot - The button's label.
 * @slot prefix - An icon or element before the label.
 * @slot suffix - An icon or element after the label.
 *
 * ARIA state set on the host (`aria-expanded`, `aria-haspopup`, `aria-pressed`,
 * `aria-current`, `aria-description`) is forwarded to the inner button, so
 * popovers, tooltips and toggle patterns work with it like with a native button.
 *
 * @csspart base - The inner `<button>` or `<a>`.
 * @csspart label - The wrapper around the default slot.
 * @csspart prefix - The prefix slot.
 * @csspart suffix - The suffix slot.
 * @csspart spinner - The loading spinner.
 *
 * @cssprop --uf-button-bg - Background color (all states unless overridden).
 * @cssprop --uf-button-bg-hover - Background color on hover.
 * @cssprop --uf-button-bg-active - Background color while pressed.
 * @cssprop --uf-button-color - Text color.
 * @cssprop --uf-button-border-color - Border color.
 * @cssprop --uf-button-radius - Corner radius.
 * @cssprop --uf-button-height - Height.
 * @cssprop --uf-button-padding - Horizontal padding.
 * @cssprop --uf-button-gap - Space between prefix, label and suffix.
 * @cssprop --uf-button-font-family - Font family.
 * @cssprop --uf-button-font-weight - Font weight.
 */
export class UfButton extends LitElement {
  static override styles = buttonStyles;
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
  static formAssociated = true;

  static override properties: PropertyDeclarations = {
    variant: { reflect: true },
    size: { reflect: true },
    type: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    label: {},
    href: {},
    target: {},
    rel: {},
    download: {},
  };

  /** Visual style. */
  declare variant: ButtonVariant;
  /** Size of the button. */
  declare size: ButtonSize;
  /** Behaviour inside a form. Defaults to `button` so it never submits by accident. */
  declare type: ButtonType;
  /** Disables the button. */
  declare disabled: boolean;
  /** Shows a spinner and ignores clicks, while keeping the button focusable. */
  declare loading: boolean;
  /** Accessible name, for icon-only buttons. */
  declare label: string | undefined;
  /** Renders the button as a link to this URL. */
  declare href: string | undefined;
  /** Link target, used with `href`. */
  declare target: string | undefined;
  /** Link rel, used with `href`. Defaults to `noreferrer noopener` when `target="_blank"`. */
  declare rel: string | undefined;
  /** Download filename, used with `href`. */
  declare download: string | undefined;
  static #forwardedAria = ['aria-expanded', 'aria-haspopup', 'aria-pressed', 'aria-current', 'aria-description'];

  readonly #internals = this.attachInternals();
  readonly #ariaObserver = new MutationObserver(() => this.requestUpdate());
  /** Set when an ancestor `<fieldset disabled>` disables the button. */
  #formDisabled = false;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.type = 'button';
    this.disabled = false;
    this.loading = false;
    // Registered first, so it runs before any listener a consumer adds.
    this.addEventListener('click', this.#handleClick);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#ariaObserver.observe(this, { attributes: true, attributeFilter: UfButton.#forwardedAria });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#ariaObserver.disconnect();
  }

  #aria(name: string): string | undefined {
    return this.getAttribute(name) ?? undefined;
  }

  /** The form this button belongs to, if any. */
  get form(): HTMLFormElement | null {
    return this.#internals.form;
  }

  /** @internal */
  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.requestUpdate();
  }

  get #isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  #handleClick = (event: MouseEvent): void => {
    if (this.#isDisabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (this.href) return;

    const form = this.#internals.form;
    if (this.type === 'submit') form?.requestSubmit();
    else if (this.type === 'reset') form?.reset();
  };

  override render() {
    const disabled = this.#isDisabled;
    const classes = classMap({ base: true, disabled, loading: this.loading });
    const content = html`
      <slot name="prefix" part="prefix"></slot>
      <span class="label" part="label"><slot></slot></span>
      <slot name="suffix" part="suffix"></slot>
      ${this.loading ? html`<span class="spinner" part="spinner" aria-hidden="true"></span>` : nothing}
    `;

    if (this.href) {
      const rel = this.rel ?? (this.target === '_blank' ? 'noreferrer noopener' : undefined);
      return html`<a
        part="base"
        class=${classes}
        href=${ifDefined(disabled ? undefined : this.href)}
        target=${ifDefined(disabled ? undefined : this.target)}
        rel=${ifDefined(rel)}
        download=${ifDefined(this.download)}
        role=${ifDefined(disabled ? 'link' : undefined)}
        tabindex=${ifDefined(disabled ? '0' : undefined)}
        aria-disabled=${ifDefined(disabled ? 'true' : undefined)}
        aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
        aria-label=${ifDefined(this.label)}
        aria-current=${ifDefined(this.#aria('aria-current'))}
        aria-description=${ifDefined(this.#aria('aria-description'))}
        >${content}</a
      >`;
    }

    return html`<button
      part="base"
      class=${classes}
      type="button"
      ?disabled=${disabled}
      aria-disabled=${ifDefined(this.loading ? 'true' : undefined)}
      aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
      aria-label=${ifDefined(this.label)}
      aria-expanded=${ifDefined(this.#aria('aria-expanded'))}
      aria-haspopup=${ifDefined(this.#aria('aria-haspopup') as 'true' | undefined)}
      aria-pressed=${ifDefined(this.#aria('aria-pressed'))}
      aria-description=${ifDefined(this.#aria('aria-description'))}
    >
      ${content}
    </button>`;
  }
}

defineElement('uf-button', UfButton);

declare global {
  interface HTMLElementTagNameMap {
    'uf-button': UfButton;
  }
}
