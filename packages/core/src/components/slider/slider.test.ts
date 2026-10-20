import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './slider.js';
import type { UfSlider } from './slider.js';

const input = (el: UfSlider) => el.shadowRoot!.querySelector('input')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-slider', () => {
  it('is a labelled native range with its min, max and step', async () => {
    const el = await fixture<UfSlider>('<uf-slider label="Volume" min="10" max="20" step="2" value="14"></uf-slider>');
    expect(input(el).type).toBe('range');
    expect(input(el).labels?.[0]?.textContent?.trim()).toBe('Volume');
    expect([input(el).min, input(el).max, input(el).step, input(el).value]).toEqual(['10', '20', '2', '14']);
    expect(el.value).toBe(14);
  });

  it('starts in the middle of the range without a value, like a native slider', async () => {
    const el = await fixture<UfSlider>('<uf-slider label="Volume" min="0" max="10"></uf-slider>');
    expect(el.value).toBe(5);
  });

  it('keeps the value within the range and on a step', async () => {
    const el = await fixture<UfSlider>('<uf-slider label="Volume" max="10" step="0.5"></uf-slider>');
    el.value = 42;
    await el.updateComplete;
    expect(el.value).toBe(10);
    el.value = 3.3;
    await el.updateComplete;
    expect(el.value).toBe(3.5);
    el.max = 3;
    await el.updateComplete;
    expect(el.value).toBe(3);
  });

  it('moves with the keyboard and fires input and change', async () => {
    const el = await fixture<UfSlider>('<uf-slider label="Volume" value="50"></uf-slider>');
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);
    input(el).focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(el.value).toBe(52);
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('submits, resets and restores with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-slider name="volume" label="Volume" value="30"></uf-slider></form>');
    const el = form.querySelector('uf-slider')!;
    expect(new FormData(form).get('volume')).toBe('30');
    el.value = 80;
    expect(new FormData(form).get('volume')).toBe('80');
    form.reset();
    await el.updateComplete;
    expect(el.value).toBe(30);
  });

  it('shows its value next to the label, hidden from screen readers (the slider announces it)', async () => {
    const el = await fixture<UfSlider>('<uf-slider label="Volume" value="40" show-value></uf-slider>');
    const value = el.shadowRoot!.querySelector('[part="value"]')!;
    expect(value.textContent).toBe('40');
    expect(value.getAttribute('aria-hidden')).toBe('true');
  });

  it('is disabled by disabled or a disabled fieldset', async () => {
    const form = await fixture<HTMLFormElement>('<form><fieldset disabled><uf-slider name="v" label="V"></uf-slider></fieldset></form>');
    const el = form.querySelector('uf-slider')!;
    await el.updateComplete;
    expect(input(el).disabled).toBe(true);
    expect(new FormData(form).has('v')).toBe(false);
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-slider label="Volume" hint="0 to 100" show-value></uf-slider><uf-slider label="Off" disabled></uf-slider></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
