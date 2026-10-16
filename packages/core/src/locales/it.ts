import type { Translations } from '../internal/i18n.js';

/**
 * Every built-in text in Italian.
 *
 * @example
 * import it from '@unframed/core/locales/it';
 * setTranslations(it, 'it');
 */
const it: Translations = {
  close: 'Chiudi',
  dismiss: 'Ignora',
  notifications: 'Notifiche',
  showOptions: 'Mostra opzioni',
  noResults: 'Nessun risultato',
  selectItem: "Seleziona un elemento dell'elenco.",
  oneResult: '1 risultato',
  results: '{count} risultati',
  selectOption: 'Seleziona una di queste opzioni.',
  pagination: 'Paginazione',
  previousPage: 'Pagina precedente',
  nextPage: 'Pagina successiva',
  page: 'Pagina {page}',
  noData: 'Nessun dato',
  invalidValue: 'Valore non valido',
  chooseDate: 'Scegli la data',
  previousMonth: 'Mese precedente',
  nextMonth: 'Mese successivo',
  invalidDate: 'Inserisci una data come {example}.',
  dateTooEarly: 'Scegli il {date} o una data successiva.',
  dateTooLate: 'Scegli il {date} o una data precedente.',
  dateUnavailable: 'Questa data non è disponibile.',
  dayPlaceholder: 'gg',
  monthPlaceholder: 'mm',
  yearPlaceholder: 'aaaa',
};

export default it;
