import { LitElement, type PropertyDeclarations } from 'lit';
import { Translator } from './i18n.js';

/**
 * Base class for form-associated controls. Handles everything a native control
 * gets for free: form value, validity, reset, state restore, `<fieldset disabled>`,
 * and the `user-invalid` custom state (only set after the user interacted or
 * tried to submit, so pristine fields aren't shown as errors).
 *
 * Subclasses implement `syncFormState()` and call it whenever their value changes.
 */
/** Forms (or lone controls) that already focused their first invalid control in this submission. */
const focusedForInvalid = new WeakSet<HTMLElement>();

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
  /** Built-in text, e.g. validation messages, in the page's language. */
  protected readonly translator = new Translator(this);
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
    // Fired by the form when submission is blocked by this control, and by reportValidity().
    this.addEventListener('invalid', this.#onInvalid);
  }

  /**
   * Shows the error inline instead of the browser's bubble, which would repeat it.
   * Cancelling the event also stops the browser from focusing the field, so the
   * first invalid control of a submission is focused here instead.
   */
  #onInvalid = (event: Event): void => {
    if (this.#checking) return;
    event.preventDefault();
    this.markInteracted();
    const group = this.internals.form ?? this;
    if (focusedForInvalid.has(group)) return;
    focusedForInvalid.add(group);
    // A submission fires `invalid` on every invalid control in one task: only the first gets focus.
    // Cleared after the task, not in a microtask: those run between the events of a user's submit.
    setTimeout(() => focusedForInvalid.delete(group));
    this.focus();
  };

  /** True while an update runs, so changes made during it don't start a nested one. */
  #updating = false;

  /**
   * Properties that change the submitted value or the validity. Subclasses add
   * their own constraints (`pattern`, `min`...).
   */
  protected static formStateProperties: ReadonlySet<PropertyKey> = new Set([
    'value',
    'checked',
    'defaultValue',
    'defaultChecked',
    'required',
    'name',
  ]);

  /**
   * Form value and validity come from the rendered control, but the form reads
   * them synchronously: `input.value = 'x'; form.requestSubmit()` must see the
   * new value. So changing one of `formStateProperties` on a rendered control
   * updates it at once, instead of in the next microtask. Other properties keep
   * Lit's batched updates.
   */
  override requestUpdate(...args: Parameters<LitElement['requestUpdate']>): void {
    super.requestUpdate(...args);
    const [name] = args;
    const formState = (this.constructor as typeof FormControl).formStateProperties;
    if (name !== undefined && formState.has(name) && this.hasUpdated && !this.#updating && this.isUpdatePending) {
      this.performUpdate();
    }
  }

  protected override performUpdate(): void {
    this.#updating = true;
    try {
      super.performUpdate();
    } finally {
      this.#updating = false;
    }
  }

  /** The form this control belongs to, if any. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  /** The control's validity state, like a native input's. */
  get validity(): ValidityState {
    return this.internals.validity;
  }

  /** The error message shown when the value is invalid. */
  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  /** Whether the control takes part in form validation. */
  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  /** Returns whether the value is valid, without showing an error. */
  checkValidity(): boolean {
    this.#checking = true;
    try {
      return this.internals.checkValidity();
    } finally {
      this.#checking = false;
    }
  }

  /** Returns whether the value is valid, and shows the error if not. */
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
      this.internals.setValidity(flags, message || this.translator.t('invalidValue'), anchor);
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
