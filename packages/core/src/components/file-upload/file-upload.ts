import { css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { describedBy, fieldStyles, renderField, type FieldSize } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

/** Whether a file matches an `accept` list: extensions (`.pdf`), MIME types (`image/png`) or wildcards (`image/*`). */
function accepts(file: File, accept: string | undefined): boolean {
  const tokens = (accept ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (!tokens.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) =>
    token.startsWith('.') ? name.endsWith(token) : token.endsWith('/*') ? type.startsWith(token.slice(0, -1)) : type === token,
  );
}

/** A size in the language's format, in bytes, kB, MB or GB. */
function formatSize(bytes: number, lang: string): string {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  try {
    return new Intl.NumberFormat(lang || undefined, { style: 'unit', unit: units[unit], unitDisplay: 'short', maximumFractionDigits: unit ? 1 : 0 }).format(value);
  } catch {
    return `${Math.round(value * 10) / 10} ${['B', 'kB', 'MB', 'GB'][unit]}`;
  }
}

/**
 * Picks files to send with a form: from a button, or by dragging them onto the
 * drop zone. The chosen files are listed with their size and a remove button.
 * Files that don't match `accept` or are larger than `max-size` are refused,
 * with a message saying why. It submits like a native `<input type="file">`.
 *
 * @summary Lets users choose files to upload.
 * @tag uf-file-upload
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the label. Overrides `hint`.
 *
 * @event input - Fired when files are added or removed.
 * @event change - Fired when files are added or removed.
 *
 * @csspart field - The wrapper around label, drop zone, files, hint and error.
 * @csspart form-label - The label.
 * @csspart dropzone - The area files can be dropped on.
 * @csspart button - The button that opens the file picker.
 * @csspart files - The list of chosen files.
 * @csspart file - A chosen file.
 * @csspart remove-button - A file's remove button.
 * @csspart rejected - Why files were refused.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-file-upload-border-color - Border color of the drop zone.
 * @cssprop --uf-file-upload-bg - Background of the drop zone.
 * @cssprop --uf-file-upload-radius - Corner radius of the drop zone. Defaults to the theme's control radius.
 * @cssprop --uf-file-upload-active-color - Border and background tint while files are dragged over.
 *
 * @cssstate user-invalid - Required but empty, after the user interacted.
 */
export class UfFileUpload extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    css`
      .dropzone {
        --_active: var(--uf-file-upload-active-color, var(--uf-color-accent-strong));
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--uf-space-2);
        padding: var(--_padding, var(--uf-space-5) var(--uf-space-4));
        border: 1px solid var(--uf-file-upload-border-color, var(--uf-color-border-strong));
        /* Like the fields: square by default, following the theme's control radius. */
        border-radius: var(--uf-file-upload-radius, var(--uf-radius-control));
        background: var(--uf-file-upload-bg, transparent);
        color: var(--uf-color-text-muted);
        font-size: var(--_font-size, var(--uf-font-size-sm));
        text-align: center;
        transition:
          border-color var(--uf-duration-fast) ease,
          background-color var(--uf-duration-fast) ease;
      }

      :host([size='sm']) {
        --_padding: var(--uf-space-3) var(--uf-space-4);
        --_icon: 1.25rem;
      }

      :host([size='lg']) {
        --_padding: var(--uf-space-6) var(--uf-space-5);
        --_icon: 2.25rem;
        --_font-size: var(--uf-font-size-md);
      }

      .dropzone > .icon {
        width: var(--_icon, 1.75rem);
        height: var(--_icon, 1.75rem);
        color: var(--uf-color-text-muted);
      }

      /* Files dragged over it: an accent border, thicker like a focused field. */
      .dropzone.dragging {
        border-color: var(--_active);
        box-shadow: inset 0 0 0 1px var(--_active);
        background: color-mix(in srgb, var(--_active) 8%, transparent);
      }

      /* A 2px error outline, as on the fields. */
      .invalid .dropzone {
        border-color: var(--uf-color-danger-text);
        box-shadow: inset 0 0 0 1px var(--uf-color-danger-text);
      }

      /* Grey, like disabled fields. */
      .dropzone.disabled {
        border-color: var(--uf-color-border);
        background: var(--uf-color-neutral-fill);
      }

      .browse {
        min-height: var(--uf-size-control-sm);
        padding: 0 var(--uf-space-3);
        border: 1px solid var(--uf-color-border-strong);
        border-radius: var(--uf-radius-control);
        background: var(--uf-color-surface);
        color: var(--uf-color-text);
        font: inherit;
        font-weight: var(--uf-font-weight-medium);
        cursor: pointer;
      }

      .browse:hover:not(:disabled) {
        border-color: var(--uf-color-accent-strong);
        color: var(--uf-color-accent-strong);
      }

      .browse:focus-visible {
        ${focusRing}
      }

      .browse:disabled {
        color: var(--uf-color-text-muted);
        cursor: not-allowed;
      }

      .native {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }

      .files {
        display: grid;
        gap: var(--uf-space-1);
        margin: var(--uf-space-2) 0 0;
        padding: 0;
        list-style: none;
      }

      .file {
        display: flex;
        align-items: center;
        gap: var(--uf-space-2);
        min-height: var(--uf-size-control-sm);
        padding: 0 var(--uf-space-1) 0 var(--uf-space-3);
        border: 1px solid var(--uf-color-border);
        border-radius: var(--uf-radius-control);
        font-size: var(--uf-font-size-sm);
        color: var(--uf-color-text);
      }

      .file > .icon {
        flex: none;
        width: 1rem;
        height: 1rem;
        color: var(--uf-color-text-muted);
      }

      .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .size {
        flex: none;
        color: var(--uf-color-text-muted);
        font-variant-numeric: tabular-nums;
      }

      .remove {
        display: inline-flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        padding: 0;
        border: 0;
        border-radius: var(--uf-radius-sm);
        background: transparent;
        color: var(--uf-color-text-muted);
        cursor: pointer;
      }

      .remove:hover:not(:disabled) {
        background: var(--uf-color-surface-hover);
        color: var(--uf-color-text);
      }

      .remove:focus-visible {
        ${focusRing}
      }

      .remove .icon {
        width: 1rem;
        height: 1rem;
      }

      .rejected {
        margin: var(--uf-space-1) 0 0;
        color: var(--uf-color-danger-text);
        font-size: var(--uf-font-size-sm);
      }

      .rejected:empty {
        display: none;
      }

      [hidden] {
        display: none !important;
      }
    `,
  ];

  protected static override formStateProperties: ReadonlySet<PropertyKey> = new Set([...FormControl.formStateProperties, 'files']);

  static override properties: PropertyDeclarations = {
    files: { attribute: false },
    label: {},
    hint: {},
    accept: {},
    multiple: { type: Boolean, reflect: true },
    maxSize: { type: Number, attribute: 'max-size' },
    size: { reflect: true },
  };

  /** The chosen files. Set it to `[]` to clear them. */
  declare files: File[];
  /** Visible label. */
  declare label: string | undefined;
  /** Help text, e.g. the accepted types and size. */
  declare hint: string | undefined;
  /** Accepted files, as in a native file input: extensions (`.pdf`), MIME types (`image/png`) or wildcards (`image/*`), comma-separated. */
  declare accept: string | undefined;
  /** Lets users choose more than one file. */
  declare multiple: boolean;
  /** Largest accepted file, in bytes, e.g. `5000000` for 5 MB. */
  declare maxSize: number | undefined;
  /** Size of the drop zone: `sm`, `md` or `lg`. */
  declare size: FieldSize;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-file-upload');
  #dragging = false;
  #rejected: string[] = [];

  constructor() {
    super();
    this.files = [];
    this.multiple = false;
    this.size = 'md';
  }

  get #input(): HTMLInputElement | null {
    return this.renderRoot.querySelector('.native');
  }

  get #button(): HTMLButtonElement | null {
    return this.renderRoot.querySelector('.browse');
  }

  /** Opens the file picker. */
  showPicker(): void {
    if (!this.isDisabled) this.#input?.click();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('multiple') && !this.multiple && this.files.length > 1) this.files = this.files.slice(0, 1);
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    if (!this.hasUpdated) return;
    if (this.files.length && this.name) {
      const data = new FormData();
      for (const file of this.files) data.append(this.name, file);
      this.internals.setFormValue(data);
    } else {
      this.internals.setFormValue(null);
    }
    const missing = this.required && !this.files.length;
    this.setValidity({ valueMissing: missing }, missing ? this.#missingMessage() : '', this.#button ?? undefined);
  }

  /** The browser's own "Please select a file" message, in the user's language. */
  #missingMessage(): string {
    const probe = document.createElement('input');
    probe.type = 'file';
    probe.required = true;
    return probe.validationMessage;
  }

  protected resetValue(): void {
    this.files = [];
    this.#rejected = [];
  }

  /** Adds files, refusing those that don't fit `accept` and `max-size`. */
  #add(list: FileList | File[]): void {
    const lang = this.translator.lang;
    const rejected: string[] = [];
    const added: File[] = [];
    for (const file of list) {
      if (!accepts(file, this.accept)) rejected.push(this.translator.t('fileTypeRejected', { name: file.name }));
      else if (this.maxSize && file.size > this.maxSize) rejected.push(this.translator.t('fileTooLarge', { name: file.name, size: formatSize(this.maxSize, lang) }));
      else added.push(file);
    }
    this.#rejected = rejected;
    if (added.length) {
      // A new pick replaces the file of a single upload; with `multiple`, files add up (same name and size: kept once).
      const kept = this.multiple ? this.files.filter((f) => !added.some((a) => a.name === f.name && a.size === f.size)) : [];
      this.files = this.multiple ? [...kept, ...added] : added.slice(0, 1);
      this.#changed();
    } else {
      this.requestUpdate();
    }
  }

  #remove(index: number): void {
    this.files = this.files.filter((_, i) => i !== index);
    this.#rejected = [];
    this.#changed();
    // Focus moves to the next file's remove button, or the picker button, so it isn't lost.
    void this.updateComplete.then(() => {
      const buttons = this.renderRoot.querySelectorAll<HTMLButtonElement>('.remove');
      (buttons[Math.min(index, buttons.length - 1)] ?? this.#button)?.focus();
    });
  }

  #changed(): void {
    this.markInteracted();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.emitChange();
  }

  #onPick = (event: Event): void => {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.#add(input.files);
    // Cleared, so choosing the same file again still fires `change`.
    input.value = '';
  };

  #onDragOver = (event: DragEvent): void => {
    if (this.isDisabled || !event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (!this.#dragging) {
      this.#dragging = true;
      this.requestUpdate();
    }
  };

  #onDragLeave = (event: DragEvent): void => {
    if ((event.currentTarget as Element).contains(event.relatedTarget as Node)) return;
    this.#dragging = false;
    this.requestUpdate();
  };

  #onDrop = (event: DragEvent): void => {
    event.preventDefault();
    this.#dragging = false;
    if (this.isDisabled || !event.dataTransfer?.files.length) {
      this.requestUpdate();
      return;
    }
    const files = [...event.dataTransfer.files];
    this.#add(this.multiple ? files : files.slice(0, 1));
  };

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const disabled = this.isDisabled;
    const lang = this.translator.lang;
    const choose = this.translator.t(this.multiple ? 'chooseFiles' : 'chooseFile');

    return renderField({
      ...ids,
      controlId: `${this.#id}-input`,
      label: this.label,
      hasLabelSlot: this.#slots.has('label'),
      hint: this.hint,
      hasHintSlot,
      error,
      required: this.required,
      control: html`
        <div
          class=${classMap({ dropzone: true, dragging: this.#dragging, disabled })}
          part="dropzone"
          @dragover=${this.#onDragOver}
          @dragleave=${this.#onDragLeave}
          @drop=${this.#onDrop}
        >
          ${iconSvg(icons.upload)}
          <button
            class="browse"
            part="button"
            type="button"
            ?disabled=${disabled}
            aria-label=${this.label ? `${choose}: ${this.label}` : choose}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @click=${() => this.showPicker()}
          >
            ${choose}
          </button>
          <span>${this.translator.t(this.multiple ? 'dropFiles' : 'dropFile')}</span>
          <input
            id=${`${this.#id}-input`}
            class="native"
            type="file"
            tabindex="-1"
            aria-hidden="true"
            accept=${ifDefined(this.accept)}
            ?multiple=${this.multiple}
            ?disabled=${disabled}
            @change=${this.#onPick}
            @input=${(event: Event) => event.stopPropagation()}
          />
        </div>
        <ul class="files" part="files" ?hidden=${!this.files.length}>
          ${this.files.map(
            (file, i) => html`<li class="file" part="file">
              ${iconSvg(icons.file)}
              <span class="name" title=${file.name}>${file.name}</span>
              <span class="size">${formatSize(file.size, lang)}</span>
              <button
                class="remove"
                part="remove-button"
                type="button"
                ?disabled=${disabled}
                aria-label=${this.translator.t('removeFile', { name: file.name })}
                @click=${() => this.#remove(i)}
              >
                ${iconSvg(icons.x)}
              </button>
            </li>`,
          )}
        </ul>
        <div class="rejected" part="rejected" role="status">${this.#rejected.length ? this.#rejected.join(' ') : nothing}</div>
      `,
    });
  }
}

defineElement('uf-file-upload', UfFileUpload);

declare global {
  interface HTMLElementTagNameMap {
    'uf-file-upload': UfFileUpload;
  }
}
