import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { resetTranslations, setTranslations } from '../../internal/i18n.js';
import { axeViolations, fixture } from '../../test-utils.js';
import './spinner.js';
import type { UfSpinner } from './spinner.js';

const base = (el: UfSpinner) => el.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;

afterEach(() => {
  document.body.innerHTML = '';
  resetTranslations();
});

describe('uf-spinner', () => {
  it('is announced as "Loading", or its label', async () => {
    const el = await fixture<UfSpinner>('<uf-spinner></uf-spinner>');
    expect(base(el).getAttribute('role')).toBe('progressbar');
    expect(base(el).getAttribute('aria-label')).toBe('Loading');
    el.label = 'Saving';
    await el.updateComplete;
    expect(base(el).getAttribute('aria-label')).toBe('Saving');
  });

  it('translates its default name', async () => {
    setTranslations({ loading: 'Caricamento' }, 'it');
    const el = await fixture<UfSpinner>('<uf-spinner lang="it"></uf-spinner>');
    expect(base(el).getAttribute('aria-label')).toBe('Caricamento');
  });

  it('sizes from size, or --uf-spinner-size', async () => {
    const sm = await fixture<UfSpinner>('<uf-spinner size="sm"></uf-spinner>');
    const lg = await fixture<UfSpinner>('<uf-spinner size="lg"></uf-spinner>');
    expect(base(sm).getBoundingClientRect().width).toBeLessThan(base(lg).getBoundingClientRect().width);
    const custom = await fixture<UfSpinner>('<uf-spinner style="--uf-spinner-size: 50px"></uf-spinner>');
    expect(base(custom).getBoundingClientRect().width).toBe(50);
  });

  it('keeps turning, slower, when reduced motion is asked for', async () => {
    const el = await fixture<UfSpinner>('<uf-spinner></uf-spinner>');
    expect(getComputedStyle(base(el)).animationName).toBe('uf-spin');
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-spinner></uf-spinner><uf-spinner label="Saving" size="lg"></uf-spinner></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
