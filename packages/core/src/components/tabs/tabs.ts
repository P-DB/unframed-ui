import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { uniqueId } from '../../internal/slot.js';
import './tab.js';
import type { UfTab, UfTabPanel } from './tab.js';

export { UfTab, UfTabPanel } from './tab.js';

export interface TabChangeDetail {
  name: string;
}

/**
 * Tabs that switch between panels. Arrow keys move between tabs, Home and End
 * jump to the ends, and only the selected tab is in the tab order.
 *
 * @summary Organizes content into panels, one visible at a time.
 * @tag uf-tabs
 *
 * @slot - `<uf-tab>` and `<uf-tab-panel>` elements. Tabs are moved into the tab list automatically.
 * @slot nav - The tab list. You don't need to set this yourself.
 *
 * @event {CustomEvent<TabChangeDetail>} uf-tab-change - The selected tab changed.
 *
 * @csspart tablist - The element with `role="tablist"`.
 * @csspart panels - The wrapper around the panels.
 *
 * @cssprop --uf-tabs-indicator-color - Color of the selected tab's underline.
 */
export class UfTabs extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .tablist {
      display: flex;
      gap: var(--uf-space-1);
      border-bottom: 1px solid var(--uf-color-border);
      overflow-x: auto;
      scrollbar-width: none;
    }

    :host([orientation='vertical']) {
      display: flex;
      gap: var(--uf-space-4);
    }

    :host([orientation='vertical']) .tablist {
      flex-direction: column;
      border-bottom: 0;
      border-inline-end: 1px solid var(--uf-color-border);
      overflow: visible;
    }

    .panels {
      flex: 1;
      min-width: 0;
    }
  `;

  static override properties: PropertyDeclarations = {
    active: { reflect: true },
    activation: { reflect: true },
    orientation: { reflect: true },
    label: {},
  };

  /** Name of the selected panel. Defaults to the first enabled tab. */
  declare active: string;
  /** `auto` selects a tab as soon as it gets focus; `manual` waits for Enter or Space. */
  declare activation: 'auto' | 'manual';
  /** Lays the tab list out horizontally or vertically. */
  declare orientation: 'horizontal' | 'vertical';
  /** Accessible name for the tab list. */
  declare label: string | undefined;

  readonly #id = uniqueId('uf-tabs');

  constructor() {
    super();
    this.active = '';
    this.activation = 'auto';
    this.orientation = 'horizontal';
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKeyDown);
  }

  get #tabs(): UfTab[] {
    return [...this.querySelectorAll<UfTab>(':scope > uf-tab')];
  }

  get #panels(): UfTabPanel[] {
    return [...this.querySelectorAll<UfTabPanel>(':scope > uf-tab-panel')];
  }

  /** Selects the tab for the given panel name. */
  select(name: string): void {
    const tab = this.#tabs.find((t) => t.panel === name);
    if (tab && !tab.disabled) this.#activate(tab);
  }

  override updated(): void {
    this.#sync();
  }

  /** Wires up roles, ids and visibility on the light-DOM tabs and panels. */
  #sync(): void {
    const tabs = this.#tabs;
    const panels = this.#panels;
    const enabled = tabs.filter((t) => !t.disabled);
    const activeTab = enabled.find((t) => t.panel === this.active) ?? enabled[0];
    if (activeTab && this.active !== activeTab.panel) this.active = activeTab.panel;

    tabs.forEach((tab, i) => {
      tab.slot = 'nav';
      tab.id ||= `${this.#id}-tab-${i}`;
      const panel = panels.find((p) => p.name === tab.panel);
      const selected = tab === activeTab;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('aria-disabled', String(tab.disabled));
      tab.tabIndex = selected ? 0 : -1;
      if (panel) {
        panel.id ||= `${this.#id}-panel-${i}`;
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', tab.id);
      }
    });

    for (const panel of panels) {
      panel.setAttribute('role', 'tabpanel');
      panel.tabIndex = 0;
      panel.hidden = panel.name !== activeTab?.panel;
    }
  }

  #activate(tab: UfTab): void {
    tab.focus();
    if (tab.panel === this.active) return;
    this.active = tab.panel;
    this.dispatchEvent(
      new CustomEvent<TabChangeDetail>('uf-tab-change', {
        bubbles: true,
        composed: true,
        detail: { name: tab.panel },
      }),
    );
  }

  #onClick = (event: MouseEvent): void => {
    const tab = (event.target as Element).closest('uf-tab');
    if (tab?.parentElement === this && !tab.disabled) this.#activate(tab);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const current = (event.target as Element).closest('uf-tab');
    if (!current || current.parentElement !== this) return;

    const tabs = this.#tabs.filter((t) => !t.disabled);
    const index = tabs.indexOf(current);
    const vertical = this.orientation === 'vertical';
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';

    let target: UfTab | undefined;
    if (event.key === next) target = tabs[(index + 1) % tabs.length];
    else if (event.key === prev) target = tabs[(index - 1 + tabs.length) % tabs.length];
    else if (event.key === 'Home') target = tabs[0];
    else if (event.key === 'End') target = tabs[tabs.length - 1];
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#activate(current);
      return;
    }
    if (!target) return;

    event.preventDefault();
    if (this.activation === 'auto') this.#activate(target);
    else target.focus();
  };

  override render() {
    return html`
      <div
        class="tablist"
        part="tablist"
        role="tablist"
        aria-label=${ifDefined(this.label)}
        aria-orientation=${this.orientation}
      >
        <slot name="nav" @slotchange=${() => this.#sync()}></slot>
      </div>
      <div class="panels" part="panels">
        <slot @slotchange=${() => this.#sync()}></slot>
      </div>
    `;
  }
}

defineElement('uf-tabs', UfTabs);

declare global {
  interface HTMLElementTagNameMap {
    'uf-tabs': UfTabs;
  }
}
