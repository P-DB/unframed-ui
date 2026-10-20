import { css, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { UfDialog } from '../dialog/dialog.js';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';

/**
 * A panel that slides in from an edge of the screen, for navigation, filters or
 * details. It is a modal dialog, so it behaves like `<uf-dialog>`: it traps
 * focus, makes the page inert, closes with Escape, and returns focus to the
 * opener. Any element inside with `data-dialog="close"` closes it.
 *
 * @summary A panel that slides in from an edge of the screen.
 * @tag uf-drawer
 *
 * @slot - The drawer content.
 * @slot label - The title, when you need markup. Overrides `label`.
 * @slot header-actions - Extra buttons next to the close button.
 * @slot footer - Actions at the bottom, usually buttons.
 *
 * @event uf-show - The drawer opened.
 * @event uf-hide - The drawer closed.
 * @event {CustomEvent<DialogRequestCloseDetail>} uf-request-close - The user tried to close the drawer. Call `preventDefault()` to keep it open.
 *
 * @csspart dialog - The native `<dialog>`.
 * @csspart header - The header with title and close button.
 * @csspart title - The title.
 * @csspart close-button - The close button.
 * @csspart body - The content area.
 * @csspart footer - The footer.
 *
 * @cssprop --uf-drawer-size - Width of a side drawer, or height of a top or bottom one. Defaults to `24rem`.
 * @cssprop --uf-dialog-bg - Background of the drawer.
 * @cssprop --uf-dialog-padding - Padding of header, body and footer.
 * @cssprop --uf-dialog-backdrop - Backdrop color.
 */
export class UfDrawer extends UfDialog {
  static override styles = [
    ...UfDialog.styles,
    css`
      dialog {
        --_size: min(var(--uf-drawer-size, 24rem), 100vw);
        --_from: 100% 0;
        position: fixed;
        inset: 0 0 0 auto;
        width: var(--_size);
        max-width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        margin: 0;
        border-width: 0 0 0 1px;
        border-radius: 0;
      }

      :host([placement='start']) dialog {
        --_from: -100% 0;
        inset: 0 auto 0 0;
        border-width: 0 1px 0 0;
      }

      /* Right-to-left pages: start is on the right, end on the left. */
      :host(:dir(rtl)) dialog {
        --_from: -100% 0;
        inset: 0 auto 0 0;
        border-width: 0 1px 0 0;
      }

      :host(:dir(rtl)[placement='start']) dialog {
        --_from: 100% 0;
        inset: 0 0 0 auto;
        border-width: 0 0 0 1px;
      }

      :host([placement='top']) dialog,
      :host([placement='bottom']) dialog {
        --_size: min(var(--uf-drawer-size, 24rem), 100dvh);
        width: 100vw;
        height: var(--_size);
      }

      :host([placement='top']) dialog {
        --_from: 0 -100%;
        inset: 0 0 auto 0;
        border-width: 0 0 1px 0;
      }

      :host([placement='bottom']) dialog {
        --_from: 0 100%;
        inset: auto 0 0 0;
        border-width: 1px 0 0 0;
      }

      dialog[open] {
        animation-name: uf-drawer-in;
      }

      dialog.closing {
        animation-name: uf-drawer-out;
      }

      @keyframes uf-drawer-in {
        from {
          translate: var(--_from);
        }
      }

      @keyframes uf-drawer-out {
        to {
          translate: var(--_from);
        }
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    placement: { reflect: true },
  };

  /** The edge it slides in from: `start` (left, in left-to-right pages), `end`, `top` or `bottom`. */
  declare placement: DrawerPlacement;

  constructor() {
    super();
    this.placement = 'end';
  }
}

defineElement('uf-drawer', UfDrawer);

declare global {
  interface HTMLElementTagNameMap {
    'uf-drawer': UfDrawer;
  }
}
