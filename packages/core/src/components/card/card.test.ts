import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './card.js';
import type { UfCard } from './card.js';

const part = (el: UfCard, name: string) => el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;
const shown = (el: HTMLElement) => getComputedStyle(el).display !== 'none';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-card', () => {
  it('shows only the sections that have content', async () => {
    const el = await fixture<UfCard>('<uf-card><h3 slot="header">Title</h3>Body</uf-card>');
    expect(shown(part(el, 'header'))).toBe(true);
    expect(shown(part(el, 'body'))).toBe(true);
    expect(shown(part(el, 'media'))).toBe(false);
    expect(shown(part(el, 'footer'))).toBe(false);
  });

  it('hides the body when there is only whitespace in it', async () => {
    const el = await fixture<UfCard>('<uf-card>\n  <h3 slot="header">Title</h3>\n  <span slot="footer">Footer</span>\n</uf-card>');
    expect(shown(part(el, 'body'))).toBe(false);
  });

  it('updates when content is added later', async () => {
    const el = await fixture<UfCard>('<uf-card>Body</uf-card>');
    const footer = Object.assign(document.createElement('div'), { slot: 'footer', textContent: 'Actions' });
    el.append(footer);
    await new Promise((r) => setTimeout(r));
    await el.updateComplete;
    expect(shown(part(el, 'footer'))).toBe(true);
  });

  it('puts the media beside the content when horizontal', async () => {
    const el = await fixture<UfCard>('<uf-card orientation="horizontal"><img slot="media" alt="" />Body</uf-card>');
    expect(getComputedStyle(part(el, 'base')).flexDirection).toBe('row');
  });

  it('has a shadow when elevated and no border', async () => {
    const el = await fixture<UfCard>('<uf-card appearance="elevated">Body</uf-card>');
    const style = getComputedStyle(part(el, 'base'));
    expect(style.boxShadow).not.toBe('none');
    expect(style.borderTopColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('glows with the accent color when elevated in dark mode', async () => {
    const light = await fixture<UfCard>('<uf-card appearance="elevated" data-uf-theme="light">Body</uf-card>');
    const lightShadow = getComputedStyle(part(light, 'base')).boxShadow;
    expect(lightShadow).toContain('rgba(0, 0, 0');
    const dark = await fixture<UfCard>('<uf-card appearance="elevated" data-uf-theme="dark">Body</uf-card>');
    const darkShadow = getComputedStyle(part(dark, 'base')).boxShadow;
    // Accent-tinted, not black: black shadows don't show on dark backgrounds.
    expect(darkShadow).not.toContain('rgba(0, 0, 0');
    expect(darkShadow).not.toBe(lightShadow);
  });

  it('has no axe violations', async () => {
    await fixture(`<main>
      <uf-card>
        <img slot="media" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="A mountain lake" />
        <h3 slot="header">Lake Bled</h3>
        A lake in the Julian Alps.
        <button slot="footer">Book</button>
      </uf-card>
    </main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
