import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, press, settle } from '../../test-utils.js';
import './radio-group.js';
import type { UfRadioGroup } from './radio-group.js';

const markup = (attrs = '') => `
  <main><form>
    <uf-radio-group name="plan" label="Plan" ${attrs}>
      <uf-radio value="free">Free</uf-radio>
      <uf-radio value="pro">Pro</uf-radio>
      <uf-radio value="team" disabled>Team</uf-radio>
      <uf-radio value="enterprise">Enterprise</uf-radio>
    </uf-radio-group>
  </form></main>`;

async function setup(attrs = '') {
  const form = await fixture<HTMLFormElement>(markup(attrs), 'form');
  const group = form.querySelector('uf-radio-group') as UfRadioGroup;
  await settle();
  const radios = [...group.querySelectorAll('uf-radio')];
  return { form, group, radios };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-radio-group', () => {
  it('greys out disabled radios instead of fading them', async () => {
    const group = await fixture<UfRadioGroup>('<uf-radio-group label="Size"><uf-radio value="s" disabled>S</uf-radio><uf-radio value="m">M</uf-radio></uf-radio-group>');
    const [disabled, enabled] = [...group.querySelectorAll('uf-radio')];
    expect(getComputedStyle(disabled).opacity).toBe('1');
    expect(getComputedStyle(disabled).color).not.toBe(getComputedStyle(enabled).color);
  });

  it('selects the radio matching the value attribute', async () => {
    const { group, radios } = await setup('value="pro"');
    expect(group.value).toBe('pro');
    expect(radios.map((r) => r.checked)).toEqual([false, true, false, false]);
  });

  it('keeps only one radio in the tab order', async () => {
    const { radios } = await setup('value="pro"');
    expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1, -1]);
  });

  it('puts the first enabled radio in the tab order when nothing is selected', async () => {
    const { radios } = await setup();
    expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('selects on click and emits change', async () => {
    const { group, radios } = await setup();
    const onChange = vi.fn();
    group.addEventListener('change', onChange);
    radios[1].click();
    await settle();
    expect(group.value).toBe('pro');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('ignores clicks on disabled radios', async () => {
    const { group, radios } = await setup();
    radios[2].click();
    expect(group.value).toBe('');
  });

  it('moves selection with arrow keys, skipping disabled radios and wrapping', async () => {
    const { group, radios } = await setup('value="pro"');
    press(radios[1], 'ArrowDown');
    await settle();
    expect(group.value).toBe('enterprise');
    expect(document.activeElement).toBe(radios[3]);
    press(radios[3], 'ArrowDown');
    await settle();
    expect(group.value).toBe('free');
    press(radios[0], 'ArrowUp');
    await settle();
    expect(group.value).toBe('enterprise');
  });

  it('submits the selected value', async () => {
    const { form, radios } = await setup();
    radios[0].click();
    await settle();
    expect(new FormData(form).get('plan')).toBe('free');
  });

  it('is invalid when required and nothing is selected', async () => {
    const { group, radios } = await setup('required');
    expect(group.validity.valueMissing).toBe(true);
    radios[0].click();
    await settle();
    expect(group.checkValidity()).toBe(true);
  });

  it('exposes radio roles and state', async () => {
    const { group, radios } = await setup('value="free"');
    expect(group.shadowRoot!.querySelector('[role="radiogroup"]')).not.toBeNull();
    expect(radios.map((r) => r.getAttribute('role'))).toEqual(['radio', 'radio', 'radio', 'radio']);
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false', 'false']);
    expect(radios[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('resets to its initial value', async () => {
    const { form, group, radios } = await setup('value="free"');
    radios[1].click();
    form.reset();
    await settle();
    expect(group.value).toBe('free');
  });

  it('has no axe violations', async () => {
    await setup('value="pro" hint="You can change this later"');
    expect(await axeViolations()).toEqual([]);
  });
});
