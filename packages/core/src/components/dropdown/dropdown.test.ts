import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, press, settle } from '../../test-utils.js';
import '../button/button.js';
import './dropdown.js';
import type { UfDropdown } from './dropdown.js';

const markup = `
  <main style="padding: 40px">
    <uf-dropdown>
      <uf-button slot="trigger">Actions</uf-button>
      <uf-menu label="Actions">
        <uf-menu-item value="edit">Edit</uf-menu-item>
        <uf-menu-item value="duplicate">Duplicate</uf-menu-item>
        <uf-menu-item value="archive" disabled>Archive</uf-menu-item>
        <hr />
        <uf-menu-item value="pin" type="checkbox">Pin</uf-menu-item>
        <uf-menu-item value="delete">Delete</uf-menu-item>
      </uf-menu>
    </uf-dropdown>
  </main>`;

async function setup() {
  const dropdown = await fixture<UfDropdown>(markup, 'uf-dropdown');
  await settle();
  const trigger = dropdown.querySelector('uf-button')!;
  const items = [...dropdown.querySelectorAll('uf-menu-item')];
  const open = async () => {
    trigger.click();
    await dropdown.updateComplete;
  };
  return { dropdown, trigger, items, open };
}

const tick = () => new Promise((r) => setTimeout(r, 20));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-dropdown / uf-menu', () => {
  it('exposes menu-button semantics', async () => {
    const { dropdown, trigger, items } = await setup();
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(dropdown.querySelector('uf-menu')!.getAttribute('role')).toBe('menu');
    expect(items[0].getAttribute('role')).toBe('menuitem');
    expect(items[3].getAttribute('role')).toBe('menuitemcheckbox');
    expect(items[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('opens on click and focuses the first item', async () => {
    const { trigger, items, open } = await setup();
    await open();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(items[0]);
  });

  it('opens on ArrowUp from the trigger and focuses the last item', async () => {
    const { dropdown, trigger, items } = await setup();
    press(trigger, 'ArrowUp');
    await dropdown.updateComplete;
    expect(dropdown.open).toBe(true);
    expect(document.activeElement).toBe(items[4]);
  });

  it('moves with arrows, skips disabled items and wraps', async () => {
    const { items, open } = await setup();
    await open();
    press(items[0], 'ArrowDown');
    expect(document.activeElement).toBe(items[1]);
    press(items[1], 'ArrowDown');
    expect(document.activeElement).toBe(items[3]);
    press(items[3], 'End');
    expect(document.activeElement).toBe(items[4]);
    press(items[4], 'ArrowDown');
    expect(document.activeElement).toBe(items[0]);
  });

  it('jumps to items by typing their first letter', async () => {
    const { items, open } = await setup();
    await open();
    press(items[0], 'd');
    expect(document.activeElement).toBe(items[1]);
    press(items[1], 'd');
    expect(document.activeElement).toBe(items[4]);
  });

  it('emits uf-select, closes and refocuses the trigger', async () => {
    const { dropdown, trigger, items, open } = await setup();
    const onSelect = vi.fn();
    dropdown.addEventListener('uf-select', onSelect);
    await open();
    press(items[1], 'Enter');
    await dropdown.updateComplete;
    await tick();
    expect(onSelect.mock.calls[0][0].detail.value).toBe('duplicate');
    expect(dropdown.open).toBe(false);
    expect(trigger.matches(':focus-within') || document.activeElement === trigger).toBe(true);
  });

  it('keeps the menu open while toggling checkbox items', async () => {
    const { dropdown, items, open } = await setup();
    await open();
    items[3].click();
    await dropdown.updateComplete;
    expect(items[3].checked).toBe(true);
    expect(items[3].getAttribute('aria-checked')).toBe('true');
    expect(dropdown.open).toBe(true);
  });

  it('ignores disabled items', async () => {
    const { dropdown, items, open } = await setup();
    const onSelect = vi.fn();
    dropdown.addEventListener('uf-select', onSelect);
    await open();
    items[2].click();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('returns focus to the trigger when closed with focus inside', async () => {
    const { dropdown, trigger, open } = await setup();
    await open();
    dropdown.shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!.hidePopover();
    await tick();
    expect(dropdown.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('has no axe violations when open', async () => {
    const { open } = await setup();
    await open();
    expect(await axeViolations()).toEqual([]);
  });
});
