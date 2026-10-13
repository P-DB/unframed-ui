import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './pagination.js';
import type { UfPagination } from './pagination.js';

/** The visible items: page numbers, "…" for ellipses. */
const items = (el: UfPagination) =>
  [...el.shadowRoot!.querySelectorAll('li')].slice(1, -1).map((li) => li.textContent!.trim());
const pageButton = (el: UfPagination, page: number) => el.shadowRoot!.querySelector<HTMLButtonElement>(`[aria-label="Page ${page}"]`)!;
const arrow = (el: UfPagination, which: 'Previous' | 'Next') =>
  el.shadowRoot!.querySelector<HTMLButtonElement>(`[aria-label="${which} page"]`)!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-pagination', () => {
  it('shows every page when they fit', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="5" page="2"></uf-pagination>');
    expect(items(el)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('collapses long ranges into the ends, the current page and its siblings', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="20" page="10"></uf-pagination>');
    expect(items(el)).toEqual(['1', '…', '9', '10', '11', '…', '20']);
  });

  it('keeps the same number of items near the ends', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="20" page="1"></uf-pagination>');
    expect(items(el)).toEqual(['1', '2', '3', '4', '5', '…', '20']);
    el.page = 20;
    await el.updateComplete;
    expect(items(el)).toEqual(['1', '…', '16', '17', '18', '19', '20']);
  });

  it('shows more pages around the current one with siblings', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="20" page="10" siblings="2"></uf-pagination>');
    expect(items(el)).toEqual(['1', '…', '8', '9', '10', '11', '12', '…', '20']);
  });

  it('marks the current page', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="5" page="3"></uf-pagination>');
    expect(pageButton(el, 3).getAttribute('aria-current')).toBe('page');
    expect(pageButton(el, 2).getAttribute('aria-current')).toBe('false');
  });

  it('changes page and fires uf-page-change on click', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="5" page="1"></uf-pagination>');
    const onChange = vi.fn();
    el.addEventListener('uf-page-change', onChange);
    pageButton(el, 4).click();
    await el.updateComplete;
    expect(el.page).toBe(4);
    expect(onChange.mock.calls[0][0].detail).toEqual({ page: 4 });

    arrow(el, 'Next').click();
    arrow(el, 'Previous').click();
    expect(onChange.mock.calls.map(([e]) => e.detail.page)).toEqual([4, 5, 4]);
  });

  it('does nothing when clicking the current page', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="5" page="2"></uf-pagination>');
    const onChange = vi.fn();
    el.addEventListener('uf-page-change', onChange);
    pageButton(el, 2).click();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables previous on the first page and next on the last', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="3" page="1"></uf-pagination>');
    expect(arrow(el, 'Previous').disabled).toBe(true);
    expect(arrow(el, 'Next').disabled).toBe(false);
    el.page = 3;
    await el.updateComplete;
    expect(arrow(el, 'Previous').disabled).toBe(false);
    expect(arrow(el, 'Next').disabled).toBe(true);
  });

  it('keeps an out-of-range page within the pages', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="4" page="9"></uf-pagination>');
    expect(pageButton(el, 4).getAttribute('aria-current')).toBe('page');
  });

  it('keeps focus on the button you clicked', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="20" page="1"></uf-pagination>');
    const button = pageButton(el, 4);
    button.focus();
    button.click();
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement?.getAttribute('aria-label')).toBe('Page 4');
  });

  it('names the navigation', async () => {
    const el = await fixture<UfPagination>('<uf-pagination pages="3" label="Results pages"></uf-pagination>');
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Results pages');
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-pagination pages="20" page="10"></uf-pagination><uf-pagination pages="3" size="sm" label="Comments pages"></uf-pagination></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
