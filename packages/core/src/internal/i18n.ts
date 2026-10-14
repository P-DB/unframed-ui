import type { ReactiveController, ReactiveControllerHost } from 'lit';

/** Every built-in text, by key. `{page}` is replaced with the page number. */
export interface Translations {
  /** Dialog: the close button's accessible name. */
  close: string;
  /** Toast: the dismiss button's accessible name. */
  dismiss: string;
  /** Toaster: the notification region's accessible name, unless `label` is set. */
  notifications: string;
  /** Combobox: the arrow button's accessible name. */
  showOptions: string;
  /** Combobox: shown when the search matches nothing. */
  noResults: string;
  /** Combobox: error when required and empty. */
  selectItem: string;
  /** Radio group: error when required and empty. */
  selectOption: string;
  /** Pagination: the navigation's accessible name, unless `label` is set. */
  pagination: string;
  /** Pagination: the previous button's accessible name. */
  previousPage: string;
  /** Pagination: the next button's accessible name. */
  nextPage: string;
  /** Pagination: a page button's accessible name. Must contain `{page}`. */
  page: `${string}{page}${string}`;
  /** Table: shown when there are no rows, unless the `empty` slot is used. */
  noData: string;
  /** Form controls: error for an invalid value that has no message of its own. */
  invalidValue: string;
}

const english: Translations = {
  close: 'Close',
  dismiss: 'Dismiss',
  notifications: 'Notifications',
  showOptions: 'Show options',
  noResults: 'No results',
  selectItem: 'Please select an item in the list.',
  selectOption: 'Please select one of these options.',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: 'Page {page}',
  noData: 'No data',
  invalidValue: 'Invalid value',
};

/** Registered translations by lowercase language code; '' applies to every language. */
const registered = new Map<string, Partial<Translations>>();
const hosts = new Set<ReactiveControllerHost>();
let langObserver: MutationObserver | undefined;

const refreshAll = () => hosts.forEach((host) => host.requestUpdate());

/**
 * Replaces the built-in English text of every component. Pass only the keys
 * you want to change; the rest stay in English. Components already on the page
 * update at once.
 *
 * With a language code, the strings apply where the nearest `lang` attribute
 * matches it (`'pt'` also covers `pt-BR`), so a page can switch language by
 * changing `<html lang>`, or mix languages by section. Without one, they apply
 * everywhere no registered language matches.
 *
 * @example setTranslations({ close: 'Chiudi', page: 'Pagina {page}' }, 'it')
 */
export function setTranslations(translations: Partial<Translations>, lang = ''): void {
  const key = lang.toLowerCase();
  registered.set(key, { ...registered.get(key), ...translations });
  refreshAll();
}

/** Forgets every registered translation. For tests. */
export function resetTranslations(): void {
  registered.clear();
  refreshAll();
}

/** The `lang` that applies to an element: the nearest one, across shadow roots. */
function langOf(element: Element): string {
  let node: Element | null = element;
  while (node) {
    const lang = node.closest('[lang]')?.getAttribute('lang');
    if (lang) return lang.toLowerCase();
    const root = node.getRootNode();
    node = root instanceof ShadowRoot ? root.host : null;
  }
  return '';
}

/** The text for a key: the element's language, then its base language, then the default, then English. */
function lookup(element: Element, key: keyof Translations): string {
  const lang = langOf(element);
  const candidates = lang ? [lang, lang.split('-')[0], ''] : [''];
  for (const candidate of candidates) {
    const value = registered.get(candidate)?.[key];
    if (value) return value;
  }
  return english[key];
}

/**
 * Gives a component its built-in text, and re-renders it when translations or
 * the page's `lang` change.
 */
export class Translator implements ReactiveController {
  readonly #host: ReactiveControllerHost & HTMLElement;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.#host = host;
    host.addController(this);
  }

  /** The translated text, with `{name}` placeholders filled in. */
  t(key: keyof Translations, values: Record<string, string | number> = {}): string {
    return lookup(this.#host, key).replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
  }

  hostConnected(): void {
    hosts.add(this.#host);
    if (!langObserver && typeof MutationObserver !== 'undefined') {
      // One observer for the whole document: a `lang` change anywhere re-renders the components.
      langObserver = new MutationObserver(refreshAll);
      langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'], subtree: true });
    }
  }

  hostDisconnected(): void {
    hosts.delete(this.#host);
  }
}
