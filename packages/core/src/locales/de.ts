import type { Translations } from '../internal/i18n.js';

/**
 * Every built-in text in German.
 *
 * @example
 * import de from '@unframed/core/locales/de';
 * setTranslations(de, 'de');
 */
const de: Translations = {
  close: 'Schließen',
  dismiss: 'Ausblenden',
  notifications: 'Benachrichtigungen',
  showOptions: 'Optionen anzeigen',
  noResults: 'Keine Ergebnisse',
  selectItem: 'Bitte wählen Sie einen Eintrag aus der Liste aus.',
  oneResult: '1 Ergebnis',
  results: '{count} Ergebnisse',
  selectOption: 'Bitte wählen Sie eine dieser Optionen aus.',
  pagination: 'Seitennavigation',
  previousPage: 'Vorherige Seite',
  nextPage: 'Nächste Seite',
  page: 'Seite {page}',
  noData: 'Keine Daten',
  invalidValue: 'Ungültiger Wert',
  chooseDate: 'Datum auswählen',
  previousMonth: 'Vorheriger Monat',
  nextMonth: 'Nächster Monat',
  invalidDate: 'Geben Sie ein Datum wie {example} ein.',
  dateTooEarly: 'Wählen Sie den {date} oder ein späteres Datum.',
  dateTooLate: 'Wählen Sie den {date} oder ein früheres Datum.',
  dateUnavailable: 'Dieses Datum ist nicht verfügbar.',
  dayPlaceholder: 'TT',
  monthPlaceholder: 'MM',
  yearPlaceholder: 'JJJJ',
};

export default de;
