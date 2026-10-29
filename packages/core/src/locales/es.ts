import type { Translations } from '../internal/i18n.js';

/**
 * Every built-in text in Spanish.
 *
 * @example
 * import es from '@unframed/core/locales/es';
 * setTranslations(es, 'es');
 */
const es: Translations = {
  close: 'Cerrar',
  dismiss: 'Descartar',
  notifications: 'Notificaciones',
  showOptions: 'Mostrar opciones',
  noResults: 'No hay resultados',
  selectItem: 'Selecciona un elemento de la lista.',
  oneResult: '1 resultado',
  results: '{count} resultados',
  selectOption: 'Selecciona una de estas opciones.',
  pagination: 'Paginación',
  previousPage: 'Página anterior',
  nextPage: 'Página siguiente',
  page: 'Página {page}',
  noData: 'No hay datos',
  invalidValue: 'Valor no válido',
  chooseDate: 'Elegir fecha',
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  invalidDate: 'Introduce una fecha como {example}.',
  dateTooEarly: 'Elige el {date} o una fecha posterior.',
  dateTooLate: 'Elige el {date} o una fecha anterior.',
  dateUnavailable: 'Esta fecha no está disponible.',
  dayPlaceholder: 'dd',
  monthPlaceholder: 'mm',
  yearPlaceholder: 'aaaa',
  progress: 'Progreso',
  loading: 'Cargando',
  breadcrumb: 'Ruta de navegación',
  chooseFiles: 'Elegir archivos',
  chooseFile: 'Elegir un archivo',
  dropFiles: 'o arrástralos aquí',
  dropFile: 'o arrástralo aquí',
  removeFile: 'Quitar {name}',
  fileTooLarge: '{name} supera {size}.',
  fileTypeRejected: '{name} no es un tipo de archivo aceptado.',
  chooseDates: 'Elegir fechas',
  startDate: 'Fecha de inicio',
  endDate: 'Fecha de fin',
  rangeIncomplete: 'Introduce una fecha de inicio y una de fin.',
  endBeforeStart: 'La fecha de fin no puede ser anterior a la de inicio.',
  decrease: 'Disminuir',
  increase: 'Aumentar',
};

export default es;
