import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController } from '../../internal/slot.js';

export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * A line between groups of content, across or beside them. Assistive tech
 * announces it as a separator. With a label ("or"), the label is read as plain
 * text and the line around it is decorative.
 *
 * @summary Separates groups of content with a line.
 * @tag uf-divider
 *
 * @slot - An optional label in the middle of the line, like "or".
 *
 * @csspart base - The line, or the wrapper around a labelled one.
 * @csspart label - The label.
 *
 * @cssprop --uf-divider-color - Color of the line.
 * @cssprop --uf-divider-width - Thickness of the line.
 * @cssprop --uf-divider-spacing - Space before and after the line.
 */
export class UfDivider extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        --_color: var(--uf-divider-color, var(--uf-color-border));
        --_width: var(--uf-divider-width, 1px);
        --_spacing: var(--uf-divider-spacing, var(--uf-space-4));
        display: block;
        margin-block: var(--_spacing);
      }

      :host([orientation='vertical']) {
        display: inline-flex;
        align-self: stretch;
        min-height: 1em;
        margin-block: 0;
        margin-inline: var(--_spacing);
        vertical-align: middle;
      }

      .base {
        display: flex;
        align-items: center;
        gap: var(--uf-space-3);
        height: 100%;
        color: var(--uf-color-text-muted);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-sm);
      }

      :host([orientation='vertical']) .base {
        flex-direction: column;
      }

      .line {
        flex: 1;
        border-top: var(--_width) solid var(--_color);
      }

      :host([orientation='vertical']) .line {
        border-top: 0;
        border-inline-start: var(--_width) solid var(--_color);
      }

      .label {
        flex: none;
      }

      [hidden] {
        display: none !important;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    orientation: { reflect: true },
  };

  /** `horizontal` (across the content) or `vertical` (between items in a row). */
  declare orientation: DividerOrientation;

  constructor() {
    super();
    this.orientation = 'horizontal';
    // Re-renders when a label is added or removed.
    new HasSlotController(this, '');
  }

  override render() {
    // A separator's content isn't read, so a labelled divider is plain text between two decorative lines.
    const labelled = [...this.childNodes].some((n) => (n.nodeType === Node.ELEMENT_NODE ? !(n as Element).slot : n.textContent?.trim()));
    return labelled
      ? html`<div class="base" part="base">
          <span class="line" aria-hidden="true"></span>
          <span class="label" part="label"><slot></slot></span>
          <span class="line" aria-hidden="true"></span>
        </div>`
      : html`<div class="base" part="base" role="separator" aria-orientation=${this.orientation}>
          <span class="line"></span>
          <slot hidden></slot>
        </div>`;
  }
}

defineElement('uf-divider', UfDivider);

declare global {
  interface HTMLElementTagNameMap {
    'uf-divider': UfDivider;
  }
}
