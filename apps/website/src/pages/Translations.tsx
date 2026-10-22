import { setTranslations, type TableColumn } from '@unframed/core';
import { UfCombobox, UfDialog, UfButton, UfPagination, UfSelect, UfTable } from '@unframed/react';
import { useState } from 'react';
import de from '@unframed/core/locales/de';
import fr from '@unframed/core/locales/fr';
import it from '@unframed/core/locales/it';
import { CodeBlock } from '../components/CodeBlock';

// Registered once, like an app would at startup. They only apply inside the
// demo below, where `lang` is set: the rest of the site stays English.
setTranslations(it, 'it');
setTranslations(fr, 'fr');
setTranslations(de, 'de');

const builtIn = [
  ['Italian', 'it'],
  ['French', 'fr'],
  ['German', 'de'],
  ['Spanish', 'es'],
  ['Portuguese', 'pt'],
];

const keys: [string, string, string][] = [
  ['close', 'Close', 'Dialog: the close button'],
  ['dismiss', 'Dismiss', "Toast: each toast's dismiss button"],
  ['notifications', 'Notifications', 'Toaster: the notification region, unless `label` is set'],
  ['showOptions', 'Show options', 'Combobox: the arrow button'],
  ['noResults', 'No results', 'Combobox: shown when the search matches nothing'],
  ['selectItem', 'Please select an item in the list.', 'Combobox: error when required and empty'],
  ['oneResult', '1 result', 'Combobox: announced while typing, one match'],
  ['results', '{count} results', 'Combobox: announced while typing; must contain `{count}`'],
  ['selectOption', 'Please select one of these options.', 'Radio group: error when required and empty'],
  ['pagination', 'Pagination', 'Pagination: the navigation, unless `label` is set'],
  ['previousPage', 'Previous page', 'Pagination: the previous button'],
  ['nextPage', 'Next page', 'Pagination: the next button'],
  ['page', 'Page {page}', 'Pagination: each page button; must contain `{page}`'],
  ['noData', 'No data', 'Table: shown with no rows, unless the `empty` slot is used'],
  ['invalidValue', 'Invalid value', 'Form controls: an invalid value without a message of its own'],
  ['chooseDate', 'Choose date', "Date picker: the calendar button, and the popup's name without a `label`"],
  ['previousMonth', 'Previous month', 'Calendar: the previous month button'],
  ['nextMonth', 'Next month', 'Calendar: the next month button'],
  ['invalidDate', 'Enter a date like {example}.', 'Date picker: typed text that is not a date; must contain `{example}`'],
  ['dateTooEarly', 'Choose {date} or later.', 'Date picker: a date before `min`; must contain `{date}`'],
  ['dateTooLate', 'Choose {date} or earlier.', 'Date picker: a date after `max`; must contain `{date}`'],
  ['dateUnavailable', 'This date is not available.', 'Date picker: a date ruled out by `isDateDisabled`'],
  ['dayPlaceholder', 'dd', 'Date picker: placeholder letters for the day'],
  ['monthPlaceholder', 'mm', 'Date picker: placeholder letters for the month'],
  ['yearPlaceholder', 'yyyy', 'Date picker: placeholder letters for the year'],
  ['progress', 'Progress', 'Progress: the bar\'s name, unless `label` is set'],
  ['loading', 'Loading', 'Spinner: its name, unless `label` is set'],
  ['breadcrumb', 'Breadcrumb', 'Breadcrumbs: the navigation, unless `label` is set'],
  ['chooseFiles', 'Choose files', 'File upload: the button, with `multiple`'],
  ['chooseFile', 'Choose a file', 'File upload: the button, for one file'],
  ['dropFiles', 'or drag them here', 'File upload: next to the button, with `multiple`'],
  ['dropFile', 'or drag it here', 'File upload: next to the button, for one file'],
  ['removeFile', 'Remove {name}', 'File upload: a file\'s remove button; must contain `{name}`'],
  ['fileTooLarge', '{name} is larger than {size}.', 'File upload: a file over `max-size`; must contain `{name}`, then `{size}`'],
  ['fileTypeRejected', "{name} isn't an accepted file type.", 'File upload: a file `accept` rules out; must contain `{name}`'],
  ['chooseDates', 'Choose dates', "Date range picker: the calendar button, and the popup's name without a `label`"],
  ['startDate', 'Start date', "Date range picker: the start input's name, after the label"],
  ['endDate', 'End date', "Date range picker: the end input's name, after the label"],
  ['rangeIncomplete', 'Enter both a start and an end date.', 'Date range picker: only one of the two dates is set'],
  ['endBeforeStart', "The end date can't be before the start date.", 'Date range picker: the end is before the start'],
];

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'city', label: 'City' },
];

