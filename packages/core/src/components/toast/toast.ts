import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { iconSvg, icons } from '../../internal/icons.js';

export type ToastVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type ToasterPlacement = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

export interface ToastOptions {
  /** Bold first line. */
  title?: string;
  /** Color and icon. `danger` toasts are announced assertively. */
  variant?: ToastVariant;
  /** Milliseconds before it hides. `0` keeps it until dismissed. Defaults to 5000. */
  duration?: number;
  /** Shows a dismiss button. Defaults to true. */
  closable?: boolean;
}

export interface ToastHandle {
  /** Hides the toast now. */
  dismiss(): void;
}

interface ToastItem extends Required<Omit<ToastOptions, 'title'>> {
  id: number;
  title?: string;
  message: string;
  leaving: boolean;
}

interface Timer {
  handle: number;
  started: number;
  remaining: number;
}

const variantIcons = {
  neutral: null,
  info: icons.info,
  success: icons['check-circle'],
  warning: icons['alert-triangle'],
  danger: icons['alert-circle'],
} as const;

const MAX_TOASTS = 5;
const EXIT_MS = 200;
let nextId = 1;

/**
 * The region that shows toasts. You rarely need to add it yourself: `toast()`
 * creates one on first use. Add it to choose a placement, or to hold
 * toasts in a specific place in the DOM.
 *
 * @summary Shows short, temporary notifications.
 * @tag uf-toaster
 *
 * @csspart region - The list holding the toasts.
 * @csspart toast - Each toast.
 * @csspart title - A toast's title.
 * @csspart message - A toast's message.
 * @csspart close-button - A toast's dismiss button.
 *
 * @cssprop --uf-toast-width - Width of each toast.
 * @cssprop --uf-toaster-offset - Distance from the viewport edges.
 */
export class UfToaster extends LitElement {
  static override styles = css`
    :host {
      --_offset: var(--uf-toaster-offset, var(--uf-space-4));
      position: fixed;
      inset: auto;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      overflow: visible;
      width: min(var(--uf-toast-width, 22rem), calc(100vw - 2 * var(--_offset)));
      font-family: var(--uf-font-family-sans);
    }

    :host([placement^='top']) {
      top: var(--_offset);
    }
    :host([placement^='bottom']) {
      bottom: var(--_offset);
    }
    :host([placement$='start']) {
      left: var(--_offset);
    }
    :host([placement$='end']) {
      right: var(--_offset);
    }
    :host([placement$='center']) {
      left: 50%;
      translate: -50% 0;
    }

    ol {
      display: flex;
      flex-direction: column;
      gap: var(--uf-space-2);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    :host([placement^='bottom']) ol {
      flex-direction: column-reverse;
    }

    .toast {
      --_bg: var(--uf-color-toast-neutral-bg);
      --_border: var(--uf-color-toast-neutral-border);
      --_text: var(--uf-color-toast-neutral-text);
      display: flex;
      align-items: flex-start;
      gap: var(--uf-space-3);
      padding: var(--uf-space-3) var(--uf-space-3) var(--uf-space-3) var(--uf-space-4);
      border: 1px solid var(--_border);
      border-radius: var(--uf-radius-md);
      background: var(--_bg);
      color: var(--_text);
      font-size: var(--uf-font-size-md);
      line-height: 1.45;
      box-shadow: var(--uf-shadow-md);
      animation: enter var(--uf-duration-base) ease;
    }

    .toast.leaving {
      opacity: 0;
      translate: 0 0.25rem;
      transition:
        opacity ${EXIT_MS}ms ease,
        translate ${EXIT_MS}ms ease;
    }

    .info {
      --_bg: var(--uf-color-toast-info-bg);
      --_border: var(--uf-color-toast-info-border);
      --_text: var(--uf-color-toast-info-text);
    }
    .success {
      --_bg: var(--uf-color-toast-success-bg);
      --_border: var(--uf-color-toast-success-border);
      --_text: var(--uf-color-toast-success-text);
    }
    .warning {
      --_bg: var(--uf-color-toast-warning-bg);
      --_border: var(--uf-color-toast-warning-border);
      --_text: var(--uf-color-toast-warning-text);
    }
    .danger {
      --_bg: var(--uf-color-toast-danger-bg);
      --_border: var(--uf-color-toast-danger-border);
      --_text: var(--uf-color-toast-danger-text);
    }

    .icon {
      flex: none;
      width: 1.125rem;
      height: 1.125rem;
      margin-top: 0.1em;
      color: currentColor;
    }

    .content {
      flex: 1;
      min-width: 0;
      padding-block: 0.0625rem;
    }

    .title {
      display: block;
      font-weight: var(--uf-font-weight-semibold);
    }

    .title + .message {
      margin-top: 0.125rem;
    }


    .close {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      margin: -0.125rem -0.25rem 0 0;
      padding: 0;
      border: 0;
      border-radius: var(--uf-radius-sm);
      background: transparent;
      color: inherit;
      opacity: 0.8;
      cursor: pointer;
    }

    .close:hover {
      background: color-mix(in srgb, currentColor 16%, transparent);
      opacity: 1;
    }

    .close:focus-visible {
      outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
      outline-offset: 0;
    }

    .close .icon {
      width: 1rem;
      height: 1rem;
      margin: 0;
      color: inherit;
    }

    @keyframes enter {
      from {
        opacity: 0;
        translate: 0 0.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: none;
      }
      .toast.leaving {
        transition: none;
      }
    }
  `;

