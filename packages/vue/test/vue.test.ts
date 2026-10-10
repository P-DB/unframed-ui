import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, nextTick, ref, type App } from 'vue';
import '@unframed/tokens/tokens.css';
import { UfButton, UfCheckbox, UfCheckboxGroup, UfCombobox, UfDialog, UfInput, UfSelect, UfSwitch, UfTab, UfTabPanel, UfTabs, UnframedVue } from '../src/index.js';

let app: App | undefined;
let host: HTMLElement;

/** Mounts a template with the given components and setup state. */
async function mount(template: string, setup: () => Record<string, unknown> = () => ({}), components: Record<string, unknown> = {}) {
  host = document.createElement('div');
  document.body.append(host);
  app = createApp({ template, setup, components });
  const vm = app.mount(host);
  await settle();
  return vm;
}

async function settle() {
  await nextTick();
  await Promise.all([...host.querySelectorAll('*')].filter((e) => e.localName.startsWith('uf-')).map((e) => (e as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete));
}

function type(el: Element, text: string) {
  const input = el.shadowRoot!.querySelector('input, textarea') as HTMLInputElement;
  input.value = text;
  input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
}

afterEach(() => {
  app?.unmount();
  host?.remove();
});

describe('@unframed/vue', () => {
  it('renders the custom element, setting props as properties and passing other attributes through', async () => {
    await mount(`<UfButton variant="danger" class="wide" data-test="x"><span slot="prefix">*</span>Delete</UfButton>`, undefined, { UfButton });
    const el = host.querySelector('uf-button')!;
    expect((el as HTMLElement & { variant: string }).variant).toBe('danger');
    expect(el.classList.contains('wide')).toBe(true);
    expect(el.getAttribute('data-test')).toBe('x');
    expect(el.querySelector('[slot="prefix"]')).not.toBeNull();
  });

  it('leaves unset props at their element defaults', async () => {
    await mount(`<UfButton>Save</UfButton>`, undefined, { UfButton });
    expect((host.querySelector('uf-button') as HTMLElement & { variant: string }).variant).toBe('primary');
  });

  it('supports v-model on text inputs, both ways', async () => {
    const email = ref('a@b.co');
    await mount(`<UfInput v-model="email" label="Email" />`, () => ({ email }), { UfInput });
    const el = host.querySelector('uf-input') as HTMLElement & { value: string };
    expect(el.value).toBe('a@b.co');

    type(el, 'new@b.co');
    await settle();
    expect(email.value).toBe('new@b.co');

    email.value = 'set@b.co';
    await settle();
    expect(el.value).toBe('set@b.co');
  });

  it('supports v-model on checkboxes and switches (checked)', async () => {
    const agree = ref(false);
    const wifi = ref(true);
    await mount(`<UfCheckbox v-model="agree">Agree</UfCheckbox><UfSwitch v-model="wifi">Wi-Fi</UfSwitch>`, () => ({ agree, wifi }), {
      UfCheckbox,
      UfSwitch,
    });
    const [checkbox, toggle] = [host.querySelector('uf-checkbox')!, host.querySelector('uf-switch')!];
    expect((toggle as HTMLElement & { checked: boolean }).checked).toBe(true);

    (checkbox.shadowRoot!.querySelector('input') as HTMLInputElement).click();
    (toggle.shadowRoot!.querySelector('input') as HTMLInputElement).click();
    await settle();
    expect(agree.value).toBe(true);
    expect(wifi.value).toBe(false);
  });

  it('keeps v-model:indeterminate in sync when a click clears it', async () => {
    const some = ref(true);
    await mount(`<UfCheckbox v-model:indeterminate="some">All</UfCheckbox>`, () => ({ some }), { UfCheckbox });
    const box = host.querySelector('uf-checkbox') as HTMLElement & { indeterminate: boolean };
    expect(box.indeterminate).toBe(true);
    (box.shadowRoot!.querySelector('input') as HTMLInputElement).click();
    await settle();
    expect(some.value).toBe(false);
    some.value = true;
    await settle();
    expect(box.indeterminate).toBe(true);
  });

  it('binds a checkbox group to an array, with "select all"', async () => {
    const toppings = ref<string[]>(['olives']);
    await mount(
      `<UfCheckboxGroup v-model="toppings" label="Toppings">
        <UfCheckbox select-all>All</UfCheckbox>
        <UfCheckbox value="cheese">Cheese</UfCheckbox>
        <UfCheckbox value="olives">Olives</UfCheckbox>
      </UfCheckboxGroup>`,
      () => ({ toppings }),
      { UfCheckboxGroup, UfCheckbox },
    );
    const [all, cheese] = [...host.querySelectorAll('uf-checkbox')] as (HTMLElement & { checked: boolean; indeterminate: boolean })[];
    expect(all.indeterminate).toBe(true);

    (all.shadowRoot!.querySelector('input') as HTMLInputElement).click();
    await settle();
    expect(toppings.value).toEqual(['cheese', 'olives']);

    toppings.value = [];
    await settle();
    expect(cheese.checked).toBe(false);
    expect(all.checked).toBe(false);
    expect(all.indeterminate).toBe(false);
  });

  it('supports v-model on select and combobox (change)', async () => {
    const country = ref('fr');
    const zone = ref('');
    await mount(
      `<UfSelect v-model="country"><option value="it">Italy</option><option value="fr">France</option></UfSelect>
       <UfCombobox v-model="zone"><option value="rome">Rome</option><option value="tokyo">Tokyo</option></UfCombobox>`,
      () => ({ country, zone }),
      { UfSelect, UfCombobox },
    );
    const select = host.querySelector('uf-select')!;
    expect((select as HTMLElement & { value: string }).value).toBe('fr');
    const native = select.shadowRoot!.querySelector('select')!;
    native.value = 'it';
    native.dispatchEvent(new Event('change'));
    await settle();
    expect(country.value).toBe('it');

    const combobox = host.querySelector('uf-combobox')!;
    const input = combobox.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await settle();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await settle();
    expect(zone.value).toBe('rome');
  });

  it('listens to custom events with @uf-* handlers', async () => {
    const onChange = vi.fn();
    await mount(
      `<UfTabs @uf-tab-change="onChange">
        <UfTab panel="a">A</UfTab><UfTab panel="b">B</UfTab>
        <UfTabPanel name="a">A</UfTabPanel><UfTabPanel name="b">B</UfTabPanel>
      </UfTabs>`,
      () => ({ onChange }),
      { UfTabs, UfTab, UfTabPanel },
    );
    (host.querySelectorAll('uf-tab')[1] as HTMLElement).click();
    await settle();
    expect(onChange.mock.calls[0][0].detail).toEqual({ name: 'b' });
  });

  it('exposes the element as `el` for its methods', async () => {
    const dialog = ref<{ el: HTMLElement & { show(): void; open: boolean } }>();
    await mount(`<UfDialog ref="dialog" label="Hi">Hello</UfDialog>`, () => ({ dialog }), { UfDialog });
    dialog.value!.el.show();
    await settle();
    expect(dialog.value!.el.open).toBe(true);
  });

  it('registers every component globally with the plugin', async () => {
    host = document.createElement('div');
    document.body.append(host);
    app = createApp({ template: `<UfButton variant="outline">Global</UfButton>` });
    app.use(UnframedVue);
    app.mount(host);
    await settle();
    expect((host.querySelector('uf-button') as HTMLElement & { variant: string }).variant).toBe('outline');
  });
});
