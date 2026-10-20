import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { resetTranslations, setTranslations } from '../../internal/i18n.js';
import { axeViolations, fixture } from '../../test-utils.js';
import './progress.js';
import type { UfProgress } from './progress.js';

const bar = (el: UfProgress) => el.shadowRoot!.querySelector<HTMLElement>('[role="progressbar"]')!;
const part = (el: UfProgress, name: string) => el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`);

afterEach(() => {
  document.body.innerHTML = '';
  resetTranslations();
});

describe('uf-progress', () => {
  it('reports its value as a percentage of max', async () => {
    const el = await fixture<UfProgress>('<uf-progress label="Upload" value="30" max="60"></uf-progress>');
    expect(bar(el).getAttribute('aria-valuenow')).toBe('50');
    expect(part(el, 'indicator')!.style.width).toBe('50%');
  });

  it('keeps the value between 0 and max', async () => {
    const el = await fixture<UfProgress>('<uf-progress value="150"></uf-progress>');
    expect(bar(el).getAttribute('aria-valuenow')).toBe('100');
    el.value = -5;
    await el.updateComplete;
    expect(bar(el).getAttribute('aria-valuenow')).toBe('0');
  });

  it('is indeterminate without a value', async () => {
    const el = await fixture<UfProgress>('<uf-progress label="Loading"></uf-progress>');
    expect(bar(el).hasAttribute('aria-valuenow')).toBe(false);
    expect(bar(el).classList.contains('indeterminate')).toBe(true);
  });

  it('is named by its label, or "Progress", translated', async () => {
    const el = await fixture<UfProgress>('<uf-progress label="Upload" value="10"></uf-progress>');
    expect(el.shadowRoot!.getElementById(bar(el).getAttribute('aria-labelledby')!)!.textContent!.trim()).toBe('Upload');
    setTranslations({ progress: 'Avanzamento' }, 'it');
    const unnamed = await fixture<UfProgress>('<uf-progress lang="it" value="10"></uf-progress>');
    expect(bar(unnamed).getAttribute('aria-label')).toBe('Avanzamento');
  });

  it('shows the percentage with show-value', async () => {
    const el = await fixture<UfProgress>('<uf-progress label="Upload" value="42" show-value></uf-progress>');
    expect(part(el, 'value')!.textContent).toBe('42%');
    el.value = undefined;
    await el.updateComplete;
    expect(part(el, 'value')).toBeNull();
  });

  it('has no axe violations, determinate or not', async () => {
    await fixture(`<main>
      <uf-progress label="Upload" value="40" show-value></uf-progress>
      <uf-progress value="70" variant="success"></uf-progress>
      <uf-progress label="Preparing"></uf-progress>
    </main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
