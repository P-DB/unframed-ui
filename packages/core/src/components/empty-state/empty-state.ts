import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController } from '../../internal/slot.js';
import '../icon/icon.js';

/**
 * What to show where content would be: an empty list, no search results, a
 * first visit. An icon, a heading, a short explanation and what to do next.
 *
 * The `heading` attribute is bold text. For a real heading in the page's
 * outline, put an `<h2>` or `<h3>` in the `heading` slot.
 *
 * @summary Fills an empty list or page with a message and what to do next.
 * @tag uf-empty-state
 *
 * @slot - The explanation.
 * @slot heading - The heading, when you need markup or a heading level. Overrides `heading`.
 * @slot icon - Replaces the icon.
 * @slot actions - Buttons or links, like "Create a project".
 *
 * @csspart base - The empty state.
 * @csspart icon - The icon.
 * @csspart heading - The heading.
 * @csspart description - The explanation.
 * @csspart actions - The wrapper around the actions.
 *
 * @cssprop --uf-empty-state-icon-size - Size of the icon.
 * @cssprop --uf-empty-state-icon-color - Color of the icon.
 * @cssprop --uf-empty-state-padding - Space around the content.
 */
export class UfEmptyState extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
      }

      .base {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--uf-space-2);
        max-width: 28rem;
        margin-inline: auto;
        padding: var(--uf-empty-state-padding, var(--uf-space-6) var(--uf-space-4));
        color: var(--uf-color-text-muted);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        line-height: 1.5;
        text-align: center;
      }

      .icon {
        display: inline-flex;
        margin-bottom: var(--uf-space-2);
        color: var(--uf-empty-state-icon-color, var(--uf-color-accent));
        font-size: var(--uf-empty-state-icon-size, 2.5rem);
      }

      .icon uf-icon,
      ::slotted([slot='icon']) {
        --uf-icon-size: 1em;
        width: 1em;
        height: 1em;
      }

      .heading {
        color: var(--uf-color-text);
        font-size: var(--uf-font-size-lg);
        font-weight: var(--uf-font-weight-semibold);
      }

      /* A heading element in the slot: the same look, without its default margins. */
      ::slotted([slot='heading']) {
        margin: 0;
        font: inherit;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--uf-space-2);
        margin-top: var(--uf-space-3);
      }

      [hidden] {
        display: none !important;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    heading: {},
    icon: {},
  };

  /** Bold text above the explanation. */
  declare heading: string | undefined;
  /** A built-in or registered icon name. An empty string hides the icon. */
  declare icon: string;

  readonly #slots = new HasSlotController(this, 'heading', 'icon', 'actions');

  constructor() {
    super();
    this.icon = 'inbox';
  }

  override render() {
    const hasIcon = Boolean(this.icon) || this.#slots.has('icon');
    const hasHeading = Boolean(this.heading) || this.#slots.has('heading');
    return html`
      <div class="base" part="base">
        <span class="icon" part="icon" aria-hidden="true" ?hidden=${!hasIcon}>
          <slot name="icon">${this.icon ? html`<uf-icon name=${this.icon}></uf-icon>` : nothing}</slot>
        </span>
        <div class="heading" part="heading" ?hidden=${!hasHeading}><slot name="heading">${this.heading ?? nothing}</slot></div>
        <div class="description" part="description"><slot></slot></div>
        <div class="actions" part="actions" ?hidden=${!this.#slots.has('actions')}><slot name="actions"></slot></div>
      </div>
    `;
  }
}

defineElement('uf-empty-state', UfEmptyState);

declare global {
  interface HTMLElementTagNameMap {
    'uf-empty-state': UfEmptyState;
  }
}
