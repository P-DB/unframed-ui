import type { Translations } from '../internal/i18n.js';

/**
 * Every built-in text in Portuguese.
 *
 * @example
 * import pt from '@unframed/core/locales/pt';
 * setTranslations(pt, 'pt');
 */
const pt: Translations = {
  close: 'Fechar',
  dismiss: 'Dispensar',
  notifications: 'Notificações',
  showOptions: 'Mostrar opções',
  noResults: 'Nenhum resultado',
  selectItem: 'Selecione um item da lista.',
  oneResult: '1 resultado',
  results: '{count} resultados',
  selectOption: 'Selecione uma destas opções.',
  pagination: 'Paginação',
  previousPage: 'Página anterior',
  nextPage: 'Próxima página',
  page: 'Página {page}',
  noData: 'Sem dados',
  invalidValue: 'Valor inválido',
  chooseDate: 'Escolher data',
  previousMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',
  invalidDate: 'Insira uma data como {example}.',
  dateTooEarly: 'Escolha {date} ou uma data posterior.',
  dateTooLate: 'Escolha {date} ou uma data anterior.',
  dateUnavailable: 'Esta data não está disponível.',
  dayPlaceholder: 'dd',
  monthPlaceholder: 'mm',
  yearPlaceholder: 'aaaa',
  progress: 'Progresso',
  loading: 'Carregando',
  breadcrumb: 'Trilha de navegação',
  chooseFiles: 'Escolher arquivos',
  chooseFile: 'Escolher um arquivo',
  dropFiles: 'ou arraste-os para cá',
  dropFile: 'ou arraste-o para cá',
  removeFile: 'Remover {name}',
  fileTooLarge: '{name} é maior que {size}.',
  fileTypeRejected: '{name} não é um tipo de arquivo aceito.',
  chooseDates: 'Escolher datas',
  startDate: 'Data de início',
  endDate: 'Data de término',
  rangeIncomplete: 'Insira uma data de início e uma de término.',
  endBeforeStart: 'A data de término não pode ser anterior à de início.',
};

export default pt;
