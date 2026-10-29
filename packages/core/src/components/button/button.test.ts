import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import './button.js';
import type { UfButton } from './button.js';

async function fixture<T extends HTMLElement>(markup: string, selector = 'uf-button'): Promise<T> {
  document.body.innerHTML = markup;
  const el = document.querySelector(selector) as unknown as T & { updateComplete?: Promise<unknown> };
  await (el as unknown as UfButton).updateComplete;
  return el;
}

const inner = (el: UfButton) => el.shadowRoot!.querySelector('[part="base"]') as HTMLElement;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-button', () => {
  it('is icon-only without text, and follows label changes', async () => {
    const iconOnly = (el: UfButton) => inner(el).classList.contains('icon-only');
    const text = await fixture<UfButton>('<uf-button><svg slot="prefix"></svg>Save</uf-button>');
    expect(iconOnly(text)).toBe(false);

    const icon = await fixture<UfButton>('<uf-button label="Close"><svg slot="prefix"></svg></uf-button>');
    expect(iconOnly(icon)).toBe(true);
    icon.append('Close');
    await new Promise((r) => setTimeout(r));
    await icon.updateComplete;
    expect(iconOnly(icon)).toBe(false);
    icon.lastChild!.remove();
    await new Promise((r) => setTimeout(r));
    await icon.updateComplete;
    expect(iconOnly(icon)).toBe(true);
  });

  it('renders an icon-only button once, without a second update', async () => {
    const update = vi.spyOn(customElements.get('uf-button')!.prototype as UfButton & { update(): void }, 'update');
    await fixture<UfButton>('<uf-button label="Add"><svg slot="prefix"></svg></uf-button>');
    await new Promise((r) => setTimeout(r));
    expect(update).toHaveBeenCalledOnce();
    update.mockRestore();
  });

  it('renders a native button with sensible defaults', async () => {
    const el = await fixture<UfButton>('<uf-button>Save</uf-button>');
    expect(inner(el).tagName).toBe('BUTTON');
    expect(el.getAttribute('variant')).toBe('primary');
    expect(el.getAttribute('size')).toBe('md');
    expect(el.type).toBe('button');
  });

  it('forwards focus to the inner button', async () => {
    const el = await fixture<UfButton>('<uf-button>Save</uf-button>');
    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(inner(el));
  });

  it('blocks clicks when disabled', async () => {
    const el = await fixture<UfButton>('<uf-button disabled>Save</uf-button>');
    const onClick = vi.fn();
    el.addEventListener('click', onClick);
    el.click();
    expect(onClick).not.toHaveBeenCalled();
    expect(inner(el).hasAttribute('disabled')).toBe(true);
  });

  it('stays focusable but inert while loading', async () => {
    const el = await fixture<UfButton>('<uf-button loading>Save</uf-button>');
    const onClick = vi.fn();
    el.addEventListener('click', onClick);
    el.click();
    expect(onClick).not.toHaveBeenCalled();
    expect(inner(el).hasAttribute('disabled')).toBe(false);
    expect(inner(el).getAttribute('aria-busy')).toBe('true');
  });

  it('submits its form when type="submit"', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><input name="q" value="hi"><uf-button type="submit">Go</uf-button></form>',
      'form',
    );
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', onSubmit);
    form.querySelector('uf-button')!.click();
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('does not submit by default', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-button>Go</uf-button></form>', 'form');
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', onSubmit);
    form.querySelector('uf-button')!.click();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('resets its form when type="reset"', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><input name="q" value="initial"><uf-button type="reset">Reset</uf-button></form>',
      'form',
    );
    const input = form.querySelector('input')!;
    input.value = 'changed';
    form.querySelector('uf-button')!.click();
    expect(input.value).toBe('initial');
  });

  it('is disabled by a disabled fieldset', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><fieldset disabled><uf-button type="submit">Go</uf-button></fieldset></form>',
      'form',
    );
    const button = form.querySelector('uf-button')!;
    await button.updateComplete;
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', onSubmit);
    button.click();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(inner(button).hasAttribute('disabled')).toBe(true);
  });

  it('renders a link when href is set', async () => {
    const el = await fixture<UfButton>('<uf-button href="/docs" target="_blank">Docs</uf-button>');
    const link = inner(el) as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.rel).toBe('noreferrer noopener');
  });

  it('removes href from a disabled link', async () => {
    const el = await fixture<UfButton>('<uf-button href="/docs" disabled>Docs</uf-button>');
    const link = inner(el);
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });

  it('uses label as the accessible name', async () => {
    const el = await fixture<UfButton>('<uf-button label="Close"><svg slot="prefix"></svg></uf-button>');
    expect(inner(el).getAttribute('aria-label')).toBe('Close');
  });

  for (const theme of ['light', 'dark']) {
    it(`has a grey secondary, unlike a faded primary (${theme})`, async () => {
      document.documentElement.dataset.ufTheme = theme;
      await fixture('<div><uf-button variant="secondary">Cancel</uf-button><uf-button disabled>Save</uf-button></div>');
      const [secondary, primary] = [...document.querySelectorAll<UfButton>('uf-button')].map((b) => getComputedStyle(b.shadowRoot!.querySelector('.base')!));
      const probe = document.body.appendChild(document.createElement('span'));
      probe.style.color = 'var(--uf-color-neutral-fill)';
      expect(secondary.backgroundColor).toBe(getComputedStyle(probe).color);
      // A grey: red, green and blue close together, unlike the purple primary.
      const [r, g, b] = secondary.backgroundColor.match(/\d+/g)!.map(Number);
      expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThan(16);
      expect(primary.backgroundColor).not.toBe(secondary.backgroundColor);
      delete document.documentElement.dataset.ufTheme;
    });
  }

  for (const variant of ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link']) {
    it(`doesn't react to hover when disabled (${variant})`, async () => {
      // No transition, so the computed style is the final one right away.
      const el = await fixture<UfButton>(`<uf-button variant="${variant}" disabled style="--uf-duration-fast: 0s">Disabled</uf-button>`);
      const before = getComputedStyle(inner(el));
      const [color, background, decoration] = [before.color, before.backgroundColor, before.textDecorationLine];
      await userEvent.hover(el);
      const after = getComputedStyle(inner(el));
      expect([after.color, after.backgroundColor, after.textDecorationLine]).toEqual([color, background, decoration]);
      await userEvent.unhover(el);
    });
  }

  it('looks like a text link with variant="link"', async () => {
    const el = await fixture<UfButton>('<uf-button variant="link" href="/docs">Read the docs</uf-button>');
    const style = getComputedStyle(inner(el));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.paddingLeft).toBe('0px');
    // Same color as the accent-strong token, resolved by the browser.
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = 'var(--uf-color-accent-strong)';
    expect(style.color).toBe(getComputedStyle(probe).color);
    expect(inner(el).tagName).toBe('A');
  });

  it('centers the icon in a square when there is no text', async () => {
    const el = await fixture<UfButton>(
      '<uf-button label="Search"><svg slot="prefix" viewBox="0 0 24 24"></svg></uf-button>',
    );
    await new Promise((r) => setTimeout(r));
    await el.updateComplete;
    const base = inner(el).getBoundingClientRect();
    const icon = el.querySelector('svg')!.getBoundingClientRect();
    expect(base.width).toBe(base.height);
    expect(Math.round(icon.left - base.left)).toBe(Math.round(base.right - icon.right));
  });

  it('forwards ARIA state from the host to the inner button', async () => {
    const el = await fixture<UfButton>('<uf-button aria-expanded="false">Menu</uf-button>');
    expect(inner(el).getAttribute('aria-expanded')).toBe('false');
    el.setAttribute('aria-expanded', 'true');
    el.setAttribute('aria-description', 'Opens the menu');
    await new Promise((r) => setTimeout(r));
    await el.updateComplete;
    expect(inner(el).getAttribute('aria-expanded')).toBe('true');
    expect(inner(el).getAttribute('aria-description')).toBe('Opens the menu');
  });

  it('has no axe violations across variants', async () => {
    document.body.innerHTML = `
      <main>
        <uf-button>Primary</uf-button>
        <uf-button variant="secondary">Secondary</uf-button>
        <uf-button variant="outline">Outline</uf-button>
        <uf-button variant="ghost">Ghost</uf-button>
        <uf-button variant="danger">Danger</uf-button>
        <uf-button variant="link">Link</uf-button>
        <uf-button loading>Loading</uf-button>
        <uf-button href="/">Link</uf-button>
      </main>`;
    await Promise.all([...document.querySelectorAll('uf-button')].map((b) => b.updateComplete));
    const results = await axe.run(document.body);
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
