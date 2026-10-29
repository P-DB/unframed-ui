// Runs the published build (partial compilation) the way an app would, with
// @angular/compiler linking it just in time.
import '@angular/compiler';
import { ChangeDetectorRef, Component, inject, provideZonelessChangeDetection, type ApplicationRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { UNFRAMED } from '../dist/fesm2022/unframed-angular.mjs';

let appRef: ApplicationRef | undefined;

async function settle(): Promise<void> {
  await appRef!.whenStable();
  await new Promise((r) => setTimeout(r));
  const els = [...document.querySelectorAll('*')].filter((e) => e.localName.startsWith('uf-'));
  await Promise.all(els.map((e) => (e as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete));
}

/** Bootstraps a standalone component with the given template and state. */
async function mount<T extends object>(template: string, state: T) {
  document.body.append(document.createElement('test-host'));
  // A decorator applied as a function, so the test needs no decorator transpilation.
  const Host = Component({ selector: 'test-host', imports: [UNFRAMED, FormsModule, ReactiveFormsModule], template })(
    class {
      /** The component's own change detector, as a real component would inject it. */
      readonly cdr = inject(ChangeDetectorRef);
      constructor() {
        Object.assign(this, state);
      }
    },
  );
  appRef = await bootstrapApplication(Host as never, { providers: [provideZonelessChangeDetection()] });
  await settle();
  const instance = appRef.components[0].instance as T & { cdr: ChangeDetectorRef };
  // Like a real OnPush component: change state, mark for check, let Angular render.
  const update = async (changes: Partial<T>) => {
    Object.assign(instance, changes);
    instance.cdr.markForCheck();
    await settle();
  };
  return { instance, update };
}

const $ = <T = HTMLElement>(selector: string) => document.querySelector(selector) as T;

function type(el: Element, text: string) {
  const input = el.shadowRoot!.querySelector('input, textarea') as HTMLInputElement;
  input.value = text;
  input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
}

afterEach(() => {
  appRef?.destroy();
  appRef = undefined;
  document.querySelector('test-host')?.remove();
});

describe('@unframed/angular', () => {
  it('renders the custom element with inputs as properties and projected content', async () => {
    await mount(`<uf-button [variant]="variant" disabled><span slot="prefix">*</span>Delete</uf-button>`, { variant: 'danger' });
    const el = $<HTMLElement & { variant: string; disabled: boolean }>('uf-button');
    expect(el.variant).toBe('danger');
    // A bare `disabled` attribute becomes `true`, not an empty string.
    expect(el.disabled).toBe(true);
    expect(el.querySelector('[slot="prefix"]')).not.toBeNull();
  });

  it('emits typed outputs for custom events', async () => {
    const { instance } = await mount(
      `<uf-tabs (uf-tab-change)="tab = $event.detail.name">
        <uf-tab panel="a">A</uf-tab><uf-tab panel="b">B</uf-tab>
        <uf-tab-panel name="a">A</uf-tab-panel><uf-tab-panel name="b">B</uf-tab-panel>
      </uf-tabs>`,
      { tab: '' },
    );
    document.querySelectorAll<HTMLElement>('uf-tab')[1].click();
    await settle();
    expect(instance.tab).toBe('b');
  });

  it('works with ngModel on text fields', async () => {
    const { instance, update } = await mount(`<uf-input [(ngModel)]="email" label="Email" />`, { email: 'a@b.co' });
    const el = $<HTMLElement & { value: string }>('uf-input');
    expect(el.value).toBe('a@b.co');

    type(el, 'new@b.co');
    await settle();
    expect(instance.email).toBe('new@b.co');

    await update({ email: 'set@b.co' });
    expect(el.value).toBe('set@b.co');
  });

  it('works with ngModel on the number input, as a number or null', async () => {
    const { instance, update } = await mount(`<uf-number-input [(ngModel)]="guests" label="Guests" />`, { guests: 2 as number | null });
    const el = $<HTMLElement & { value: number | null; stepUp(): void }>('uf-number-input');
    expect(el.value).toBe(2);

    el.stepUp();
    await settle();
    expect(instance.guests).toBe(3);

    type(el, '');
    await settle();
    expect(instance.guests).toBeNull();

    await update({ guests: 7 });
    expect(el.value).toBe(7);
  });

  it('works with ngModel on checkboxes (checked)', async () => {
    const { instance } = await mount(`<uf-checkbox [(ngModel)]="agree">Agree</uf-checkbox>`, { agree: false });
    $('uf-checkbox').shadowRoot!.querySelector('input')!.click();
    await settle();
    expect(instance.agree).toBe(true);
  });

  it('two-way binds indeterminate with [(indeterminate)]', async () => {
    const { instance, update } = await mount(`<uf-checkbox [(indeterminate)]="some">All</uf-checkbox>`, { some: true });
    const box = $<HTMLElement & { indeterminate: boolean }>('uf-checkbox');
    expect(box.indeterminate).toBe(true);
    box.shadowRoot!.querySelector('input')!.click();
    await settle();
    expect(instance.some).toBe(false);
    await update({ some: true });
    expect(box.indeterminate).toBe(true);
  });

  it('binds a checkbox group to an array with reactive forms, including "select all"', async () => {
    const toppings = new FormControl<string[]>(['olives']);
    await mount(
      `<uf-checkbox-group [formControl]="toppings" label="Toppings">
        <uf-checkbox select-all>All</uf-checkbox>
        <uf-checkbox value="cheese">Cheese</uf-checkbox>
        <uf-checkbox value="olives">Olives</uf-checkbox>
      </uf-checkbox-group>`,
      { toppings },
    );
    const [all, cheese] = [...document.querySelectorAll('uf-checkbox')] as (HTMLElement & { checked: boolean; indeterminate: boolean })[];
    expect(all.indeterminate).toBe(true);

    all.shadowRoot!.querySelector('input')!.click();
    await settle();
    expect(toppings.value).toEqual(['cheese', 'olives']);

    toppings.setValue([]);
    await settle();
    expect(cheese.checked).toBe(false);
    expect(all.indeterminate).toBe(false);
  });

  it('works with reactive forms: value, changes, disabled and touched', async () => {
    const country = new FormControl('fr');
    await mount(
      `<uf-select [formControl]="country"><option value="it">Italy</option><option value="fr">France</option></uf-select>`,
      { country },
    );
    const el = $<HTMLElement & { value: string; disabled: boolean }>('uf-select');
    expect(el.value).toBe('fr');

    const native = el.shadowRoot!.querySelector('select')!;
    native.value = 'it';
    native.dispatchEvent(new Event('change'));
    await settle();
    expect(country.value).toBe('it');

    country.disable();
    await settle();
    expect(el.disabled).toBe(true);

    el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(country.touched).toBe(true);
  });

  it('exposes the element for its methods', async () => {
    await mount(`<uf-dialog #dialog label="Hi">Hello</uf-dialog><button (click)="dialog.el.show()">Open</button>`, {});
    $('button').click();
    await settle();
    expect($<HTMLElement & { open: boolean }>('uf-dialog').open).toBe(true);
  });
});
