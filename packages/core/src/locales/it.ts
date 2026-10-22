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
  progress: 'Avanzamento',
  loading: 'Caricamento',
  breadcrumb: 'Percorso',
  chooseFiles: 'Scegli i file',
  chooseFile: 'Scegli un file',
  dropFiles: 'o trascinali qui',
  dropFile: 'o trascinalo qui',
  removeFile: 'Rimuovi {name}',
  fileTooLarge: '{name} supera {size}.',
  fileTypeRejected: '{name} non è un tipo di file accettato.',
  chooseDates: 'Scegli le date',
  startDate: 'Data di inizio',
  endDate: 'Data di fine',
  rangeIncomplete: 'Inserisci sia la data di inizio sia quella di fine.',
  endBeforeStart: 'La data di fine non può essere prima di quella di inizio.',
};

export default it;
