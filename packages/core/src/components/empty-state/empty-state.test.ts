import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import '../button/button.js';
import './empty-state.js';
import type { UfEmptyState } from './empty-state.js';

const part = (el: UfEmptyState, name: string) => el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-empty-state', () => {
  it('shows an icon, a heading and the explanation', async () => {
    const el = await fixture<UfEmptyState>('<uf-empty-state heading="No projects yet">Create one to get started.</uf-empty-state>');
    expect(part(el, 'icon').hidden).toBe(false);
    expect(part(el, 'icon').querySelector('uf-icon')?.getAttribute('name')).toBe('inbox');
    expect(part(el, 'heading').textContent?.trim()).toBe('No projects yet');
    expect(el.textContent).toContain('Create one');
    expect(part(el, 'actions').hidden).toBe(true);
  });

  it('takes another icon, or none', async () => {
    const search = await fixture<UfEmptyState>('<uf-empty-state icon="search">No results.</uf-empty-state>');
    expect(part(search, 'icon').querySelector('uf-icon')?.getAttribute('name')).toBe('search');
    const none = await fixture<UfEmptyState>('<uf-empty-state icon="">No results.</uf-empty-state>');
    expect(part(none, 'icon').hidden).toBe(true);
  });

  it('shows actions, and a heading element from the slot', async () => {
    const el = await fixture<UfEmptyState>(`
      <uf-empty-state>
        <h2 slot="heading">No invoices</h2>
        Invoices you send appear here.
        <uf-button slot="actions">New invoice</uf-button>
      </uf-empty-state>`);
    expect(part(el, 'heading').hidden).toBe(false);
    expect(part(el, 'actions').hidden).toBe(false);
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-empty-state heading="No projects yet">Create one.<uf-button slot="actions">New project</uf-button></uf-empty-state></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
