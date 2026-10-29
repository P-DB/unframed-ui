import { NavLink } from 'react-router';
import { code, DocTable, rich } from '../components/DocTable';

const publicApi: [string, string][] = [
  ['Tags', '`<uf-button>`, `<uf-dialog>`…'],
  ['Attributes and properties', 'Their names, types, defaults and what they do.'],
  ['Methods', '`show()`, `checkValidity()`…: names, arguments and return values.'],
  ['Events', 'Names, `detail`, and whether they bubble.'],
  ['Slots and CSS parts', '`slot="prefix"`, `::part(base)`…'],
  ['CSS custom properties', 'The `--uf-*` properties of each component, and the design tokens.'],
  ['Translation keys', 'The keys of `setTranslations()`, and their placeholders like `{count}`.'],
  ['Framework packages', 'Component and prop names, events like `onUfHide`, and the `v-model` and `ngModel` bindings.'],
  ['CLI', 'The commands and options of `@unframed/cli`.'],
];

const notPublic: [string, string][] = [
  ['Shadow DOM', "The elements inside a component, their classes, and `--_*` properties. Style through parts and custom properties instead."],
  ['Members marked internal', 'Anything not in the API tables, even if JavaScript lets you reach it.'],
  ['Exact look', 'Colors, spacing and motion can be refined in any release, within the same design.'],
  ['Default texts', 'The English wording, and that of the built-in languages, may be improved. The keys stay.'],
];

/** The versioning, browser support and deprecation policy. */
export function Stability() {
  return (
    <article>
      <h1>Stability</h1>
      <p className="lead">What counts as a breaking change, which browsers and frameworks are supported, and how APIs are retired.</p>

      <h2>Versions</h2>
      <p>
        Every package follows <a href="https://semver.org">semantic versioning</a>, and they're all released together with the
        same version number. Patch releases fix bugs, minor releases add features, and only major releases break the public
        API.
      </p>
      <p>
        While the version starts with <code>0.</code>, a minor release (0.10 → 0.11) may also include breaking changes. Each
        one is listed in the changelog with what to change in your code.
      </p>

      <h2>The public API</h2>
      <p>Changing or removing any of these is a breaking change:</p>
      <DocTable
        label="The public API"
        columns={[
          ['what', 'What', '14rem'],
          ['includes', 'Includes'],
        ]}
        rows={publicApi.map(([what, includes]) => ({ what, includes: rich(includes) }))}
      />
      <p>These are not part of it, and can change in any release:</p>
      <DocTable
        label="Not part of the public API"
        columns={[
          ['what', 'What', '14rem'],
          ['why', 'Why'],
        ]}
        rows={notPublic.map(([what, why]) => ({ what, why: rich(why) }))}
      />
      <p>
        Every public member is documented in the API tables of the <NavLink to="/components">component pages</NavLink>,
        generated from the same source as the code.
      </p>

      <h2>Browsers</h2>
      <p>
        The current and the previous version of Chrome, Edge, Firefox and Safari, on desktop and mobile. The components use
        web standards those browsers support: custom elements and shadow DOM, form-associated elements, the Popover API and
        <code>&lt;dialog&gt;</code>. Every change is tested in Chromium, Firefox and WebKit before it's released.
      </p>
      <p>
        A few refinements only show where the browser supports them, like the accordion's animated height. Elsewhere the
        component works the same, without the animation.
      </p>

      <h2>Frameworks</h2>
      <DocTable
        label="Supported framework versions"
        columns={[
          ['pkg', 'Package', '14rem'],
          ['supports', 'Supports'],
        ]}
        rows={[
          { pkg: code('@unframed/react'), supports: 'React 18 and later' },
          { pkg: code('@unframed/vue'), supports: 'Vue 3.4 and later' },
          { pkg: code('@unframed/angular'), supports: 'Angular 20 and later' },
          { pkg: code('@unframed/core'), supports: 'Any framework, or none' },
        ]}
      />
      <p>Dropping a framework version is a breaking change.</p>

      <h2>Deprecations</h2>
      <p>
        An API is deprecated before it's removed. It keeps working for at least one minor release, marked as deprecated in the
        docs and the changelog with what to use instead, and is removed in the next major release.
      </p>
    </article>
  );
}
