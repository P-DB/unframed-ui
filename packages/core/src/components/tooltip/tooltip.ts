import { LitElement, css, html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { defineElement } from '../../internal/define.js';
import { autoUpdate, positionFloating, type Placement } from '../../internal/position.js';

/**
 * A short label that appears on hover and keyboard focus. Wrap the element it
 * describes. The text is also set as the trigger's `aria-description`, so
 * screen reader users get it too. Don't put interactive content in a tooltip.
 *
 * @summary Shows a short hint for the element it wraps.
 * @tag uf-tooltip
 *
 * @slot - The element the tooltip describes.
 *
 * @csspart body - The tooltip bubble.
 *
 * @cssprop --uf-tooltip-bg - Background color.
 * @cssprop --uf-tooltip-color - Text color.
 * @cssprop --uf-tooltip-max-width - Maximum width.
 */
export class UfTooltip extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    .body {
      position: fixed;
      inset: auto;
      margin: 0;
      max-width: var(--uf-tooltip-max-width, 18rem);
      padding: var(--uf-space-1) var(--uf-space-2);
      border: 0;
      border-radius: var(--uf-radius-sm);
      background: var(--uf-tooltip-bg, var(--uf-color-text));
      color: var(--uf-tooltip-color, var(--uf-color-surface));
      font-family: var(--uf-font-family-sans);
      font-size: var(--uf-font-size-sm);
      line-height: 1.4;
      overflow: visible;
      opacity: 0;
      transition:
        opacity var(--uf-duration-fast) ease,
        overlay var(--uf-duration-fast) allow-discrete,
        display var(--uf-duration-fast) allow-discrete;
    }

    .body:popover-open {
      opacity: 1;
    }

    @starting-style {
      .body:popover-open {
        opacity: 0;
      }
    }
  `;

  static override properties: PropertyDeclarations = {
    content: {},
    placement: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    delay: { type: Number },
    open: { type: Boolean, reflect: true },
  };

  /** The tooltip text. */
  declare content: string;
  /** Preferred side. Flips when there is no room. */
  declare placement: Placement;
  /** Turns the tooltip off. */
  declare disabled: boolean;
  /** Milliseconds to wait on hover before showing. Focus shows it immediately. */
  declare delay: number;
  /** Whether the tooltip is showing. */
  declare open: boolean;

  #timer = 0;
  #cleanup?: () => void;

  constructor() {
    super();
    this.content = '';
    this.placement = 'top';
    this.disabled = false;
    this.delay = 300;
    this.open = false;
    this.addEventListener('pointerenter', this.#onPointerEnter);
    this.addEventListener('pointerleave', this.#onLeave);
    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onLeave);
  }

  get #body(): HTMLElement | null {
    return this.renderRoot.querySelector('.body');
  }

  get #trigger(): HTMLElement | undefined {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot');
    return slot?.assignedElements()[0] as HTMLElement | undefined;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.#onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#onKeyDown);
    clearTimeout(this.#timer);
    this.#cleanup?.();
  }

  show(): void {
    if (!this.disabled) this.open = true;
  }

  hide(): void {
    clearTimeout(this.#timer);
    this.open = false;
  }

  override updated(changed: PropertyValues<this>): void {
    const trigger = this.#trigger;
    if (trigger && changed.has('content')) {
      trigger.setAttribute('aria-description', this.content);
    }
    const body = this.#body;
    if (!changed.has('open') || !body) return;

    if (this.open && trigger && !body.matches(':popover-open')) {
      body.showPopover();
      this.#cleanup = autoUpdate(trigger, body, () => positionFloating(trigger, body, this.placement, 6));
    } else if (!this.open && body.matches(':popover-open')) {
      body.hidePopover();
      this.#cleanup?.();
      this.#cleanup = undefined;
    }
  }

  #onPointerEnter = (): void => {
    clearTimeout(this.#timer);
    this.#timer = window.setTimeout(() => this.show(), this.delay);
  };

  #onFocusIn = (): void => this.show();

  #onLeave = (): void => this.hide();

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) this.hide();
  };

  override render() {
    return html`
      <slot @slotchange=${() => this.requestUpdate('content')}></slot>
      <div class="body" part="body" popover="manual" role="tooltip">${this.content}</div>
    `;
  }
}

defineElement('uf-tooltip', UfTooltip);

declare global {
  interface HTMLElementTagNameMap {
    'uf-tooltip': UfTooltip;
  }
}
