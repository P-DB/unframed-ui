import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { resetTranslations, setTranslations } from '../internal/i18n.js';
import { fixture } from '../test-utils.js';
import '../components/pagination/pagination.js';
import '../components/date-picker/date-picker.js';
import de from './de.js';
import es from './es.js';
import fr from './fr.js';
import italian from './it.js';
import pt from './pt.js';

const locales = { de, es, fr, it: italian, pt };

afterEach(() => {
  document.body.innerHTML = '';
  resetTranslations();
});

describe('built-in locales', () => {
  for (const [code, strings] of Object.entries(locales)) {
    it(`${code} keeps every placeholder`, () => {
      expect(strings.results).toContain('{count}');
      expect(strings.page).toContain('{page}');
      expect(strings.invalidDate).toContain('{example}');
      expect(strings.dateTooEarly).toContain('{date}');
      expect(strings.dateTooLate).toContain('{date}');
      for (const value of Object.values(strings)) expect(value.trim()).not.toBe('');
    });
  }

  it('translates components where lang matches', async () => {
    setTranslations(italian, 'it');
    setTranslations(de, 'de');
    const el = await fixture('<div><uf-pagination lang="it-CH" pages="3"></uf-pagination><uf-date-picker lang="de" label="Datum"></uf-date-picker></div>');
    const pagination = el.querySelector('uf-pagination')!;
    await pagination.updateComplete;
    expect(pagination.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Paginazione');
    const picker = el.querySelector('uf-date-picker')!;
    await picker.updateComplete;
    expect(picker.shadowRoot!.querySelector('input')!.placeholder).toBe('TT.MM.JJJJ');
  });
});
