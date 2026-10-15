import { css, html, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

/** Size of a form field. */
export type FieldSize = 'sm' | 'md' | 'lg';

export interface FieldParts {
  /** Id of the native control the label points at. */
  controlId: string;
  hintId: string;
  errorId: string;
  label?: string;
  hasLabelSlot: boolean;
  hint?: string;
  hasHintSlot: boolean;
  /** Visible error, shown once the user interacted with an invalid field. */
  error: string;
  required: boolean;
  control: TemplateResult;
}

/** ids for `aria-describedby` on the native control. */
export function describedBy(parts: Pick<FieldParts, 'hintId' | 'errorId' | 'hint' | 'hasHintSlot' | 'error'>): string | undefined {
  const ids = [];
  if (parts.hint || parts.hasHintSlot) ids.push(parts.hintId);
  if (parts.error) ids.push(parts.errorId);
  return ids.length ? ids.join(' ') : undefined;
}

/**
 * Label, control, hint and error laid out as one field. The label lives inside
 * the shadow root because an outside `<label for>` can't reach the native control.
 */
export function renderField(parts: FieldParts): TemplateResult {
  const hasLabel = Boolean(parts.label) || parts.hasLabelSlot;
  const hasHint = Boolean(parts.hint) || parts.hasHintSlot;
  return html`
    <div class=${classMap({ field: true, invalid: Boolean(parts.error) })} part="field">
      <label for=${parts.controlId} class="field-label" part="form-label" ?hidden=${!hasLabel}>
        <slot name="label">${parts.label}</slot>
        ${parts.required ? html`<span class="required" aria-hidden="true">*</span>` : nothing}
      </label>
      ${parts.control}
      <div id=${parts.hintId} class="field-hint" part="hint" ?hidden=${!hasHint}>
        <slot name="hint">${parts.hint}</slot>
      </div>
      <div id=${parts.errorId} class="field-error" part="error" ?hidden=${!parts.error}>${parts.error}</div>
    </div>
  `;
}

export const fieldStyles = css`
  :host {
    display: block;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--uf-space-1);
    font-family: var(--uf-font-family-sans);
  }

  .field-label {
    font-size: var(--uf-font-size-md);
    font-weight: var(--uf-font-weight-medium);
    color: var(--uf-color-text);
  }

  .required {
    margin-inline-start: 0.125em;
    color: var(--uf-color-danger-text);
  }

  .field-hint,
  .field-error {
    font-size: var(--uf-font-size-sm);
    line-height: 1.4;
  }

  .field-hint {
    color: var(--uf-color-text-muted);
  }

  .field-error {
    color: var(--uf-color-danger-text);
  }

  [hidden] {
    display: none !important;
  }
`;

/** The bordered box shared by input, textarea and select. */
export const controlBoxStyles = css`
  .box {
    --_height: var(--uf-size-control-md);
    --_padding: var(--uf-space-3);
    --_font-size: var(--uf-font-size-md);
    display: flex;
    align-items: center;
    gap: var(--uf-space-2);
    min-height: var(--_height);
    padding: 0 var(--_padding);
    border: 1px solid var(--uf-field-border-color, var(--uf-color-border-strong));
    border-radius: var(--uf-field-radius, var(--uf-radius-control));
    background: var(--uf-field-bg, var(--uf-color-surface));
    color: var(--uf-color-text);
    font-size: var(--_font-size);
    transition:
      border-color var(--uf-duration-fast) ease,
      box-shadow var(--uf-duration-fast) ease;
  }

  :host([size='sm']) .box {
    --_height: var(--uf-size-control-sm);
    --_padding: var(--uf-space-2);
    --_font-size: var(--uf-font-size-sm);
  }

  :host([size='lg']) .box {
    --_height: var(--uf-size-control-lg);
    --_padding: var(--uf-space-4);
    --_font-size: var(--uf-font-size-lg);
  }

  .box:hover:not(.disabled) {
    border-color: var(--uf-color-text-muted);
  }

  .box:focus-within {
    border-color: var(--uf-color-focus-ring);
    box-shadow: 0 0 0 1px var(--uf-color-focus-ring);
  }

  /* A 2px error outline: the border plus an inset shadow, so the box keeps its size. */
  .invalid .box,
  .invalid .box:hover,
  .invalid .box:focus-within {
    border-color: var(--uf-color-danger-text);
    box-shadow: inset 0 0 0 1px var(--uf-color-danger-text);
  }

  .box.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .native {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
  }

  .native::placeholder {
    color: var(--uf-color-text-muted);
    opacity: 1;
  }

  .native:disabled {
    cursor: not-allowed;
  }

  ::slotted([slot='prefix']),
  ::slotted([slot='suffix']) {
    display: inline-flex;
    flex: none;
    color: var(--uf-color-text-muted);
  }

  ::slotted(svg) {
    width: 1em;
    height: 1em;
  }
`;
