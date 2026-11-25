import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cdp, server, userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { fixture } from './test-utils.js';
import './index.js';

// Windows high contrast: the OS forces its own colors, dropping backgrounds, shadows and
// gradients. States and focus must still show, in system colors. Chromium can emulate it.
const emulate = (value: 'active' | 'none') =>
  cdp().send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value }] });

/** A system color as the browser computes it, e.g. Highlight in the emulated palette. */
function systemColor(name: string): string {
  const probe = document.createElement('div');
  probe.style.color = name;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

const part = (host: Element, selector: string) => host.shadowRoot!.querySelector(selector)!;

describe.runIf(server.browser === 'chromium')('forced colors', () => {
  let highlight: string;

  beforeAll(async () => {
    await emulate('active');
    expect(matchMedia('(forced-colors: active)').matches).toBe(true);
    highlight = systemColor('Highlight');
  });

  afterAll(async () => {
    await emulate('none');
    document.body.innerHTML = '';
  });

  it('fills a checked switch and its thumb, and outlines an unchecked one', async () => {
    await fixture('<uf-switch checked>On</uf-switch><uf-switch>Off</uf-switch>');
    const [on, off] = document.querySelectorAll('uf-switch');
    expect(getComputedStyle(part(on!, '.native')).backgroundColor).toBe(highlight);
    expect(getComputedStyle(part(on!, '.thumb')).backgroundColor).toBe(systemColor('HighlightText'));
    expect(getComputedStyle(part(off!, '.native')).borderTopStyle).toBe('solid');
    expect(getComputedStyle(part(off!, '.thumb')).backgroundColor).toBe(systemColor('CanvasText'));
  });

  it('fills checked and indeterminate checkboxes, and shows the mark', async () => {
    await fixture('<uf-checkbox checked>A</uf-checkbox><uf-checkbox indeterminate>B</uf-checkbox><uf-checkbox>C</uf-checkbox>');
    const [checked, mixed, unchecked] = document.querySelectorAll('uf-checkbox');
    expect(getComputedStyle(part(checked!, '.native')).backgroundColor).toBe(highlight);
    expect(getComputedStyle(part(mixed!, '.native')).backgroundColor).toBe(highlight);
    expect(getComputedStyle(part(unchecked!, '.native')).backgroundColor).not.toBe(highlight);
    expect(getComputedStyle(part(checked!, '.icon')).color).toBe(systemColor('HighlightText'));
  });

  it('marks the checked radio with the selection color', async () => {
    await fixture('<uf-radio-group label="Plan" value="pro"><uf-radio value="free">Free</uf-radio><uf-radio value="pro">Pro</uf-radio></uf-radio-group>');
    const [free, pro] = document.querySelectorAll('uf-radio');
    expect(getComputedStyle(part(pro!, '.control')).borderTopColor).toBe(highlight);
    expect(getComputedStyle(part(free!, '.control')).borderTopColor).not.toBe(highlight);
  });

  it('fills the selected segment and the current page, with no backplate hiding their text', async () => {
    await fixture(`
      <uf-segmented-control label="View" value="week"><option value="day">Day</option><option value="week">Week</option></uf-segmented-control>
      <uf-pagination pages="5" page="2"></uf-pagination>`);
    const selected = part(document.querySelector('uf-segmented-control')!, '.option.selected');
    expect(getComputedStyle(selected).backgroundColor).toBe(highlight);
    expect(getComputedStyle(selected).forcedColorAdjust).toBe('none');
    const current = part(document.querySelector('uf-pagination')!, '.current');
    expect(getComputedStyle(current).backgroundColor).toBe(highlight);
    expect(getComputedStyle(current).forcedColorAdjust).toBe('none');
  });

  it('underlines the selected tab with the selection color', async () => {
    await fixture(`<uf-tabs>
      <uf-tab panel="a">A</uf-tab><uf-tab panel="b">B</uf-tab>
      <uf-tab-panel name="a">A</uf-tab-panel><uf-tab-panel name="b">B</uf-tab-panel>
    </uf-tabs>`);
    const [selected, other] = document.querySelectorAll('uf-tab');
    expect(selected!.getAttribute('aria-selected')).toBe('true');
    expect(getComputedStyle(selected!, '::after').backgroundColor).toBe(highlight);
    expect(getComputedStyle(selected!, '::after').scale).toBe('1');
    expect(getComputedStyle(other!, '::after').scale).not.toBe('1');
  });

  it('draws the slider track and progress bar, which are gradients and fills', async () => {
    await fixture('<uf-slider label="Volume" value="40"></uf-slider><uf-progress label="Upload" value="45"></uf-progress>');
    const range = part(document.querySelector('uf-slider')!, '.native');
    expect(getComputedStyle(range).forcedColorAdjust).toBe('none');
    // Not adjusted, so the track keeps its gradient, drawn in the selection color.
    expect(getComputedStyle(range).getPropertyValue('--_fill-color').trim()).toBe('Highlight');
    const progress = document.querySelector('uf-progress')!;
    expect(getComputedStyle(part(progress, '.indicator')).backgroundColor).toBe(highlight);
    expect(getComputedStyle(part(progress, '.track')).outlineStyle).toBe('solid');
  });

  it('shows keyboard focus on fields, whose focus shadow is dropped', async () => {
    await fixture('<uf-input label="Name"></uf-input>');
    await userEvent.click(part(document.querySelector('uf-input')!, 'input'));
    const box = part(document.querySelector('uf-input')!, '.box');
    expect(getComputedStyle(box).outlineStyle).toBe('solid');
    expect(getComputedStyle(box).outlineColor).toBe(highlight);
  });

  it('shows the focus ring on buttons', async () => {
    await fixture('<uf-button>Save</uf-button>');
    await userEvent.tab();
    const base = part(document.querySelector('uf-button')!, '.base');
    expect(base.matches(':focus-visible')).toBe(true);
    expect(getComputedStyle(base).outlineStyle).toBe('solid');
    expect(parseFloat(getComputedStyle(base).outlineWidth)).toBeGreaterThan(0);
  });

  it('greys out disabled controls', async () => {
    await fixture('<uf-checkbox disabled>A</uf-checkbox><uf-switch disabled>B</uf-switch>');
    const grey = systemColor('GrayText');
    expect(getComputedStyle(part(document.querySelector('uf-checkbox')!, '.root')).color).toBe(grey);
    expect(getComputedStyle(part(document.querySelector('uf-switch')!, '.thumb')).backgroundColor).toBe(grey);
  });
});
