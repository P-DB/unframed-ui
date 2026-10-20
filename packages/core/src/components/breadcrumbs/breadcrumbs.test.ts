import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { resetTranslations, setTranslations } from '../../internal/i18n.js';
import { axeViolations, fixture } from '../../test-utils.js';
import './breadcrumbs.js';
import type { UfBreadcrumbItem, UfBreadcrumbs } from './breadcrumbs.js';

const markup = `<uf-breadcrumbs>
  <uf-breadcrumb-item href="/">Home</uf-breadcrumb-item>
  <uf-breadcrumb-item href="/docs">Docs</uf-breadcrumb-item>
  <uf-breadcrumb-item href="/docs/theming">Theming</uf-breadcrumb-item>
</uf-breadcrumbs>`;

const items = (el: UfBreadcrumbs) => [...el.querySelectorAll<UfBreadcrumbItem>('uf-breadcrumb-item')];
const settle = async (el: UfBreadcrumbs) => {
  await new Promise((resolve) => setTimeout(resolve));
  await Promise.all(items(el).map((item) => item.updateComplete));
};

afterEach(() => {
  document.body.innerHTML = '';
  resetTranslations();
});

describe('uf-breadcrumbs', () => {
  it('is a named navigation with a list of items', async () => {
    const el = await fixture<UfBreadcrumbs>(markup);
    await settle(el);
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(el.shadowRoot!.querySelector('[role="list"]')).not.toBeNull();
    expect(items(el).every((item) => item.getAttribute('role') === 'listitem')).toBe(true);
  });

  it('links every item but the last, which is the current page', async () => {
    const el = await fixture<UfBreadcrumbs>(markup);
    await settle(el);
    const [home, docs, theming] = items(el);
    expect(home.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('/');
    expect(docs.shadowRoot!.querySelector('a')).not.toBeNull();
    expect(theming.current).toBe(true);
    expect(theming.shadowRoot!.querySelector('a')).toBeNull();
    expect(theming.shadowRoot!.querySelector('[aria-current="page"]')).not.toBeNull();
  });

  it('moves "current" when an item is added', async () => {
    const el = await fixture<UfBreadcrumbs>(markup);
    await settle(el);
    const extra = Object.assign(document.createElement('uf-breadcrumb-item'), { textContent: 'Tokens' });
    el.append(extra);
    await settle(el);
    expect(items(el).map((item) => item.current)).toEqual([false, false, false, true]);
  });

  it('hides separators from assistive tech, and copies a custom one', async () => {
    const el = await fixture<UfBreadcrumbs>(markup.replace('<uf-breadcrumbs>', '<uf-breadcrumbs><span slot="separator">/</span>'));
    await settle(el);
    const [home, , theming] = items(el);
    expect(home.shadowRoot!.querySelector('[part="separator"]')!.getAttribute('aria-hidden')).toBe('true');
    expect(home.querySelector('[data-uf-separator]')!.textContent).toBe('/');
    expect(theming.querySelector('[data-uf-separator]')).toBeNull();
    expect(theming.shadowRoot!.querySelector('[part="separator"]')).toBeNull();
  });

  it('translates its name', async () => {
    setTranslations({ breadcrumb: 'Percorso' }, 'it');
    const el = await fixture<UfBreadcrumbs>(markup.replace('<uf-breadcrumbs>', '<uf-breadcrumbs lang="it">'));
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Percorso');
  });

  it('has no axe violations', async () => {
    await fixture(`<main>${markup}</main>`);
    await new Promise((resolve) => setTimeout(resolve));
    expect(await axeViolations()).toEqual([]);
  });
});
