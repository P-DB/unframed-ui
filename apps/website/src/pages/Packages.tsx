import { UfIcon } from '@unframed/react';
import { CodeBlock } from '../components/CodeBlock';
import { LinkButton } from '../components/LinkButton';

interface Package {
  name: string;
  summary: string;
  install: string;
  dependsOn: string;
  /** What you import from it. */
  entries: [string, string][];
}

const packages: Package[] = [
  {
    name: '@unframed/tokens',
    summary: 'The design tokens: colors, spacing, radius, typography, shadows and durations, as CSS custom properties, for light and dark.',
    install: 'Always. Every component reads its colors and sizes from these properties.',
    dependsOn: 'Nothing',
    entries: [
      ['@unframed/tokens/tokens.css', 'Every token as a --uf-* custom property, with the dark theme under [data-uf-theme="dark"] and prefers-color-scheme.'],
      ['@unframed/tokens/tokens.json', 'The resolved values, for tooling or other platforms.'],
      ['@unframed/tokens/src/*.tokens.json', 'The source tokens in the W3C design tokens format.'],
    ],
  },
  {
    name: '@unframed/core',
    summary: 'The web components themselves, built with Lit. They work in plain HTML and in any framework.',
    install: 'Directly for plain HTML, Svelte, Solid, Astro, Lit and others. The framework packages install it for you.',
    dependsOn: 'lit; @unframed/tokens (peer)',
    entries: [
      ['@unframed/core', 'Registers every component, and exports the classes, toast(), registerIcons() and the types.'],
      ['@unframed/core/<component>', 'Registers one component (and the ones it uses), e.g. @unframed/core/dialog. Smaller bundles.'],
      ['@unframed/core/custom-elements.json', 'The Custom Elements Manifest: every attribute, property, event, slot, part and CSS property. Used by editors and tools.'],
    ],
  },
  {
    name: '@unframed/react',
    summary: 'A React component for every element, with typed props and camelCase event handlers like onUfHide.',
    install: 'In React apps (18 or later).',
    dependsOn: '@unframed/core, @lit/react; react (peer)',
    entries: [['@unframed/react', 'UfButton, UfDialog, UfInput… and the prop types (UfButtonProps…).']],
  },
  {
    name: '@unframed/vue',
    summary: 'A Vue component for every element, with typed props and events, and v-model on every form control.',
    install: 'In Vue 3 apps.',
    dependsOn: '@unframed/core; vue (peer)',
    entries: [
      ['@unframed/vue', 'UfButton, UfDialog, UfInput…, the UnframedVue plugin to register them globally, and isUnframedElement for plain tags.'],
    ],
  },
  {
    name: '@unframed/angular',
    summary: 'Standalone Angular components with typed inputs and outputs, and form directives for ngModel and reactive forms.',
    install: 'In Angular apps (20 or later).',
    dependsOn: '@unframed/core; @angular/core, @angular/forms (peers)',
    entries: [
      ['@unframed/angular', 'Every component and form directive by name (UfButton, UfDialog…), and UNFRAMED to import them all at once.'],
      ['@unframed/angular/<component>', 'One component and its form directive, e.g. @unframed/angular/input. Loads only that component from core.'],
      ['@unframed/angular/forms', 'Every form directive (UfTextValueAccessor, UfCheckedValueAccessor…).'],
    ],
  },
  {
    name: '@unframed/cli',
    summary: 'Copies the source of components into your project, so you own and can change the code. Also installs the Unframed skill for AI assistants.',
    install: 'Never: run it with npx when you want a copy instead of an npm dependency, or the AI skill.',
    dependsOn: 'Nothing at runtime',
    entries: [['npx @unframed/cli', 'init, add, list and diff to copy components; skill for AI assistants. See Installation.']],
  },
];

const guides = [
  ['/docs/frameworks/html', 'HTML & JavaScript'],
  ['/docs/frameworks/react', 'React'],
  ['/docs/frameworks/vue', 'Vue'],
  ['/docs/frameworks/angular', 'Angular'],
];

export function Packages() {
  return (
    <article>
      <h1>Packages</h1>
      <p className="lead">
        Unframed is six npm packages under the <code>@unframed</code> scope. You install two of them: the tokens, and
        either the components or your framework's package.
      </p>

      <h2>How they fit together</h2>
      <div className="package-map" role="img" aria-label="Package structure: react, vue and angular build on core, which builds on tokens. The CLI is separate.">
        <div className="package-map__row">
          <div className="package-map__box">@unframed/react</div>
          <div className="package-map__box">@unframed/vue</div>
          <div className="package-map__box">@unframed/angular</div>
        </div>
        <div className="package-map__arrow" aria-hidden="true">↓ wrap</div>
        <div className="package-map__row">
          <div className="package-map__box package-map__box--core">@unframed/core</div>
        </div>
        <div className="package-map__arrow" aria-hidden="true">↓ styled by</div>
        <div className="package-map__row">
          <div className="package-map__box">@unframed/tokens</div>
        </div>
        <div className="package-map__aside">
          <div className="package-map__box package-map__box--tool">@unframed/cli</div>
          <span className="package-map__note">copies the source of core and tokens into your project</span>
        </div>
      </div>
      <p>
        <strong>Core</strong> is the library: real custom elements that work anywhere HTML does. The framework packages
        are thin, generated wrappers around it, so every framework gets the same components, behaviour and fixes. They
        add what each framework expects: typed props, its event syntax and its form bindings.
      </p>

      <h2>Which ones to install</h2>
      <CodeBlock
        standalone
        samples={[
          { label: 'React', lang: 'bash', code: 'npm install @unframed/react @unframed/tokens' },
          { label: 'Vue', lang: 'bash', code: 'npm install @unframed/vue @unframed/tokens' },
          { label: 'Angular', lang: 'bash', code: 'npm install @unframed/angular @unframed/tokens' },
          { label: 'Anything else', lang: 'bash', code: 'npm install @unframed/core @unframed/tokens' },
        ]}
      />
      <p>
        All packages are released together with the same version number. While the version starts with <code>0.</code>,
        a minor release (0.2 → 0.3) may include breaking changes, listed in the changelog.
      </p>

      <h2>The packages</h2>
      {packages.map((pkg) => (
        <section key={pkg.name}>
          <h3>
            <a href={`https://www.npmjs.com/package/${pkg.name}`} target="_blank" rel="noreferrer">
              {pkg.name}
            </a>
          </h3>
          <p>{pkg.summary}</p>
          <dl className="package-facts">
            <dt className="package-facts__term">Install it</dt>
            <dd className="package-facts__value">{pkg.install}</dd>
            <dt className="package-facts__term">Depends on</dt>
            <dd className="package-facts__value">{pkg.dependsOn}</dd>
          </dl>
          <div className="api-table">
            <table className="api-table__table">
              <thead>
                <tr>
                  <th scope="col" className="api-table__header">Import</th>
                  <th scope="col" className="api-table__header">What you get</th>
                </tr>
              </thead>
              <tbody>
                {pkg.entries.map(([entry, description]) => (
                  <tr key={entry} className="api-table__row">
                    <td className="api-table__cell">
                      <code className="api-table__name">{entry}</code>
                    </td>
                    <td className="api-table__cell">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <h2>Guides</h2>
      <p>Everything you need to set up Unframed, framework by framework:</p>
      <div className="packages__guides">
        {guides.map(([to, title]) => (
          <LinkButton key={to} to={to} variant="outline">
            {title}
            <UfIcon slot="suffix" name="chevron-right" />
          </LinkButton>
        ))}
      </div>
    </article>
  );
}
