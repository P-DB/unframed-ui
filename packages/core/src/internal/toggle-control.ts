import type { PropertyDeclarations, PropertyValues } from 'lit';
import { FormControl } from './form-control.js';

/**
 * Shared logic for checkbox-like controls: `checked` state, the `checked`
 * attribute as the reset default, and submitting `value` only when checked.
 */
export abstract class ToggleControl extends FormControl {
  static override properties: PropertyDeclarations = {
    checked: { type: Boolean, attribute: false },
    defaultChecked: { type: Boolean, attribute: 'checked' },
    value: {},
  };

  /** Whether the control is on. */
  declare checked: boolean;
  /** Initial state, restored on form reset. Set with the `checked` attribute. */
  declare defaultChecked: boolean;
  /** Value submitted with the form when checked. */
  declare value: string;

  constructor() {
    super();
    this.checked = false;
    this.defaultChecked = false;
    this.value = 'on';
  }

  protected get nativeInput(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input');
  }

  /** Toggles the control, as if the user clicked it. */
  toggle(): void {
    this.nativeInput?.click();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultChecked') && this.checked === Boolean(changed.get('defaultChecked'))) {
      this.checked = this.defaultChecked;
    }
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    const input = this.nativeInput;
    if (!input) return;
    this.internals.setFormValue(this.checked ? this.value : null, String(this.checked));
    this.internals.states?.[this.checked ? 'add' : 'delete']('checked');
    this.setValidityFrom(input);
  }

  protected resetValue(): void {
    this.checked = this.defaultChecked;
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.checked = state === 'true';
  }

  protected onNativeChange = (event: Event): void => {
    this.checked = (event.target as HTMLInputElement).checked;
    this.markInteracted();
    this.emitChange();
  };
}
