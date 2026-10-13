import { LitElement, css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { defineElement } from '../../internal/define.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { hostStyles } from '../../internal/shared.styles.js';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

/** "John Smith" -> "JS", "john" -> "J". */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return letters.map((w) => [...w][0]?.toUpperCase() ?? '').join('');
}

/**
 * A picture of a person or an entity. Shows the image when it loads, the
 * initials of `name` when there's no image or it fails, and a generic icon
 * when there's neither.
 *
 * `name` is also the accessible name. When the name is already written next
 * to the avatar, set `decorative` so screen readers don't read it twice.
 *
 * @summary Shows a person's picture, initials or icon.
 * @tag uf-avatar
 *
 * @slot - Custom content instead of the initials or icon, e.g. an `<uf-icon>`.
 *
 * @csspart base - The avatar.
 * @csspart image - The `<img>`.
 * @csspart initials - The initials.
 * @csspart icon - The fallback icon.
 *
 * @cssprop --uf-avatar-size - Width and height. Overrides `size`.
 * @cssprop --uf-avatar-bg - Background behind initials and icon.
 * @cssprop --uf-avatar-color - Color of the initials and icon.
 * @cssprop --uf-avatar-radius - Corner radius. Overrides `shape`.
 */
export class UfAvatar extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        --_size: 2.5rem;
        --_radius: 50%;
      }

      :host([size='sm']) {
        --_size: 2rem;
      }
      :host([size='lg']) {
        --_size: 3rem;
      }
      :host([size='xl']) {
        --_size: 4rem;
      }
      :host([shape='square']) {
        --_radius: var(--uf-radius-md);
      }

      .base {
        position: relative;
        display: inline-grid;
        place-items: center;
        width: var(--uf-avatar-size, var(--_size));
        height: var(--uf-avatar-size, var(--_size));
        overflow: hidden;
        border-radius: var(--uf-avatar-radius, var(--_radius));
        background: var(--uf-avatar-bg, var(--uf-color-accent-tint));
        color: var(--uf-avatar-color, var(--uf-color-on-accent-tint));
        font-family: var(--uf-font-family-sans);
        /* Initials scale with the avatar. */
        font-size: calc(var(--uf-avatar-size, var(--_size)) * 0.4);
        font-weight: var(--uf-font-weight-semibold);
        line-height: 1;
        user-select: none;
      }

      .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .icon {
        width: 60%;
        height: 60%;
      }

      ::slotted(*) {
        font-size: inherit;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    src: {},
    name: {},
    initials: {},
    size: { reflect: true },
    shape: { reflect: true },
    decorative: { type: Boolean },
    loading: {},
  };

  /** Image URL. */
  declare src: string | undefined;
  /** The person's or entity's name: the accessible name, and the source of the initials. */
  declare name: string | undefined;
  /** Initials to show instead of the ones taken from `name`. */
  declare initials: string | undefined;
  /** Size: `sm`, `md`, `lg` or `xl`. */
  declare size: AvatarSize;
  /** `circle` or `square` (rounded corners). */
  declare shape: AvatarShape;
  /** Hides the avatar from assistive tech, when the name is already shown next to it. */
  declare decorative: boolean;
  /** The image's `loading` attribute: `lazy` waits until it's near the viewport. */
  declare loading: 'eager' | 'lazy';

  /** The image failed to load: show the fallback. */
  #failed = false;

  constructor() {
    super();
    this.size = 'md';
    this.shape = 'circle';
    this.decorative = false;
    this.loading = 'eager';
  }

  override willUpdate(changed: PropertyValues<this>): void {
    // A new image gets a new chance to load.
    if (changed.has('src')) this.#failed = false;
  }

  override render() {
    const showImage = Boolean(this.src) && !this.#failed;
    const initials = this.initials ?? (this.name ? initialsOf(this.name) : '');
    const labelled = !this.decorative && Boolean(this.name);

    return html`<span
      class="base"
      part="base"
      role=${labelled ? 'img' : nothing}
      aria-label=${labelled ? this.name! : nothing}
      aria-hidden=${labelled ? nothing : 'true'}
    >
      ${showImage
        ? html`<img
            class="image"
            part="image"
            src=${this.src!}
            alt=""
            loading=${this.loading}
            @error=${() => {
              this.#failed = true;
              this.requestUpdate();
            }}
          />`
        : html`<slot>
            ${initials
              ? html`<span part="initials">${initials}</span>`
              : iconSvg(icons.user)}
          </slot>`}
    </span>`;
  }
}

defineElement('uf-avatar', UfAvatar);

declare global {
  interface HTMLElementTagNameMap {
    'uf-avatar': UfAvatar;
  }
}
