import { afterEach, describe, expect, it } from 'vitest';
import '../index.js';
import { fixture, settle } from '../test-utils.js';
import { resetTranslations, setTranslations } from './i18n.js';

const closeLabel = (dialog: Element) => dialog.shadowRoot!.querySelector('.close')!.getAttribute('aria-label');
const pageLabels = (pagination: Element) =>
  [...pagination.shadowRoot!.querySelectorAll('button')].map((b) => b.getAttribute('aria-label'));

afterEach(() => {
  resetTranslations();
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('lang');
});

describe('translations', () => {
  it('is English by default', async () => {
    const dialog = await fixture('<uf-dialog label="Hi"></uf-dialog>');
    expect(closeLabel(dialog)).toBe('Close');
  });

  it('replaces the text everywhere, and updates components already on the page', async () => {
    const dialog = await fixture('<uf-dialog label="Hi"></uf-dialog>');
    setTranslations({ close: 'Chiudi' });
    await settle();
    expect(closeLabel(dialog)).toBe('Chiudi');
  });

  it('keeps English for the keys that are left out', async () => {
    setTranslations({ close: 'Chiudi' });
    const pagination = await fixture('<uf-pagination pages="2"></uf-pagination>');
    expect(pageLabels(pagination)[0]).toBe('Previous page');
  });

  it('fills in placeholders', async () => {
    setTranslations({ page: 'Pagina {page}', previousPage: 'Precedente', nextPage: 'Successiva' });
    const pagination = await fixture('<uf-pagination pages="2"></uf-pagination>');
    expect(pageLabels(pagination)).toEqual(['Precedente', 'Pagina 1', 'Pagina 2', 'Successiva']);
  });

  it('requires the {page} placeholder in the page text (a type error otherwise)', () => {
    // @ts-expect-error: without {page}, the page number would be lost.
    setTranslations({ page: 'Pagina' });
    setTranslations({ page: 'Pagina {page} di 10' });
  });

  it('follows the nearest lang attribute, and mixes languages on a page', async () => {
    setTranslations({ close: 'Chiudi' }, 'it');
    setTranslations({ close: 'Schließen' }, 'de');
    document.documentElement.lang = 'it';
    await fixture('<div><uf-dialog label="A"></uf-dialog><section lang="de"><uf-dialog label="B"></uf-dialog></section></div>');
    const [it, de] = document.querySelectorAll('uf-dialog');
    expect(closeLabel(it)).toBe('Chiudi');
    expect(closeLabel(de)).toBe('Schließen');
  });

  it('updates when lang changes', async () => {
    setTranslations({ close: 'Chiudi' }, 'it');
    setTranslations({ close: 'Fermer' }, 'fr');
    const dialog = await fixture('<uf-dialog label="Hi"></uf-dialog>');
    document.documentElement.lang = 'it';
    await new Promise((r) => setTimeout(r));
    await settle();
    expect(closeLabel(dialog)).toBe('Chiudi');
    document.documentElement.lang = 'fr';
    await new Promise((r) => setTimeout(r));
    await settle();
    expect(closeLabel(dialog)).toBe('Fermer');
  });

  it('falls back from a region to its language, then to the default, then to English', async () => {
    setTranslations({ close: 'Fechar' }, 'pt');
    setTranslations({ dismiss: 'Ignorar' });
    document.documentElement.lang = 'pt-BR';
    const dialog = await fixture('<uf-dialog label="Hi"></uf-dialog>');
    expect(closeLabel(dialog)).toBe('Fechar');

    const { toast } = await import('../components/toast/toast.js');
    const toaster = await fixture('<uf-toaster></uf-toaster>');
    toast('Saved');
    await settle();
    expect(toaster.shadowRoot!.querySelector('.close')!.getAttribute('aria-label')).toBe('Ignorar');
    expect(toaster.shadowRoot!.querySelector('section')!.getAttribute('aria-label')).toBe('Notifications');
  });

  it('matches language codes case-insensitively', async () => {
    setTranslations({ close: 'Fechar' }, 'PT-br');
    document.documentElement.lang = 'pt-BR';
    expect(closeLabel(await fixture('<uf-dialog label="Hi"></uf-dialog>'))).toBe('Fechar');
  });

  it('follows the lang outside a shadow root', async () => {
    setTranslations({ close: 'Chiudi' }, 'it');
    const host = await fixture('<div lang="it"></div>');
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<uf-dialog label="Hi"></uf-dialog>';
    const dialog = root.querySelector('uf-dialog')!;
    await (dialog as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(closeLabel(dialog)).toBe('Chiudi');
  });

  it('lets label attributes win over translations', async () => {
    setTranslations({ pagination: 'Paginazione' });
    await fixture('<div><uf-pagination pages="2"></uf-pagination><uf-pagination pages="2" label="Risultati"></uf-pagination></div>');
    const [plain, labelled] = document.querySelectorAll('uf-pagination');
    expect(plain.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Paginazione');
    expect(labelled.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Risultati');
  });

  it('translates visible text: no results and no data', async () => {
    setTranslations({ noResults: 'Nessun risultato', noData: 'Nessun dato' });
    const table = await fixture<HTMLElement & { columns: unknown[] }>('<uf-table label="T"></uf-table>');
    table.columns = [{ key: 'a', label: 'A' }];
    await settle();
    expect(table.shadowRoot!.querySelector('[part="empty"]')!.textContent!.trim()).toBe('Nessun dato');

    const combobox = await fixture('<uf-combobox label="City"><option value="rome">Rome</option></uf-combobox>');
    const input = combobox.shadowRoot!.querySelector('input')!;
    input.value = 'zzz';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await settle();
    expect(combobox.shadowRoot!.querySelector('[part="empty"]')!.textContent!.trim()).toBe('Nessun risultato');
  });

  it('translates validation messages, and updates them with the language', async () => {
    setTranslations({ selectOption: 'Seleziona una di queste opzioni.' }, 'it');
    const group = await fixture<HTMLElement & { validationMessage: string }>(
      '<uf-radio-group label="Plan" required><uf-radio value="a">A</uf-radio></uf-radio-group>',
    );
    expect(group.validationMessage).toBe('Please select one of these options.');
    document.documentElement.lang = 'it';
    await new Promise((r) => setTimeout(r));
    await settle();
    expect(group.validationMessage).toBe('Seleziona una di queste opzioni.');
  });
});
