import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';

/**
 * A tab inside `<uf-tabs>`. Its `panel` names the `<uf-tab-panel>` it shows.
 *
 * @summary A tab in a tab list.
 * @tag uf-tab
 *
 * @slot - The tab label.
 *
 * @csspart base - The tab's inner wrapper.
 *
 * @cssstate active - The tab is selected.
 */
export class UfTab extends LitElement {
  static override styles = css`
    :host {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: var(--uf-space-2);
      padding: var(--uf-space-2) var(--uf-space-3);
      color: var(--uf-color-text-muted);
      font-family: var(--uf-font-family-sans);
      font-size: var(--uf-font-size-md);
      font-weight: var(--uf-font-weight-medium);
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      outline: none;
      border-radius: var(--uf-radius-sm);
      transition: color var(--uf-duration-fast) ease;
    }

    :host(:hover:not([disabled])) {
      color: var(--uf-color-text);
    }

    :host([aria-selected='true']) {
      color: var(--uf-color-text);
    }

    :host::after {
      content: '';
      position: absolute;
      inset: auto 0 -1px 0;
      height: 2px;
      border-radius: 2px;
      background: var(--uf-tabs-indicator-color, var(--uf-color-accent-strong));
      scale: 0 1;
      transition: scale var(--uf-duration-base) ease;
    }

    :host([aria-selected='true'])::after {
      scale: 1 1;
    }

    :host(:focus-visible) {
      outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
      outline-offset: calc(var(--uf-focus-ring-width) * -1);
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      :host::after {
        transition: none;
      }
    }
  `;

  static override properties: PropertyDeclarations = {
    panel: { reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  /** Name of the `<uf-tab-panel>` this tab shows. */
  declare panel: string;
  /** Disables the tab. */
  declare disabled: boolean;

  constructor() {
    super();
    this.panel = '';
    this.disabled = false;
  }

  override render() {
    return html`<slot part="base"></slot>`;
  }
}

/**
 * The content shown when its tab is selected.
 *
 * @summary A panel of content inside `<uf-tabs>`.
 * @tag uf-tab-panel
 *
 * @slot - The panel content.
 *
 * @cssprop --uf-tab-panel-padding - Padding around the content.
 */
export class UfTabPanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: var(--uf-tab-panel-padding, var(--uf-space-4) 0);
      outline: none;
    }

    :host([hidden]) {
      display: none;
    }

    :host(:focus-visible) {
      outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
      outline-offset: var(--uf-focus-ring-offset);
      border-radius: var(--uf-radius-sm);
    }
  `;

  static override properties: PropertyDeclarations = {
    name: { reflect: true },
  };

  /** Name the matching tab refers to with `panel`. */
  declare name: string;

  constructor() {
    super();
    this.name = '';
  }

  override render() {
    return html`<slot></slot>`;
  }
}

defineElement('uf-tab', UfTab);
defineElement('uf-tab-panel', UfTabPanel);

declare global {
  interface HTMLElementTagNameMap {
    'uf-tab': UfTab;
    'uf-tab-panel': UfTabPanel;
  }
}
