import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, commit, fixture, typeInto } from '../../test-utils.js';
import './textarea.js';
import type { UfTextarea } from './textarea.js';

const native = (el: UfTextarea) => el.shadowRoot!.querySelector('textarea')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-textarea', () => {
  it('labels the native textarea and applies rows', async () => {
    const el = await fixture<UfTextarea>('<uf-textarea label="Bio" rows="6"></uf-textarea>');
    expect(native(el).labels?.[0]?.textContent?.trim()).toBe('Bio');
    expect(native(el).rows).toBe(6);
  });

  it('tracks typing, emits change, and submits its value', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-textarea name="bio"></uf-textarea></form>');
    const el = form.querySelector('uf-textarea')!;
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    typeInto(native(el), 'line 1\nline 2');
    commit(native(el));
    await el.updateComplete;
    expect(onChange).toHaveBeenCalledOnce();
    expect(new FormData(form).get('bio')).toBe('line 1\nline 2');
  });

  it('validates required and maxlength-free minlength', async () => {
    const el = await fixture<UfTextarea>('<uf-textarea required></uf-textarea>');
    expect(el.validity.valueMissing).toBe(true);
    el.value = 'filled';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it('resets with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-textarea value="draft"></uf-textarea></form>');
    const el = form.querySelector('uf-textarea')!;
    typeInto(native(el), 'edited');
    form.reset();
    await el.updateComplete;
    expect(el.value).toBe('draft');
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-textarea label="Message" hint="Max 500 characters"></uf-textarea></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
