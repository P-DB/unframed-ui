import { Directive, ElementRef, inject } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { onServer, reflectOnServer } from './server';

type FormElement = HTMLElement & { disabled: boolean } & Record<string, unknown>;

/**
 * Connects an Unframed form control to Angular forms (ngModel, formControl,
 * formControlName). Subclasses say which property holds the value and listen
 * for the event that reports a change.
 */
@Directive()
export abstract class UfValueAccessor<T> implements ControlValueAccessor {
  protected readonly el = inject<ElementRef<FormElement>>(ElementRef).nativeElement;
  readonly #server = onServer();
  /** Element property that holds the value. */
  protected abstract readonly prop: 'value' | 'checked';
  /** Value written when the form control is reset to null. */
  protected abstract readonly empty: T;

  private onChange: (value: T) => void = () => {};
  /** @internal */
  onTouched: () => void = () => {};

  writeValue(value: T | null): void {
    this.el[this.prop] = value ?? this.empty;
    if (this.#server) reflectOnServer(this.el, this.prop, value ?? this.empty);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.el.disabled = disabled;
    if (this.#server) reflectOnServer(this.el, 'disabled', disabled);
  }

  /** @internal Called by the subclass's host listener. */
  handleChange(): void {
    this.onChange(this.el[this.prop] as T);
  }
}
