import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { resetTranslations, setTranslations } from '../../internal/i18n.js';
import { axeViolations, fixture } from '../../test-utils.js';
import './file-upload.js';
import type { UfFileUpload } from './file-upload.js';

const root = (el: UfFileUpload) => el.shadowRoot!;
const native = (el: UfFileUpload) => root(el).querySelector<HTMLInputElement>('.native')!;
const listed = (el: UfFileUpload) => [...root(el).querySelectorAll('.name')].map((n) => n.textContent);
const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

/** Picks files as the native file picker would. */
async function pick(el: UfFileUpload, ...files: File[]) {
  const data = new DataTransfer();
  for (const f of files) data.items.add(f);
  native(el).files = data.files;
  native(el).dispatchEvent(new Event('change', { bubbles: true }));
  await el.updateComplete;
}

/** Drops files on the drop zone. */
async function drop(el: UfFileUpload, ...files: File[]) {
  const data = new DataTransfer();
  for (const f of files) data.items.add(f);
  const zone = root(el).querySelector('[part="dropzone"]')!;
  zone.dispatchEvent(new DragEvent('dragover', { dataTransfer: data, bubbles: true, cancelable: true }));
  zone.dispatchEvent(new DragEvent('drop', { dataTransfer: data, bubbles: true, cancelable: true }));
  await el.updateComplete;
}

afterEach(() => {
  document.body.innerHTML = '';
  resetTranslations();
});

describe('uf-file-upload', () => {
  it('lists picked files and submits them with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-file-upload name="docs" label="Documents" multiple></uf-file-upload></form>');
    const el = form.querySelector('uf-file-upload')!;
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    await pick(el, file('report.pdf', 'application/pdf'), file('photo.png', 'image/png'));
    expect(listed(el)).toEqual(['report.pdf', 'photo.png']);
    expect(new FormData(form).getAll('docs').map((f) => (f as File).name)).toEqual(['report.pdf', 'photo.png']);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('takes dropped files', async () => {
    const el = await fixture<UfFileUpload>('<uf-file-upload label="Photo"></uf-file-upload>');
    await drop(el, file('a.png', 'image/png'));
    expect(el.files.map((f) => f.name)).toEqual(['a.png']);
  });

  it('keeps one file without multiple, the last one picked', async () => {
    const el = await fixture<UfFileUpload>('<uf-file-upload label="Photo"></uf-file-upload>');
    await pick(el, file('a.png', 'image/png'));
    await pick(el, file('b.png', 'image/png'));
    expect(listed(el)).toEqual(['b.png']);
  });

  it('adds up files with multiple, keeping the same file once', async () => {
    const el = await fixture<UfFileUpload>('<uf-file-upload label="Docs" multiple></uf-file-upload>');
    await pick(el, file('a.pdf', 'application/pdf'));
    await pick(el, file('b.pdf', 'application/pdf'), file('a.pdf', 'application/pdf'));
    expect(listed(el)).toEqual(['b.pdf', 'a.pdf']);
  });

  it('refuses files that accept rules out, or larger than max-size, and says why', async () => {
    const el = await fixture<UfFileUpload>('<uf-file-upload lang="en" label="Images" multiple accept="image/*, .pdf" max-size="1000"></uf-file-upload>');
    await pick(el, file('ok.png', 'image/png'), file('notes.txt', 'text/plain'), file('big.pdf', 'application/pdf', 5000));
    expect(listed(el)).toEqual(['ok.png']);
    const message = root(el).querySelector('[part="rejected"]')!.textContent!;
    expect(message).toContain("notes.txt isn't an accepted file type.");
    expect(message).toMatch(/big\.pdf is larger than 1 kB\./);
  });

  it('removes a file, and moves focus to the next remove button', async () => {
    const el = await fixture<UfFileUpload>('<uf-file-upload label="Docs" multiple></uf-file-upload>');
    await pick(el, file('a.pdf', 'application/pdf'), file('b.pdf', 'application/pdf'));
    const remove = root(el).querySelector<HTMLButtonElement>('.remove')!;
    expect(remove.getAttribute('aria-label')).toBe('Remove a.pdf');
    remove.click();
    await el.updateComplete;
    await el.updateComplete;
    expect(listed(el)).toEqual(['b.pdf']);
    expect(root(el).activeElement?.getAttribute('aria-label')).toBe('Remove b.pdf');
  });

  it('is invalid when required and empty, and valid with a file', async () => {
    const el = await fixture<UfFileUpload>('<uf-file-upload name="cv" label="CV" required></uf-file-upload>');
    expect(el.validity.valueMissing).toBe(true);
    expect(el.validationMessage).not.toBe('');
    await pick(el, file('cv.pdf', 'application/pdf'));
    expect(el.checkValidity()).toBe(true);
  });

  it('clears on form reset', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-file-upload name="f" label="F"></uf-file-upload></form>');
    const el = form.querySelector('uf-file-upload')!;
    await pick(el, file('a.png', 'image/png'));
    form.reset();
    await el.updateComplete;
    expect(el.files).toEqual([]);
    expect(new FormData(form).has('f')).toBe(false);
  });

  it('ignores drops when disabled', async () => {
    const el = await fixture<UfFileUpload>('<uf-file-upload label="F" disabled></uf-file-upload>');
    await drop(el, file('a.png', 'image/png'));
    expect(el.files).toEqual([]);
    expect(root(el).querySelector<HTMLButtonElement>('.browse')!.disabled).toBe(true);
  });

  it('translates its texts', async () => {
    setTranslations({ chooseFile: 'Scegli un file', dropFile: 'o trascinalo qui' }, 'it');
    const el = await fixture<UfFileUpload>('<uf-file-upload lang="it" label="Foto"></uf-file-upload>');
    expect(root(el).querySelector('.browse')!.textContent!.trim()).toBe('Scegli un file');
    expect(root(el).querySelector('.dropzone')!.textContent).toContain('o trascinalo qui');
  });

  it('has no axe violations, empty or with files', async () => {
    const el = await fixture<UfFileUpload>('<main><uf-file-upload label="Attachments" hint="PDF, up to 5 MB" multiple></uf-file-upload></main>', 'uf-file-upload');
    expect(await axeViolations()).toEqual([]);
    await pick(el, file('report.pdf', 'application/pdf'));
    expect(await axeViolations()).toEqual([]);
  });
});
