import { css } from 'lit';

/** Base styles every component includes. */
export const hostStyles = css`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  :host([hidden]) {
    display: none !important;
  }
`;

/** Shared keyboard focus ring, driven by the focus tokens. */
export const focusRing = css`
  outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
  outline-offset: var(--uf-focus-ring-offset);
`;