  static override properties: PropertyDeclarations = {
    placement: { reflect: true },
    label: {},
  };

  /** Corner or edge of the viewport where toasts appear. */
  declare placement: ToasterPlacement;
  /** Accessible name of the notification region. Defaults to "Notifications", or its translation. */
  declare label: string | undefined;

  #items: ToastItem[] = [];
  readonly #translator = new Translator(this);
  readonly #timers = new Map<number, Timer>();

  constructor() {
    super();
    this.placement = 'bottom-end';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // The host itself is a manual popover, so toasts render in the top layer.
    this.popover = 'manual';
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const timer of this.#timers.values()) clearTimeout(timer.handle);
    this.#timers.clear();
  }

  /** Shows a toast in this region. Prefer the `toast()` function. */
  add(message: string, options: ToastOptions = {}): ToastHandle {
    const item: ToastItem = {
      id: nextId++,
      message,
      title: options.title,
      variant: options.variant ?? 'neutral',
      duration: options.duration ?? 5000,
      closable: options.closable ?? true,
      leaving: false,
    };
    this.#items = [...this.#items, item];
    const overflow = this.#items.filter((i) => !i.leaving).length - MAX_TOASTS;
    if (overflow > 0) this.#items.filter((i) => !i.leaving).slice(0, overflow).forEach((i) => this.dismiss(i.id));

    this.#bringToFront();
    if (item.duration > 0) this.#startTimer(item.id, item.duration);
    this.requestUpdate();
    return { dismiss: () => this.dismiss(item.id) };
  }

  /** Hides a toast by id. */
  dismiss(id: number): void {
    const item = this.#items.find((i) => i.id === id);
    if (!item || item.leaving) return;
    clearTimeout(this.#timers.get(id)?.handle);
    this.#timers.delete(id);
    item.leaving = true;
    this.requestUpdate();

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      this.#items = this.#items.filter((i) => i.id !== id);
      if (!this.#items.length && this.matches(':popover-open')) this.hidePopover();
      this.requestUpdate();
    }, reduced ? 0 : EXIT_MS);
  }

  /** Re-shows the popover, so toasts appear above a dialog opened after the last one. */
  #bringToFront(): void {
    if (this.matches(':popover-open')) this.hidePopover();
    this.showPopover();
  }

  #startTimer(id: number, ms: number): void {
    this.#timers.set(id, { handle: window.setTimeout(() => this.dismiss(id), ms), started: Date.now(), remaining: ms });
  }

  #pause(id: number): void {
    const timer = this.#timers.get(id);
    if (!timer) return;
    clearTimeout(timer.handle);
    timer.remaining -= Date.now() - timer.started;
  }

  #resume(id: number): void {
    const timer = this.#timers.get(id);
    if (timer) this.#startTimer(id, Math.max(timer.remaining, 1000));
  }

  #renderToast(item: ToastItem) {
    const icon = variantIcons[item.variant];
    return html`
      <li
        class=${classMap({ toast: true, [item.variant]: true, leaving: item.leaving })}
        part="toast"
        role=${item.variant === 'danger' ? 'alert' : nothing}
        @pointerenter=${() => this.#pause(item.id)}
        @pointerleave=${() => this.#resume(item.id)}
        @focusin=${() => this.#pause(item.id)}
        @focusout=${() => this.#resume(item.id)}
      >
        ${icon ? iconSvg(icon) : nothing}
        <div class="content">
          ${item.title ? html`<strong class="title" part="title">${item.title}</strong>` : nothing}
          <div class="message" part="message">${item.message}</div>
        </div>
        ${item.closable
          ? html`<button class="close" part="close-button" type="button" aria-label=${this.#translator.t('dismiss')} @click=${() => this.dismiss(item.id)}>
              ${iconSvg(icons.x)}
            </button>`
          : nothing}
      </li>
    `;
  }

  override render() {
    return html`
      <section aria-label=${this.label ?? this.#translator.t('notifications')}>
        <ol part="region" aria-live="polite" aria-relevant="additions">
          ${repeat(this.#items, (item) => item.id, (item) => this.#renderToast(item))}
        </ol>
      </section>
    `;
  }
}

defineElement('uf-toaster', UfToaster);

/**
 * Shows a toast. Creates a `<uf-toaster>` on first use. Does nothing on the
 * server, when rendering with SSR.
 *
 * @example toast('Saved', { variant: 'success' })
 */
export function toast(message: string, options?: ToastOptions): ToastHandle {
  // On the server (SSR) there is no page to show it on: do nothing.
  if (typeof document === 'undefined') return { dismiss() {} };
  let toaster = document.querySelector('uf-toaster');
  if (toaster) return toaster.add(message, options);

  // A live region must exist before content is added to it, or screen readers
  // may skip the first message. Create it now and add the toast a moment later.
  toaster = document.body.appendChild(document.createElement('uf-toaster'));
  let handle: ToastHandle | undefined;
  let dismissed = false;
  setTimeout(() => {
    if (!dismissed) handle = toaster.add(message, options);
  }, 100);
  return {
    dismiss() {
      dismissed = true;
      handle?.dismiss();
    },
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'uf-toaster': UfToaster;
  }
}
