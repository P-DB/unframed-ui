import { LitElement, css, html, type CSSResultGroup, type PropertyDeclarations, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { autoUpdate, positionFloating, type Placement } from '../../internal/position.js';
import { hostStyles } from '../../internal/shared.styles.js';

/**
 * A panel anchored to a trigger, built on the Popover API: it renders in the
 * top layer and closes on Escape or a click outside. Use it for menus of
 * actions, filters or small forms; use a dialog for anything that blocks the page.
 *
 * @summary Shows floating content next to a trigger.
 * @tag uf-popover
 *
 * @slot trigger - The element that toggles the popover, usually a button.
 * @slot - The popover content.
 *
 * @event uf-show - The popover opened.
 * @event uf-hide - The popover closed.
 *
 * @csspart panel - The floating panel.
 *
 * @cssprop --uf-popover-padding - Padding of the panel.
 * @cssprop --uf-popover-width - Width of the panel. Defaults to its content.
 */
export class UfPopover extends LitElement {
  static override styles: CSSResultGroup = [
    hostStyles,
    css`
      :host {
        display: inline-block;
      }

      .panel {
        position: fixed;
        inset: auto;
        margin: 0;
        width: var(--uf-popover-width, max-content);
        max-width: calc(100vw - 1rem);
        padding: var(--uf-popover-padding, var(--uf-space-3));
        border: 1px solid var(--uf-color-border);
        border-radius: var(--uf-radius-md);
        background: var(--uf-color-surface-overlay);
        color: var(--uf-color-text);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        box-shadow: var(--uf-shadow-overlay);
        opacity: 0;
        transition:
          opacity var(--uf-duration-fast) ease,
          overlay var(--uf-duration-fast) allow-discrete,
          display var(--uf-duration-fast) allow-discrete;
      }

      .panel:popover-open {
        opacity: 1;
      }

      @starting-style {
        .panel:popover-open {
          opacity: 0;
        }
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    open: { type: Boolean, reflect: true },
    placement: { reflect: true },
    distance: { type: Number },
    label: {},
  };

  /** Whether the popover is open. */
  declare open: boolean;
  /** Preferred side. Flips when there is no room. */
  declare placement: Placement;
  /** Gap between trigger and panel, in pixels. */
  declare distance: number;
  /** Accessible name of the panel. Defaults to the trigger's text. */
  declare label: string | undefined;

  #cleanup?: () => void;
  #openAtPointerDown: boolean | undefined;
  #restoreFocus = false;

  constructor() {
    super();
    this.open = false;
    this.placement = 'bottom-start';
    this.distance = 6;
  }

  protected get panel(): HTMLElement | null {
    return this.renderRoot.querySelector('.panel');
  }

  protected get trigger(): HTMLElement | undefined {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    return slot?.assignedElements()[0] as HTMLElement | undefined;
  }

  /** What the panel is, for `aria-haspopup` and the panel's role. Subclasses override it. */
  protected get popupKind(): 'dialog' | 'menu' {
    return 'dialog';
  }

  /** Called after the panel opened. */
  protected afterShow(): void {}

  /** Keys pressed on the trigger. */
  protected onTriggerKeyDown(_event: KeyboardEvent): void {}

  /** True when focus is in the panel's content (light-DOM children other than the trigger). */
  protected get focusInPanel(): boolean {
    const active = document.activeElement;
    return Boolean(active && this.contains(active) && !this.trigger?.contains(active));
  }

  /** Opens the popover. */
  show(): void {
    this.open = true;
  }

  /** Closes the popover. */
  hide(): void {
    this.open = false;
  }

  /** Opens the popover if closed, closes it if open. */
  toggle(): void {
    this.open = !this.open;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#cleanup?.();
  }

  override updated(changed: PropertyValues<this>): void {
    const panel = this.panel;
    const trigger = this.trigger;
    trigger?.setAttribute('aria-haspopup', this.popupKind);
    trigger?.setAttribute('aria-expanded', String(this.open));
    if (!changed.has('open') || !panel) return;

    if (this.open && !panel.matches(':popover-open')) {
      panel.showPopover();
      if (trigger) this.#cleanup = autoUpdate(trigger, panel, () => positionFloating(trigger, panel, this.placement, this.distance));
      this.dispatchEvent(new Event('uf-show'));
      this.afterShow();
    } else if (!this.open && panel.matches(':popover-open')) {
      panel.hidePopover();
    }
  }

  #onBeforeToggle = (event: ToggleEvent): void => {
    // Checked before the panel hides, while focus is still inside it.
    if (event.newState === 'closed') this.#restoreFocus = this.focusInPanel;
  };

  /** Keeps `open` in sync when the browser closes the popover (Escape, outside click). */
  #onToggle = (event: ToggleEvent): void => {
    if (event.newState === 'closed') {
      this.#cleanup?.();
      this.#cleanup = undefined;
      this.open = false;
      // Focus would otherwise fall back to <body>.
      if (this.#restoreFocus) this.trigger?.focus();
      this.#restoreFocus = false;
      this.dispatchEvent(new Event('uf-hide'));
    }
  };

  // A click on the trigger while open first light-dismisses the popover on
  // pointerdown; remembering the state lets the click close it instead of reopening.
  #onTriggerPointerDown = (): void => {
    this.#openAtPointerDown = this.open;
  };

  #onTriggerClick = (): void => {
    const wasOpen = this.#openAtPointerDown ?? this.open;
    this.#openAtPointerDown = undefined;
    this.open = !wasOpen;
  };

  override render() {
    return html`
      <slot
        name="trigger"
        @pointerdown=${this.#onTriggerPointerDown}
        @click=${this.#onTriggerClick}
        @keydown=${(event: KeyboardEvent) => this.onTriggerKeyDown(event)}
        @slotchange=${() => this.requestUpdate()}
      ></slot>
      <div
        class="panel"
        part="panel"
        popover="auto"
        role=${ifDefined(this.popupKind === 'dialog' ? 'dialog' : undefined)}
        aria-label=${ifDefined(this.popupKind === 'dialog' ? (this.label ?? (this.trigger?.textContent?.trim() || undefined)) : undefined)}
        @beforetoggle=${this.#onBeforeToggle}
        @toggle=${this.#onToggle}
      >
        <slot></slot>
      </div>
    `;
  }
}

defineElement('uf-popover', UfPopover);

declare global {
  interface HTMLElementTagNameMap {
    'uf-popover': UfPopover;
  }
}
