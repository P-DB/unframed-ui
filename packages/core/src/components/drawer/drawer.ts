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
 * @cssprop --uf-drawer-gap - Space between the drawer and the screen's edges. `0` puts it against the edge. Defaults to `--uf-space-3`.
 * @cssprop --uf-drawer-radius - Corner radius.
 * @cssprop --uf-dialog-bg - Background of the drawer.
 * @cssprop --uf-dialog-padding - Padding of header, body and footer.
 * @cssprop --uf-dialog-backdrop - Backdrop color.
 */
export class UfDrawer extends UfDialog {
  static override styles = [
    ...UfDialog.styles,
    css`
      /*
       * A panel floating a gap away from the screen's edges, on top of the page.
       * With --uf-drawer-gap: 0 it sits against the edge, like a classic drawer.
       */
      dialog {
        --_gap: var(--uf-drawer-gap, var(--uf-space-3));
        --_size: min(var(--uf-drawer-size, 24rem), 100vw - 2 * var(--_gap));
        --_from: calc(100% + var(--_gap)) 0;
        position: fixed;
        inset: var(--_gap) var(--_gap) var(--_gap) auto;
        width: var(--_size);
        max-width: none;
        height: calc(100dvh - 2 * var(--_gap));
        max-height: none;
        margin: 0;
        border-radius: var(--uf-drawer-radius, var(--uf-radius-md));
        /* Even on every side: the dialog's shadow falls downward, too far below a top drawer and off screen for a bottom one. */
        box-shadow: var(--uf-shadow-drawer);
      }

      /* Right-to-left pages: start is on the right, end on the left. */
      :host([placement='start']) dialog,
      :host(:dir(rtl):not([placement='start'])) dialog {
        --_from: calc(-100% - var(--_gap)) 0;
        inset: var(--_gap) auto var(--_gap) var(--_gap);
      }

      :host(:dir(rtl)[placement='start']) dialog {
        --_from: calc(100% + var(--_gap)) 0;
        inset: var(--_gap) var(--_gap) var(--_gap) auto;
      }

      :host([placement='top']) dialog,
      :host([placement='bottom']) dialog {
        --_size: min(var(--uf-drawer-size, 24rem), 100dvh - 2 * var(--_gap));
        width: calc(100vw - 2 * var(--_gap));
        height: var(--_size);
      }

      :host([placement='top']) dialog {
        --_from: 0 calc(-100% - var(--_gap));
        inset: var(--_gap) var(--_gap) auto;
      }

      :host([placement='bottom']) dialog {
        --_from: 0 calc(100% + var(--_gap));
        inset: auto var(--_gap) var(--_gap);
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
