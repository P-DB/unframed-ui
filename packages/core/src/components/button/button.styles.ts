import { css } from 'lit';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';

export const buttonStyles = [
  hostStyles,
  css`
    :host {
      display: inline-block;
      --_height: var(--uf-size-control-md);
      --_padding: var(--uf-space-4);
      --_font-size: var(--uf-font-size-md);
      --_bg: var(--uf-color-accent);
      --_bg-hover: var(--uf-color-accent-hover);
      --_bg-active: var(--uf-color-accent-active);
      --_fg: var(--uf-color-on-accent);
      --_border: transparent;
    }

    :host([size='sm']) {
      --_height: var(--uf-size-control-sm);
      --_padding: var(--uf-space-3);
      --_font-size: var(--uf-font-size-sm);
    }

    :host([size='lg']) {
      --_height: var(--uf-size-control-lg);
      --_padding: var(--uf-space-5);
      --_font-size: var(--uf-font-size-lg);
    }

    /* Grey at rest, so it never looks like a faded (disabled) primary; accent tint on hover, like outline and ghost. */
    :host([variant='secondary']) {
      --_bg: var(--uf-color-neutral-fill);
      --_bg-hover: var(--uf-color-accent-tint);
      --_bg-active: var(--uf-color-accent-tint-hover);
      --_fg: var(--uf-color-text);
      --_fg-hover: var(--uf-color-on-accent-tint);
    }

    :host([variant='outline']) {
      --_bg: transparent;
      --_bg-hover: var(--uf-color-accent-tint);
      --_bg-active: var(--uf-color-accent-tint-hover);
      --_fg: var(--uf-color-on-accent-tint);
      --_border: var(--uf-color-accent-strong);
    }

    :host([variant='ghost']) {
      --_bg: transparent;
      --_bg-hover: var(--uf-color-accent-tint);
      --_bg-active: var(--uf-color-accent-tint-hover);
      --_fg: var(--uf-color-text);
      --_fg-hover: var(--uf-color-on-accent-tint);
    }

    :host([variant='danger']) {
      --_bg: var(--uf-color-danger);
      --_bg-hover: var(--uf-color-danger-hover);
      --_bg-active: var(--uf-color-danger-hover);
      --_fg: var(--uf-color-on-danger);
    }

    /* Looks like a text link: no fill, no side padding (lines up with text), underline on hover.
       After the size rules, so its padding wins. */
    :host([variant='link']) {
      --_bg: transparent;
      --_bg-hover: transparent;
      --_bg-active: transparent;
      --_fg: var(--uf-color-accent-strong);
      --_padding: 0;
    }

    :host([variant='link']) .base:hover:not(.disabled),
    :host([variant='link']) .base:focus-visible {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }

    .base {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--uf-button-gap, var(--uf-space-2));
      width: 100%;
      height: var(--uf-button-height, var(--_height));
      padding: 0 var(--uf-button-padding, var(--_padding));
      border: 1px solid var(--uf-button-border-color, var(--_border));
      border-radius: var(--uf-button-radius, var(--uf-radius-control));
      background: var(--uf-button-bg, var(--_bg));
      color: var(--uf-button-color, var(--_fg));
      font-family: var(--uf-button-font-family, var(--uf-font-family-sans));
      font-size: var(--_font-size);
      font-weight: var(--uf-button-font-weight, var(--uf-font-weight-medium));
      line-height: 1;
      white-space: nowrap;
      text-decoration: none;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition:
        background-color var(--uf-duration-fast) ease,
        border-color var(--uf-duration-fast) ease,
        color var(--uf-duration-fast) ease;
    }

    /* Icon-only: no empty label (its gaps pushed the icon off-center), and square. */
    .base.icon-only {
      width: var(--uf-button-height, var(--_height));
      padding: 0;
    }

    .base.icon-only .label {
      display: none;
    }

    /* No hover or pressed look on a disabled (or loading) button: it can't be used. */
    .base:hover:not(.disabled, .loading) {
      background: var(--uf-button-bg-hover, var(--_bg-hover));
      color: var(--uf-button-color, var(--_fg-hover, var(--_fg)));
    }

    .base:active:not(.disabled, .loading) {
      background: var(--uf-button-bg-active, var(--_bg-active));
    }

    .base:focus-visible {
      ${focusRing}
    }

    .base.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .base.loading {
      cursor: progress;
    }

    /* opacity, not visibility, so the label stays in the accessibility tree. */
    .base.loading .label,
    .base.loading ::slotted(*) {
      opacity: 0;
    }

    ::slotted(svg) {
      width: 1em;
      height: 1em;
      flex: none;
    }

    .spinner {
      position: absolute;
      inset: 0;
      margin: auto;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 1.5s;
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
];
