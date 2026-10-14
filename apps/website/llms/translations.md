# Translations

Components have a few built-in texts (a dialog's close button, "No results"…), in English. Replace them with `setTranslations()` from `@unframed/core`; keys left out stay English. Components already on the page update at once. Native validation messages (required, invalid email…) come from the browser in the user's language.

## One language

```js
import { setTranslations } from '@unframed/core';

setTranslations({ close: 'Chiudi', noResults: 'Nessun risultato', page: 'Pagina {page}' });
```

## Several languages

Register each under its code; each component uses the nearest `lang` attribute. `pt-BR` falls back to `pt`, then to the strings registered without a code, then English.

```js
setTranslations({ close: 'Chiudi', page: 'Pagina {page}' }, 'it');
setTranslations({ close: 'Fermer', page: 'Page {page}' }, 'fr');
document.documentElement.lang = 'fr'; // components update
```

## Keys

| Key | English | Where |
|---|---|---|
| `close` | Close | Dialog close button |
| `dismiss` | Dismiss | Toast dismiss button |
| `notifications` | Notifications | Toaster region, unless `label` is set |
| `showOptions` | Show options | Combobox arrow button |
| `noResults` | No results | Combobox, no match |
| `selectItem` | Please select an item in the list. | Combobox error when required |
| `selectOption` | Please select one of these options. | Radio group error when required |
| `pagination` | Pagination | Pagination navigation, unless `label` is set |
| `previousPage` | Previous page | Pagination previous button |
| `nextPage` | Next page | Pagination next button |
| `page` | Page {page} | Each page button; must contain `{page}` |
| `noData` | No data | Table with no rows, unless the `empty` slot is used |
| `invalidValue` | Invalid value | Form controls, invalid value without its own message |
