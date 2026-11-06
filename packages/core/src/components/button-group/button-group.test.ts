import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import '../button/button.js';
import '../tooltip/tooltip.js';
import './button-group.js';
import type { UfButtonGroup } from './button-group.js';

/** The computed style of each button's inner `<button>`, in order. */
const bases = (el: Element) => [...el.querySelectorAll('uf-button')].map((button) => getComputedStyle(button.shadowRoot!.querySelector('.base')!));

const group = (attributes: string, variant = 'outline') => `
  <uf-button-group label="Text style" ${attributes} style="--uf-radius-control: 6px">
    <uf-button variant="${variant}">Bold</uf-button>
    <uf-button variant="${variant}">Italic</uf-button>
    <uf-button variant="${variant}">Underline</uf-button>
  </uf-button-group>`;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-button-group', () => {
  it('rounds only the outer corners, and shares one border between neighbors', async () => {
    const [first, middle, last] = bases(await fixture<UfButtonGroup>(group('')));
    expect([first.borderTopLeftRadius, first.borderTopRightRadius, first.borderBottomRightRadius, first.borderBottomLeftRadius]).toEqual(['6px', '0px', '0px', '6px']);
    expect(middle.borderTopLeftRadius).toBe('0px');
    expect(middle.borderTopRightRadius).toBe('0px');
    expect([last.borderTopLeftRadius, last.borderTopRightRadius, last.borderBottomRightRadius, last.borderBottomLeftRadius]).toEqual(['0px', '6px', '6px', '0px']);
    expect(first.borderLeftWidth).toBe('1px');
    expect(middle.borderLeftWidth).toBe('0px');
    expect(last.borderLeftWidth).toBe('0px');
    expect(last.borderRightWidth).toBe('1px');
  });

  it('draws a line between filled and ghost buttons, and none between outline ones', async () => {
    const filled = bases(await fixture(group('', 'primary')));
    expect(filled[0].boxShadow).toBe('none');
    expect(filled[1].boxShadow).toContain('inset');
    const ghost = bases(await fixture(group('', 'ghost')));
    expect(ghost[1].boxShadow).toContain('inset');
    const outline = bases(await fixture(group('')));
    expect(outline[1].boxShadow).toBe('none');
  });

  it('stacks the buttons when vertical', async () => {
    const el = await fixture<UfButtonGroup>(group('orientation="vertical"'));
    expect(getComputedStyle(el).flexDirection).toBe('column');
    const [first, , last] = bases(el);
    expect([first.borderTopLeftRadius, first.borderTopRightRadius, first.borderBottomLeftRadius]).toEqual(['6px', '6px', '0px']);
    expect([last.borderTopLeftRadius, last.borderBottomLeftRadius, last.borderBottomRightRadius]).toEqual(['0px', '6px', '6px']);
    expect(last.borderTopWidth).toBe('0px');
    expect(last.borderLeftWidth).toBe('1px');
  });

  it('mirrors the corners and borders right to left', async () => {
    document.documentElement.dir = 'rtl';
    try {
      const [first, , last] = bases(await fixture(group('')));
      expect([first.borderTopLeftRadius, first.borderTopRightRadius]).toEqual(['0px', '6px']);
      expect([last.borderTopLeftRadius, last.borderTopRightRadius]).toEqual(['6px', '0px']);
      expect(last.borderRightWidth).toBe('0px');
      expect(last.borderLeftWidth).toBe('1px');
    } finally {
      document.documentElement.removeAttribute('dir');
    }
  });

  it('joins buttons wrapped in a tooltip', async () => {
    const el = await fixture(`
      <uf-button-group label="History" style="--uf-radius-control: 6px">
        <uf-tooltip content="Undo"><uf-button variant="outline">Undo</uf-button></uf-tooltip>
        <uf-tooltip content="Redo"><uf-button variant="outline">Redo</uf-button></uf-tooltip>
      </uf-button-group>`);
    const [first, last] = bases(el);
    expect(first.borderTopRightRadius).toBe('0px');
    expect(last.borderTopLeftRadius).toBe('0px');
    expect(last.borderLeftWidth).toBe('0px');
  });

  it('keeps the corners of a button on its own', async () => {
    const [only] = bases(await fixture('<uf-button-group label="Save" style="--uf-radius-control: 6px"><uf-button>Save</uf-button></uf-button-group>'));
    expect(only.borderTopLeftRadius).toBe('6px');
    expect(only.borderTopRightRadius).toBe('6px');
  });

  it('is a labelled group', async () => {
    const el = await fixture<UfButtonGroup>(group(''));
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('Text style');
    el.label = undefined;
    await el.updateComplete;
    expect(el.hasAttribute('aria-label')).toBe(false);
    expect(await axeViolations()).toEqual([]);
  });
});
