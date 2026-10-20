import type { Translations } from '../internal/i18n.js';

/**
 * Every built-in text in French.
 *
 * @example
 * import fr from '@unframed/core/locales/fr';
 * setTranslations(fr, 'fr');
 */
const fr: Translations = {
  close: 'Fermer',
  dismiss: 'Ignorer',
  notifications: 'Notifications',
  showOptions: 'Afficher les options',
  noResults: 'Aucun résultat',
  selectItem: 'Veuillez sélectionner un élément de la liste.',
  oneResult: '1 résultat',
  results: '{count} résultats',
  selectOption: "Veuillez sélectionner l'une de ces options.",
  pagination: 'Pagination',
  previousPage: 'Page précédente',
  nextPage: 'Page suivante',
  page: 'Page {page}',
  noData: 'Aucune donnée',
  invalidValue: 'Valeur non valide',
  chooseDate: 'Choisir une date',
  previousMonth: 'Mois précédent',
  nextMonth: 'Mois suivant',
  invalidDate: 'Saisissez une date comme {example}.',
  dateTooEarly: 'Choisissez le {date} ou une date ultérieure.',
  dateTooLate: 'Choisissez le {date} ou une date antérieure.',
  dateUnavailable: "Cette date n'est pas disponible.",
  dayPlaceholder: 'jj',
  monthPlaceholder: 'mm',
  yearPlaceholder: 'aaaa',
  progress: 'Progression',
  loading: 'Chargement',
  breadcrumb: "Fil d'Ariane",
};

export default fr;
