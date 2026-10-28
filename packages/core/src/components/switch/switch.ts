import { css, html, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { describedBy } from '../../internal/field.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';
import { ToggleControl } from '../../internal/toggle-control.js';
import { toggleStyles } from '../../internal/toggle.styles.js';

/**
 * An on/off switch with its label as content. Use it for settings that apply
 * immediately; use a checkbox for choices submitted later with a form.
 *
 * @summary Turns a setting on or off.
 * @tag uf-switch
 *
 * @slot - The label.
 * @slot hint - Help text below the label. Overrides `hint`.
 *
 * @event input - Fired when the state changes.
 * @event change - Fired when the state changes.
 *
 * @csspart base - The `<label>` wrapping control and label.
 * @csspart control - The track.
 * @csspart thumb - The moving knob.
 * @csspart label - The label text.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-switch-width - Width of the track.
 * @cssprop --uf-switch-height - Height of the track.
 * @cssprop --uf-switch-checked-bg - Track color when on.
 * @cssprop --uf-switch-radius - Corner radius of track and thumb. Use `999px` for a pill.
 *
 * @cssstate checked - The switch is on.
 * @cssstate user-invalid - Required but off, after the user interacted.
 */
export class UfSwitch extends ToggleControl {
  static override styles = [
    hostStyles,
    toggleStyles,
    css`
      :host {
        --_track-width: 2.25rem;
        --_track-height: 1.25rem;
        --_control-width: var(--uf-switch-width, var(--_track-width));
        --_control-height: var(--uf-switch-height, var(--_track-height));
        --_thumb: calc(var(--_control-height) - 4px);
      }

      :host([size='sm']) {
        --_track-width: 1.875rem;
        --_track-height: 1rem;
      }

      :host([size='lg']) {
        --_track-width: 2.75rem;
        --_track-height: 1.5rem;
      }

      .native {
        width: var(--_control-width);
        height: var(--_control-height);
        border-radius: var(--uf-switch-radius, var(--uf-radius-control));
        background: var(--uf-color-border-strong);
      }

      .native:checked {
        background: var(--uf-switch-checked-bg, var(--uf-color-accent));
      }

      .disabled .native {
        background: var(--uf-color-neutral-fill);
        box-shadow: inset 0 0 0 1px var(--uf-color-border);
      }

      .disabled .native:checked {
        background: var(--uf-color-text-muted);
        box-shadow: none;
      }

      .disabled .thumb {
        background: var(--uf-color-border-strong);
        box-shadow: none;
      }

      .disabled .native:checked + .thumb {
        background: var(--uf-color-surface);
      }

      .invalid .native {
        box-shadow: 0 0 0 2px var(--uf-color-danger-text);
      }

      .thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: var(--_thumb);
        height: var(--_thumb);
        border-radius: var(--uf-switch-radius, var(--uf-radius-control));
        background: var(--uf-palette-neutral-0);
        box-shadow: var(--uf-shadow-sm);
        pointer-events: none;
        transition: translate var(--uf-duration-base) ease;
      }

      .native:checked + .thumb {
        translate: calc(var(--_control-width) - var(--_thumb) - 4px) 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .thumb {
          transition: none;
        }
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    hint: {},
  };

  /** Help text below the label. */
  declare hint: string | undefined;

  readonly #slots = new HasSlotController(this, 'hint');
  readonly #id = uniqueId('uf-switch');

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const disabled = this.isDisabled;

    return html`
      <label class=${classMap({ root: true, disabled, invalid: Boolean(error) })} part="base">
        <span class="control" part="control">
          <input
            class="native"
            type="checkbox"
            role="switch"
            name=${ifDefined(this.name || undefined)}
            .value=${this.value}
            .checked=${live(this.checked)}
            ?required=${this.required}
            ?disabled=${disabled}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @change=${this.onNativeChange}
          />
          <span class="thumb" part="thumb"></span>
        </span>
        <span class="label" part="label"><slot></slot></span>
      </label>
      <div id=${ids.hintId} class="hint" part="hint" ?hidden=${!this.hint && !hasHintSlot}>
        <slot name="hint">${this.hint}</slot>
      </div>
      <div id=${ids.errorId} class="error" part="error" ?hidden=${!error}>${error}</div>
    `;
  }
}

defineElement('uf-switch', UfSwitch);

declare global {
  interface HTMLElementTagNameMap {
    'uf-switch': UfSwitch;
  }
}
