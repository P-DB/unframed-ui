import { LitElement, type PropertyDeclarations } from 'lit';

/**
 * Base class for form-associated controls. Handles everything a native control
 * gets for free: form value, validity, reset, state restore, `<fieldset disabled>`,
 * and the `user-invalid` custom state (only set after the user interacted or
 * tried to submit, so pristine fields aren't shown as errors).
 *
 * Subclasses implement `syncFormState()` and call it whenever their value changes.
 */
export abstract class FormControl extends LitElement {
  static formAssociated = true;
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static override properties: PropertyDeclarations = {
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
  };

  /** Name submitted with the form. */
  declare name: string;
  /** Disables the control. */
  declare disabled: boolean;
  /** Makes the control required for form submission. */
  declare required: boolean;

  protected readonly internals = this.attachInternals();
  #formDisabled = false;
  #interacted = false;
  #customError = '';
  /** True while checkValidity() runs, so its `invalid` event isn't taken for a submit attempt. */
  #checking = false;

  constructor() {
    super();
    this.name = '';
    this.disabled = false;
    this.required = false;
    // Fired by the form when submission is blocked by this control.
    this.addEventListener('invalid', () => {
      if (!this.#checking) this.markInteracted();
    });
  }

  /** The form this control belongs to, if any. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  get validity(): ValidityState {
    return this.internals.validity;
  }

  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  checkValidity(): boolean {
    this.#checking = true;
    try {
      return this.internals.checkValidity();
    } finally {
      this.#checking = false;
    }
  }

  reportValidity(): boolean {
    this.markInteracted();
    return this.internals.reportValidity();
  }

  /** Sets a custom error message. Pass an empty string to clear it. */
  setCustomValidity(message: string): void {
    this.#customError = message;
    this.syncFormState();
  }

  /** True when the control is disabled directly or through a disabled fieldset. */
  protected get isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  /** True when the control is invalid and the user has interacted with it. */
  protected get showInvalid(): boolean {
    return this.#interacted && !this.internals.validity.valid;
  }

  protected get customError(): string {
    return this.#customError;
  }

  /** Call after user input or blur, so validation errors may be shown. */
  protected markInteracted(): void {
    if (this.#interacted) return;
    this.#interacted = true;
    this.#updateStates();
  }

  /**
   * Sets validity from flags. A custom error set through `setCustomValidity`
   * takes precedence. `anchor` is the element the browser points its bubble at.
   */
  protected setValidity(flags: ValidityStateFlags, message: string, anchor?: HTMLElement): void {
    if (this.#customError) {
      this.internals.setValidity({ ...flags, customError: true }, this.#customError, anchor);
    } else if (Object.values(flags).some(Boolean)) {
      this.internals.setValidity(flags, message || 'Invalid value', anchor);
    } else {
      this.internals.setValidity({});
    }
    this.#updateStates();
  }

  /** Copies a native control's validity onto the host. */
  protected setValidityFrom(control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
    control.setCustomValidity(this.#customError);
    const v = control.validity;
    this.setValidity(
      {
        valueMissing: v.valueMissing,
        typeMismatch: v.typeMismatch,
        patternMismatch: v.patternMismatch,
        tooLong: v.tooLong,
        tooShort: v.tooShort,
        rangeUnderflow: v.rangeUnderflow,
        rangeOverflow: v.rangeOverflow,
        stepMismatch: v.stepMismatch,
        badInput: v.badInput,
      },
      control.validationMessage,
      control,
    );
  }

  #shownInvalid = false;

  #updateStates(): void {
    const invalid = this.showInvalid;
    // Only re-render on a real change: syncFormState() runs from updated().
    if (invalid === this.#shownInvalid) return;
    this.#shownInvalid = invalid;
    this.internals.states?.[invalid ? 'add' : 'delete']('user-invalid');
    this.requestUpdate();
  }

  /** Updates the submitted value and validity. */
  protected abstract syncFormState(): void;

  /** Restores the initial value, called on form reset. */
  protected abstract resetValue(): void;

  /** @internal */
  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.requestUpdate();
  }

  /** @internal */
  formResetCallback(): void {
    this.resetValue();
    this.#interacted = false;
    this.syncFormState();
  }

  /** Dispatches a bubbling `change` event, which native `change` events don't cross shadow roots. */
  protected emitChange(): void {
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
