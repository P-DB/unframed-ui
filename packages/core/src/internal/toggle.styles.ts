import { css } from 'lit';

/** Layout shared by checkbox, switch and radio: control, label, hint and error. */
export const toggleStyles = css`
  :host {
    display: block;
    font-family: var(--uf-font-family-sans);
    font-size: var(--uf-font-size-md);
    color: var(--uf-color-text);
  }

  :host([size='sm']) {
    font-size: var(--uf-font-size-sm);
  }

  :host([size='lg']) {
    font-size: var(--uf-font-size-lg);
  }

  .root {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--uf-space-2);
    cursor: pointer;
    line-height: 1.4;
  }

  /* Grey instead of faded, like disabled fields. */
  .root.disabled {
    color: var(--uf-color-text-muted);
    cursor: not-allowed;
  }

  .control {
    position: relative;
    display: inline-flex;
    flex: none;
    /* Vertically centers the control on the first line of the label. */
    margin-top: calc((1.4em - var(--_control-height)) / 2);
  }

  .native {
    appearance: none;
    margin: 0;
    cursor: inherit;
    transition:
      background-color var(--uf-duration-fast) ease,
      border-color var(--uf-duration-fast) ease;
  }

  .native:focus-visible {
    outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
    outline-offset: var(--uf-focus-ring-offset);
  }

  .hint,
  .error {
    margin: var(--uf-space-1) 0 0 calc(var(--_control-width) + var(--uf-space-2));
    font-size: var(--uf-font-size-sm);
    line-height: 1.4;
  }

  .hint {
    color: var(--uf-color-text-muted);
  }

  .error {
    color: var(--uf-color-danger-text);
  }

  [hidden] {
    display: none !important;
  }
`;
