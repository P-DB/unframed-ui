import { LitElement, css, html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { defineElement } from '../../internal/define.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

export type DialogCloseSource = 'close-button' | 'escape' | 'backdrop' | 'trigger' | 'method';

export interface DialogRequestCloseDetail {
  source: DialogCloseSource;
}

let scrollLocks = 0;
let savedStyles: { overflow: string; paddingRight: string } | undefined;

/**
 * Locks page scroll while any dialog is open. Hiding overflow removes a classic
 * (non-overlay) scrollbar, so the page is padded by its width to avoid a shift.
 * (`scrollbar-gutter: stable` isn't honoured on the root once overflow is hidden.)
 * The width is exposed as `--uf-scrollbar-width` for fixed elements to compensate.
 */
function lockScroll(lock: boolean): void {
  const html = document.documentElement;
  const wasLocked = scrollLocks > 0;
  scrollLocks = Math.max(0, scrollLocks + (lock ? 1 : -1));

  if (scrollLocks > 0 && !wasLocked) {
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    savedStyles = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    if (scrollbarWidth > 0) {
      const padding = parseFloat(getComputedStyle(html).paddingRight) || 0;
      html.style.paddingRight = `${padding + scrollbarWidth}px`;
      html.style.setProperty('--uf-scrollbar-width', `${scrollbarWidth}px`);
    }
    html.style.overflow = 'hidden';
  } else if (scrollLocks === 0 && wasLocked && savedStyles) {
    html.style.overflow = savedStyles.overflow;
    html.style.paddingRight = savedStyles.paddingRight;
    html.style.removeProperty('--uf-scrollbar-width');
    savedStyles = undefined;
  }
}

/**
 * A modal dialog built on the native `<dialog>`: it renders in the top layer,
 * traps focus, makes the page inert, and returns focus to the opener on close.
 * Any element inside with `data-dialog="close"` closes it.
 *
 * @summary Shows content in a modal window on top of the page.
 * @tag uf-dialog
 *
 * @slot - The dialog content.
 * @slot label - The title, when you need markup. Overrides `label`.
 * @slot header-actions - Extra buttons next to the close button.
 * @slot footer - Actions at the bottom, usually buttons.
 *
 * @event uf-show - The dialog opened.
 * @event uf-hide - The dialog closed.
 * @event {CustomEvent<DialogRequestCloseDetail>} uf-request-close - The user tried to close the dialog. Call `preventDefault()` to keep it open.
 *
 * @csspart dialog - The native `<dialog>`.
 * @csspart header - The header with title and close button.
 * @csspart title - The title.
 * @csspart close-button - The close button.
 * @csspart body - The content area.
 * @csspart footer - The footer.
 *
 * @cssprop --uf-dialog-bg - Background of the dialog.
 * @cssprop --uf-dialog-width - Width of the dialog. Defaults to `32rem`.
 * @cssprop --uf-dialog-padding - Padding of header, body and footer.
 * @cssprop --uf-dialog-radius - Corner radius.
 * @cssprop --uf-dialog-backdrop - Backdrop color.
 */
export class UfDialog extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        --_padding: var(--uf-dialog-padding, var(--uf-space-5));
        display: contents;
      }

      dialog {
        flex-direction: column;
        width: min(var(--uf-dialog-width, 32rem), calc(100vw - 2rem));
        max-height: calc(100dvh - 2rem);
        padding: 0;
        border: 1px solid var(--uf-color-border);
        border-radius: var(--uf-dialog-radius, var(--uf-radius-lg));
        background: var(--uf-dialog-bg, var(--uf-color-surface-overlay));
        color: var(--uf-color-text);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        box-shadow: var(--uf-shadow-lg);
        overflow: hidden;
      }

      dialog[open] {
        display: flex;
      }

      dialog::backdrop {
        background: var(--uf-dialog-backdrop, color-mix(in srgb, var(--uf-color-backdrop) 50%, transparent));
      }

      /*
       * Keyframe animations rather than transitions on display/overlay: the
       * component keeps the dialog open (modal, in the top layer) until the exit
       * animation ends, so it behaves the same in every browser.
       */
      dialog[open] {
        animation: uf-dialog-in var(--uf-duration-base) ease;
      }

      dialog[open]::backdrop {
        animation: uf-fade-in var(--uf-duration-base) ease;
      }

      dialog.closing {
        animation: uf-dialog-out var(--uf-duration-base) ease forwards;
      }

      dialog.closing::backdrop {
        animation: uf-fade-out var(--uf-duration-base) ease forwards;
      }

      @keyframes uf-dialog-in {
        from {
          opacity: 0;
          translate: 0 0.5rem;
        }
      }

      @keyframes uf-dialog-out {
        to {
          opacity: 0;
          translate: 0 0.5rem;
        }
      }

      @keyframes uf-fade-in {
        from {
          opacity: 0;
        }
      }

      @keyframes uf-fade-out {
        to {
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        dialog[open],
        dialog[open]::backdrop,
        dialog.closing,
        dialog.closing::backdrop {
          animation: none;
        }
      }

      .header {
        display: flex;
        align-items: center;
        gap: var(--uf-space-2);
        padding: var(--_padding) var(--_padding) 0;
      }

      .title {
        flex: 1;
        margin: 0;
        font-size: var(--uf-font-size-lg);
        font-weight: var(--uf-font-weight-semibold);
        line-height: 1.3;
      }

      .close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--uf-size-control-sm);
        height: var(--uf-size-control-sm);
        margin: calc(var(--uf-space-1) * -1) calc(var(--uf-space-2) * -1) calc(var(--uf-space-1) * -1) 0;
        padding: 0;
        border: 0;
        border-radius: var(--uf-radius-md);
        background: transparent;
        color: var(--uf-color-text-muted);
        cursor: pointer;
      }

      .close:hover {
        background: var(--uf-color-surface-hover);
        color: var(--uf-color-text);
      }

      .close:focus-visible {
        outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
        outline-offset: 0;
      }

      .close .icon {
        width: 1.125rem;
        height: 1.125rem;
      }

      .body {
        flex: 1;
        padding: var(--_padding);
        overflow: auto;
        line-height: 1.5;
      }

      .footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: var(--uf-space-2);
        padding: var(--uf-space-2) var(--_padding) var(--_padding);
      }

      [hidden] {
        display: none !important;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    open: { type: Boolean, reflect: true },
    label: {},
    lightDismiss: { type: Boolean, attribute: 'light-dismiss' },
    withoutHeader: { type: Boolean, attribute: 'without-header' },
  };

  /** Whether the dialog is open. */
  declare open: boolean;
  /** Title of the dialog, also its accessible name. */
  declare label: string | undefined;
  /** Closes the dialog when the backdrop is clicked. */
  declare lightDismiss: boolean;
  /** Hides the header. Set `label` anyway, so the dialog keeps an accessible name. */
  declare withoutHeader: boolean;

  readonly #slots = new HasSlotController(this, 'footer', 'label');
  readonly #id = uniqueId('uf-dialog');

  constructor() {
    super();
    this.open = false;
    this.lightDismiss = false;
    this.withoutHeader = false;
    this.addEventListener('click', this.#onHostClick);
  }

  get #dialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog');
  }

  /** Opens the dialog. */
  show(): void {
    this.open = true;
  }

  /** Closes the dialog, without firing `uf-request-close`. */
  hide(): void {
    this.open = false;
  }

  /** Asks to close, as a user action would. Listeners can cancel it. */
  requestClose(source: DialogCloseSource = 'trigger'): void {
    const event = new CustomEvent<DialogRequestCloseDetail>('uf-request-close', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { source },
    });
    if (this.dispatchEvent(event)) this.open = false;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#dialog?.close();
    this.#setScrollLock(false);
  }

  /** Each dialog holds at most one scroll lock, however it was closed. */
  #setScrollLock(lock: boolean): void {
    if (lock === this.#scrollLocked) return;
    this.#scrollLocked = lock;
    lockScroll(lock);
  }

  #scrollLocked = false;

  override updated(changed: PropertyValues<this>): void {
    if (!changed.has('open')) return;
    const dialog = this.#dialog;
    if (!dialog) return;

    if (this.open) {
      // Reopened during the exit animation: just cancel the exit.
      if (dialog.classList.contains('closing')) {
        dialog.classList.remove('closing');
        return;
      }
      if (dialog.open) return;
      dialog.showModal();
      this.#setScrollLock(true);
      this.dispatchEvent(new Event('uf-show', { bubbles: true, composed: true }));
    } else if (dialog.open) {
      void this.#animateClose(dialog);
    }
  }

  /** Plays the exit animation while the dialog is still modal, then closes it. */
  async #animateClose(dialog: HTMLDialogElement): Promise<void> {
    dialog.classList.add('closing');
    const animations = document.hidden ? [] : dialog.getAnimations({ subtree: true });
    // Animations pause in background tabs; never let that keep the dialog open.
    const longest = Math.max(0, ...animations.map((a) => Number(a.effect?.getComputedTiming().endTime) || 0));
    await Promise.race([
      Promise.allSettled(animations.map((a) => a.finished)),
      new Promise((resolve) => setTimeout(resolve, longest + 50)),
    ]);
    if (this.open || !dialog.classList.contains('closing')) return;
    dialog.classList.remove('closing');
    dialog.close();
    this.#setScrollLock(false);
    this.dispatchEvent(new Event('uf-hide', { bubbles: true, composed: true }));
  }

  #onCancel = (event: Event): void => {
    event.preventDefault();
    this.requestClose('escape');
  };

  /** Closed by something other than this component, e.g. `<form method="dialog">`. */
  #onClose = (): void => {
    this.#setScrollLock(false);
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event('uf-hide', { bubbles: true, composed: true }));
  };

  #onDialogClick = (event: MouseEvent): void => {
    // The dialog has no padding, so a click whose target is the dialog itself hit the backdrop.
    if (this.lightDismiss && event.target === this.#dialog) this.requestClose('backdrop');
  };

  #onHostClick = (event: MouseEvent): void => {
    const closer = event.composedPath().find((el) => el instanceof Element && el.getAttribute('data-dialog') === 'close');
    if (closer && this.open) this.requestClose('trigger');
  };

  override render() {
    const titleId = `${this.#id}-title`;
    return html`
      <dialog
        part="dialog"
        aria-labelledby=${titleId}
        @cancel=${this.#onCancel}
        @close=${this.#onClose}
        @click=${this.#onDialogClick}
      >
        <header class="header" part="header" ?hidden=${this.withoutHeader}>
          <h2 id=${titleId} class="title" part="title"><slot name="label">${this.label}</slot></h2>
          <slot name="header-actions"></slot>
          <button class="close" part="close-button" type="button" aria-label="Close" @click=${() => this.requestClose('close-button')}>
            ${iconSvg(icons.x)}
          </button>
        </header>
        <div class="body" part="body"><slot></slot></div>
        <footer class="footer" part="footer" ?hidden=${!this.#slots.has('footer')}>
          <slot name="footer"></slot>
        </footer>
      </dialog>
    `;
  }
}

defineElement('uf-dialog', UfDialog);

declare global {
  interface HTMLElementTagNameMap {
    'uf-dialog': UfDialog;
  }
}
