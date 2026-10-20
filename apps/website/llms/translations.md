# Translations

Components have a few built-in texts (a dialog's close button, "No results"…), in English. Replace them with `setTranslations()` from `@unframed/core`; keys left out stay English. Components already on the page update at once. Native validation messages (required, invalid email…) come from the browser in the user's language.

## Built-in languages

Italian, French, German, Spanish and Portuguese ship with the library, one file per language, so your bundle only has the ones you import:

```js
import { setTranslations } from '@unframed/core';
import it from '@unframed/core/locales/it';
import fr from '@unframed/core/locales/fr';

setTranslations(it, 'it');
setTranslations(fr, 'fr');
```

Codes: `it`, `fr`, `de`, `es`, `pt`. Change a few texts on top with another call: `setTranslations({ close: 'Esci' }, 'it')`.

## Your own texts

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
| `oneResult` | 1 result | Combobox, announced while typing |
| `results` | {count} results | Combobox, announced while typing; must contain `{count}` |
| `selectOption` | Please select one of these options. | Radio group error when required |
| `pagination` | Pagination | Pagination navigation, unless `label` is set |
| `previousPage` | Previous page | Pagination previous button |
| `nextPage` | Next page | Pagination next button |
| `page` | Page {page} | Each page button; must contain `{page}` |
| `noData` | No data | Table with no rows, unless the `empty` slot is used |
| `invalidValue` | Invalid value | Form controls, invalid value without its own message |
| `chooseDate` | Choose date | Date picker calendar button |
| `previousMonth` | Previous month | Calendar previous month button |
| `nextMonth` | Next month | Calendar next month button |
| `invalidDate` | Enter a date like {example}. | Date picker, text that isn't a date; must contain `{example}` |
| `dateTooEarly` | Choose {date} or later. | Date picker, before `min`; must contain `{date}` |
| `dateTooLate` | Choose {date} or earlier. | Date picker, after `max`; must contain `{date}` |
| `dateUnavailable` | This date is not available. | Date picker, ruled out by `isDateDisabled` |
| `dayPlaceholder`, `monthPlaceholder`, `yearPlaceholder` | dd, mm, yyyy | Date picker placeholder, in the language's date order |
| `progress` | Progress | Progress bar, unless `label` is set |
| `loading` | Loading | Spinner, unless `label` is set |
| `breadcrumb` | Breadcrumb | Breadcrumbs navigation, unless `label` is set |

Month and weekday names, date formats and the first day of the week come from the browser (Intl), for the nearest `lang`.
