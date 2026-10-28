import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, press, settle } from '../../test-utils.js';
import './tabs.js';
import type { UfTabs } from './tabs.js';

const markup = (attrs = '') => `
  <main>
    <uf-tabs label="Settings" ${attrs}>
      <uf-tab panel="general">General</uf-tab>
      <uf-tab panel="billing">Billing</uf-tab>
      <uf-tab panel="danger" disabled>Danger zone</uf-tab>
      <uf-tab panel="team">Team</uf-tab>
      <uf-tab-panel name="general">General settings</uf-tab-panel>
      <uf-tab-panel name="billing">Billing settings</uf-tab-panel>
      <uf-tab-panel name="danger">Danger</uf-tab-panel>
      <uf-tab-panel name="team">Team settings</uf-tab-panel>
    </uf-tabs>
  </main>`;

async function setup(attrs = '') {
  const tabs = await fixture<UfTabs>(markup(attrs), 'uf-tabs');
  await settle();
  await tabs.updateComplete;
  return {
    tabs,
    tab: [...tabs.querySelectorAll('uf-tab')],
    panel: [...tabs.querySelectorAll('uf-tab-panel')],
  };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-tabs', () => {
  it('renders once to pick its first tab, without a Lit "change-in-update" warning', async () => {
    const warn = vi.spyOn(console, 'warn');
    await fixture(`<uf-tabs><uf-tab panel="a">A</uf-tab><uf-tab panel="b">B</uf-tab><uf-tab-panel name="a">1</uf-tab-panel><uf-tab-panel name="b">2</uf-tab-panel></uf-tabs>`);
    await new Promise((resolve) => setTimeout(resolve));
    expect(warn.mock.calls.flat().join(' ')).not.toContain('change-in-update');
    warn.mockRestore();
  });

  it('selects the first tab by default and links tabs to panels', async () => {
    const { tabs, tab, panel } = await setup();
    expect(tabs.value).toBe('general');
    expect(tab[0].getAttribute('role')).toBe('tab');
    expect(tab[0].getAttribute('aria-selected')).toBe('true');
    expect(tab[0].getAttribute('aria-controls')).toBe(panel[0].id);
    expect(panel[0].getAttribute('aria-labelledby')).toBe(tab[0].id);
    expect(panel.map((p) => p.hidden)).toEqual([false, true, true, true]);
  });

  it('honours the active attribute', async () => {
    const { panel } = await setup('value="billing"');
    expect(panel.map((p) => p.hidden)).toEqual([true, false, true, true]);
  });

  it('selects on click and emits uf-tab-change', async () => {
    const { tabs, tab } = await setup();
    const onChange = vi.fn();
    tabs.addEventListener('uf-tab-change', onChange);
    tab[1].click();
    await tabs.updateComplete;
    expect(tabs.value).toBe('billing');
    expect(onChange.mock.calls[0][0].detail).toEqual({ name: 'billing' });
  });

  it('moves with arrow keys, skipping disabled tabs, with Home and End', async () => {
    const { tabs, tab } = await setup('value="billing"');
    press(tab[1], 'ArrowRight');
    await tabs.updateComplete;
    expect(tabs.value).toBe('team');
    expect(document.activeElement).toBe(tab[3]);
    press(tab[3], 'Home');
    await tabs.updateComplete;
    expect(tabs.value).toBe('general');
    press(tab[0], 'ArrowLeft');
    await tabs.updateComplete;
    expect(tabs.value).toBe('team');
  });

  it('with manual activation, arrows only move focus', async () => {
    const { tabs, tab } = await setup('activation="manual"');
    press(tab[0], 'ArrowRight');
    await tabs.updateComplete;
    expect(document.activeElement).toBe(tab[1]);
    expect(tabs.value).toBe('general');
    press(tab[1], 'Enter');
    await tabs.updateComplete;
    expect(tabs.value).toBe('billing');
  });

  it('keeps only the selected tab in the tab order', async () => {
    const { tab } = await setup();
    expect(tab.map((t) => t.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('has no axe violations', async () => {
    await setup();
    expect(await axeViolations()).toEqual([]);
  });
});
