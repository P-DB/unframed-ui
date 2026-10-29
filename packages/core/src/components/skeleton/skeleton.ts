import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { hostStyles } from '../../internal/shared.styles.js';

export type SkeletonShape = 'text' | 'rect' | 'circle';

/**
 * A grey placeholder in the shape of content that's still loading: lines of
 * text, a block or a circle. It's decorative, hidden from assistive tech: mark
 * the region that's loading with `aria-busy="true"`, and announce the result
 * when it arrives.
 *
 * Size it with `width` and `height` in CSS; `text` lines take the height of a
 * line of text, and `circle` stays round.
 *
 * @summary Holds the place of content while it loads.
 * @tag uf-skeleton
 *
 * @csspart base - The placeholder, or the wrapper around its lines.
 * @csspart line - One line of a `text` placeholder.
 *
 * @cssprop --uf-skeleton-color - Background of the placeholder.
 * @cssprop --uf-skeleton-highlight - Color of the shimmer that sweeps across it.
 * @cssprop --uf-skeleton-radius - Corner radius of `text` and `rect` placeholders.
 */
export class UfSkeleton extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        --_color: var(--uf-skeleton-color, var(--uf-color-surface-hover));
        /* Toward the text color: lighter in dark mode, darker in light, clearly visible in both. */
        --_highlight: var(--uf-skeleton-highlight, color-mix(in srgb, var(--_color), var(--uf-color-text) 8%));
        display: block;
      }

      :host([shape='rect']) {
        height: 6rem;
      }

      :host([shape='circle']) {
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        vertical-align: middle;
      }

      .base {
        display: grid;
        gap: 0.5em;
        height: 100%;
      }

      .block,
      .line {
        border-radius: var(--uf-skeleton-radius, var(--uf-radius-sm));
        /*
         * Three times as wide as the placeholder: the outer thirds are plain, so the
         * loop starts and ends on the plain color and the highlight sweeps through the middle.
         */
        background: linear-gradient(
            /* A slanted band, sweeping from left to right. */
            110deg,
            var(--_color) 0%,
            var(--_color) 36%,
            var(--_highlight) 50%,
            var(--_color) 64%,
            var(--_color) 100%
          )
          0 0 / 300% 100%;
        animation: uf-skeleton-shimmer 1.6s ease-in-out infinite;
      }

      /* A line of text: as tall as the text around it, a little less than the line height. */
      .line {
        height: 0.9em;
        margin-block: 0.25em;
      }

      /* The last of several lines is shorter, like the end of a paragraph. */
      .line.last {
        width: 60%;
      }

      :host([shape='circle']) .block {
        border-radius: 50%;
      }

      @keyframes uf-skeleton-shimmer {
        from {
          background-position: 100% 0;
        }
        to {
          background-position: 0 0;
        }
      }

      /* Still, for people who asked for less motion: the shape alone says "loading". */
      @media (prefers-reduced-motion: reduce) {
        .block,
        .line {
          animation: none;
        }
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    shape: { reflect: true },
    lines: { type: Number },
  };

  /** `text` (lines of text), `rect` (a block, like an image) or `circle` (like an avatar). */
  declare shape: SkeletonShape;
  /** Number of lines of a `text` placeholder. */
  declare lines: number;

  constructor() {
    super();
    this.shape = 'text';
    this.lines = 1;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // A real attribute, so it's hidden for every assistive tech and test tool.
    this.setAttribute('aria-hidden', 'true');
  }

  override render() {
    if (this.shape !== 'text') return html`<div class="base" part="base"><div class="block"></div></div>`;
    const count = Math.max(1, Math.floor(this.lines) || 1);
    return html`<div class="base" part="base">
      ${Array.from(
        { length: count },
        (_, i) => html`<div class=${i === count - 1 && count > 1 ? 'line last' : 'line'} part="line"></div>`,
      )}
    </div>`;
  }
}

defineElement('uf-skeleton', UfSkeleton);

declare global {
  interface HTMLElementTagNameMap {
    'uf-skeleton': UfSkeleton;
  }
}