/** Renders `backticks` as code. */
const inline = (text: string) => text.split(/(`[^`]+`)/).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part));

function Demo() {
  const [lang, setLang] = useState('it');
  return (
    <div className="demo">
      <div className="demo__preview demo__preview--stack" lang={lang}>
        <UfSelect label="Language (lang attribute)" value={lang} onChange={(e) => setLang((e.target as HTMLSelectElement).value)}>
          <option value="en">English</option>
          <option value="it">Italiano</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </UfSelect>
        <UfCombobox label="City" placeholder="Type “xyz”" hint="Search for something that isn't there.">
          <option value="rome">Rome</option>
          <option value="paris">Paris</option>
        </UfCombobox>
        <UfPagination pages={5} page={2} />
        <UfTable label="People" columns={columns} rows={[]} />
        <div>
          <UfButton variant="outline" onClick={(e) => ((e.currentTarget as HTMLElement).nextElementSibling as HTMLElement & { show(): void }).show()}>
            Open a dialog
          </UfButton>
          <UfDialog label="Dialog" lightDismiss>
            Its close button is named in the chosen language.
          </UfDialog>
        </div>
      </div>
    </div>
  );
}

export function Translations() {
  return (
    <article>
      <h1>Translations</h1>
      <p className="lead">
        Components have a few built-in texts, like a dialog's close button or "No results". They're in English; switch
        them to a built-in language, or pass your own with <code>setTranslations()</code>.
      </p>

      <h2>Built-in languages</h2>
      <p>
        Italian, French, German, Spanish and Portuguese come with the library. Each is its own file, so your bundle only
        has the languages you import.
      </p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'JavaScript',
            lang: 'javascript',
            code: `import { setTranslations } from '@unframed/core';
import it from '@unframed/core/locales/it';
import fr from '@unframed/core/locales/fr';

setTranslations(it, 'it');
setTranslations(fr, 'fr');`,
          },
        ]}
      />
      <div className="api-table">
        <table className="api-table__table">
          <thead>
            <tr>
              <th scope="col" className="api-table__header">Language</th>
              <th scope="col" className="api-table__header">Import</th>
            </tr>
          </thead>
          <tbody>
            {builtIn.map(([name, code]) => (
              <tr key={code} className="api-table__row">
                <td className="api-table__cell">{name}</td>
                <td className="api-table__cell">
                  <code>@unframed/core/locales/{code}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        To change a few texts on top, call it again with just those: <code>{"setTranslations({ close: 'Esci' }, 'it')"}</code>.
        Missing a language? Pass the texts yourself, as below.
      </p>

      <h2>Your own texts</h2>
      <p>For other languages or your own wording: call it once, when your app starts, with only what you want to change. The rest stays English.</p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'JavaScript',
            lang: 'javascript',
            code: `import { setTranslations } from '@unframed/core';

setTranslations({
  close: 'Chiudi',
  noResults: 'Nessun risultato',
  page: 'Pagina {page}',   // {page} becomes the page number
});`,
          },
        ]}
      />
      <p>
        It works the same in React, Vue and Angular: call it from your app's entry file. Components already on the page
        update at once, so you can also call it after loading translations from your i18n library:{' '}
        <code>{"setTranslations({ close: t('close') })"}</code>.
      </p>

      <h2>Several languages</h2>
      <p>
        Register each language under its code. Each component then uses the language of the nearest <code>lang</code>{' '}
        attribute: switch language by changing <code>&lt;html lang&gt;</code>, or mix languages by section.
      </p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'JavaScript',
            lang: 'javascript',
            code: `setTranslations({ close: 'Chiudi', page: 'Pagina {page}' }, 'it');
setTranslations({ close: 'Fermer', page: 'Page {page}' }, 'fr');

// Components update when lang changes:
document.documentElement.lang = 'fr';`,
          },
          {
            label: 'HTML',
            code: `<html lang="it">
  <uf-dialog label="Conferma">…</uf-dialog>   <!-- Italian -->
  <section lang="fr">
    <uf-pagination pages="5"></uf-pagination>  <!-- French -->
  </section>
</html>`,
          },
        ]}
      />
      <ul>
        <li>
          <code>pt-BR</code> uses <code>pt-BR</code> if registered, then <code>pt</code>, then the strings registered
          without a code, then English.
        </li>
        <li>Language codes match regardless of case.</li>
        <li>
          i18n libraries usually set <code>&lt;html lang&gt;</code> for you, so the components follow them.
        </li>
      </ul>

      <h2>Try it</h2>
      <p>Italian, French and German are registered for this demo; change the language, then type in the combobox.</p>
      <Demo />

      <h2>Every text</h2>
      <p>
        With TypeScript, the keys autocomplete, and texts with a placeholder (<code>{'{page}'}</code>,{' '}
        <code>{'{count}'}</code>…) must contain it. The{' '}
        <code>label</code> attributes and the table's <code>empty</code> slot still win over translations, for one
        element.
      </p>
      <div className="api-table">
        <table className="api-table__table">
          <thead>
            <tr>
              <th scope="col" className="api-table__header">Key</th>
              <th scope="col" className="api-table__header">English</th>
              <th scope="col" className="api-table__header">Where</th>
            </tr>
          </thead>
          <tbody>
            {keys.map(([key, english, where]) => (
              <tr key={key} className="api-table__row">
                <td className="api-table__cell">
                  <code className="api-table__name">{key}</code>
                </td>
                <td className="api-table__cell">{english}</td>
                <td className="api-table__cell">{inline(where)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Error messages for native checks, like a required input or an invalid email, come from the browser, in the
        user's language already. Month and weekday names, date formats and the first day of the week come from the
        browser too, for the nearest <code>lang</code>.
      </p>
    </article>
  );
}
