import { afterEach, describe, expect, it } from 'vitest';
import tokens from '@unframed/tokens/tokens.css?raw';
import manifest from '../../custom-elements.json';
import '@unframed/tokens/tokens.css';

afterEach(() => {
  document.body.innerHTML = '';
});

// tokens.css hides components until their JavaScript loads, so server-rendered
// pages don't flash raw content (a closed dialog's text, a select's options).
describe('styles before the components load', () => {
  it('cover every component', () => {
    const rule = /:where\(([^)]*)\):not\(:defined\) \{\s*visibility: hidden;/.exec(tokens)?.[1] ?? '';
    const listed = new Set(rule.split(',').map((tag) => tag.trim()));
    const tags = manifest.modules.flatMap((mod) => (mod.declarations ?? []).flatMap((d) => ('tagName' in d && d.tagName ? [d.tagName] : [])));
    expect(tags.filter((tag) => !listed.has(tag))).toEqual([]);
  });

  it('hide content that only shows once opened, and keep the rest in place', () => {
    // Tags never defined in this file: as on a server-rendered page before the code loads.
    document.body.innerHTML = `
      <uf-dialog label="Hi"><p id="dialog-text">Hello</p></uf-dialog>
      <uf-select label="Country"><option id="option">Italy</option></uf-select>
      <uf-dropdown><button slot="trigger" id="trigger">Actions</button><div id="menu">Edit</div></uf-dropdown>`;
    const display = (id: string) => getComputedStyle(document.getElementById(id)!).display;
    expect(getComputedStyle(document.querySelector('uf-dialog')!).display).toBe('none');
    expect(display('option')).toBe('none');
    expect(display('menu')).toBe('none');
    expect(display('trigger')).not.toBe('none');
    expect(getComputedStyle(document.getElementById('trigger')!).visibility).toBe('hidden');
  });
});
