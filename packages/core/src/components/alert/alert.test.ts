import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import { setTranslations } from '../../internal/i18n.js';
import '../button/button.js';
import './alert.js';
import type { UfAlert } from './alert.js';

const part = (el: UfAlert, name: string) => el.shadowRoot!.querySelector<HTMLElement>(`[part~="${name}"]`)!;
const variants = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const;

afterEach(() => {
  document.body.innerHTML = '';
  delete document.documentElement.dataset.ufTheme;
});

describe('uf-alert', () => {
  it('shows its message, as an info status by default', async () => {
    const el = await fixture<UfAlert>('<uf-alert>Your trial ends in 3 days.</uf-alert>');
    expect(el.getAttribute('variant')).toBe('info');
    expect(part(el, 'base').getAttribute('role')).toBe('status');
    expect(part(el, 'heading').hidden).toBe(true);
    expect(part(el, 'actions').hidden).toBe(true);
    expect(part(el, 'close-button')).toBeNull();
  });

  it('announces warning and danger alerts right away', async () => {
    for (const variant of ['warning', 'danger']) {
      const el = await fixture<UfAlert>(`<uf-alert variant="${variant}">Payment failed.</uf-alert>`);
      expect(part(el, 'base').getAttribute('role')).toBe('alert');
    }
  });

  it('colors each variant differently', async () => {
    await fixture('<div>' + variants.map((v) => `<uf-alert variant="${v}">${v}</uf-alert>`).join('') + '</div>');
    const backgrounds = [...document.querySelectorAll<UfAlert>('uf-alert')].map((el) => getComputedStyle(part(el, 'base')).backgroundColor);
    expect(new Set(backgrounds).size).toBe(variants.length);
  });

  it('shows a heading from the attribute or the slot', async () => {
    const el = await fixture<UfAlert>('<uf-alert heading="Saved">All changes are saved.</uf-alert>');
    expect(part(el, 'heading').hidden).toBe(false);
    expect(part(el, 'heading').textContent?.trim()).toBe('Saved');

    const slotted = await fixture<UfAlert>('<uf-alert><span slot="heading">Saved <em>now</em></span>Done.</uf-alert>');
    expect(part(slotted, 'heading').hidden).toBe(false);
  });

  it('replaces or hides the icon', async () => {
    const custom = await fixture<UfAlert>('<uf-alert><svg slot="icon" class="mine"></svg>Hi</uf-alert>');
    const slot = custom.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="icon"]')!;
    expect(slot.assignedElements()[0]?.classList.contains('mine')).toBe(true);

    const none = await fixture<UfAlert>('<uf-alert without-icon>Hi</uf-alert>');
    expect(part(none, 'icon').hidden).toBe(true);
  });

  it('shows actions below the message', async () => {
    const el = await fixture<UfAlert>('<uf-alert>Update ready.<uf-button slot="actions" size="sm">Restart</uf-button></uf-alert>');
    expect(part(el, 'actions').hidden).toBe(false);
  });

  it('hides from the close button and emits uf-hide, then shows again', async () => {
    const el = await fixture<UfAlert>('<uf-alert closable>Saved.</uf-alert>');
    const onHide = vi.fn();
    const onShow = vi.fn();
    el.addEventListener('uf-hide', onHide);
    el.addEventListener('uf-show', onShow);
    const close = part(el, 'close-button') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Close');
    close.click();
    expect(el.hidden).toBe(true);
    expect(getComputedStyle(el).display).toBe('none');
    expect(onHide).toHaveBeenCalledOnce();

    el.show();
    expect(el.hidden).toBe(false);
    expect(onShow).toHaveBeenCalledOnce();
    el.show();
    expect(onShow).toHaveBeenCalledOnce();
  });

  it('translates the close button', async () => {
    setTranslations({ close: 'Chiudi' }, 'it');
    const el = await fixture<UfAlert>('<div lang="it"><uf-alert closable>Salvato.</uf-alert></div>', 'uf-alert');
    expect(part(el, 'close-button').getAttribute('aria-label')).toBe('Chiudi');
  });

  for (const theme of ['light', 'dark']) {
    it(`has no axe violations in every variant (${theme})`, async () => {
      document.documentElement.dataset.ufTheme = theme;
      await fixture(
        '<main>' +
          variants.map((v) => `<uf-alert variant="${v}" heading="${v}" closable>A message.<uf-button slot="actions" size="sm">Act</uf-button></uf-alert>`).join('') +
          '</main>',
      );
      expect(await axeViolations()).toEqual([]);
    });
  }
});
