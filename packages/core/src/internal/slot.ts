import type { ReactiveController, ReactiveControllerHost } from 'lit';

/** Re-renders the host when the content of the given named slots changes. */
export class HasSlotController implements ReactiveController {
  readonly #host: ReactiveControllerHost & HTMLElement;
  readonly #names: string[];

  constructor(host: ReactiveControllerHost & HTMLElement, ...names: string[]) {
    this.#host = host;
    this.#names = names;
    host.addController(this);
  }

  /** True when a direct child is assigned to the named slot. */
  has(name: string): boolean {
    return [...this.#host.children].some((child) => child.getAttribute('slot') === name);
  }

  hostConnected(): void {
    this.#host.shadowRoot?.addEventListener('slotchange', this.#onSlotChange);
  }

  hostDisconnected(): void {
    this.#host.shadowRoot?.removeEventListener('slotchange', this.#onSlotChange);
  }

  #onSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    if (this.#names.includes(slot.name)) this.#host.requestUpdate();
  };
}

let counter = 0;

/** A document-unique id, for ARIA references within one tree. */
export function uniqueId(prefix = 'uf'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
