import { CodeBlock } from '../../components/CodeBlock';
import { NextSteps } from '../../components/LinkCards';
import { angular } from './snippets';

export function AngularGuide() {
  return (
    <article>
      <h1>Angular</h1>
      <p className="lead">
        <code>@unframed/angular</code> has standalone components with typed inputs and outputs, and form directives,
        so <code>ngModel</code>, <code>formControl</code> and <code>formControlName</code> work on every form
        control. It needs Angular 20 or later.
      </p>

      <h2>1. Install</h2>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: angular.install }]} />
      <p>
        It installs <code>@unframed/core</code> too. No <code>CUSTOM_ELEMENTS_SCHEMA</code> needed.
      </p>

      <h2>2. Set up</h2>
      <CodeBlock standalone samples={[{ label: 'styles.css', lang: 'css', code: angular.setup }]} />

      <h2>3. Use the components</h2>
      <p>A sign-up form with reactive forms, a dialog and a toast:</p>
      <CodeBlock
        standalone
        samples={[
          { label: 'signup.component.ts', lang: 'angular-ts', code: angular.component },
          { label: 'signup.component.html', lang: 'angular-html', code: angular.template },
        ]}
      />
      <ul>
        <li>
          <strong>UNFRAMED</strong> imports every component and form directive, so it bundles all of them. Handy to
          start with; see below to ship only what you use.
        </li>
        <li>
          <strong>Inputs</strong> are the element's properties, typed: <code>[open]</code>, <code>[variant]</code>,{' '}
          <code>[disabled]</code>…
        </li>
        <li>
          <strong>Outputs</strong> keep the event names: <code>(input)</code>, <code>(change)</code>,{' '}
          <code>(uf-hide)</code>, <code>(uf-tab-change)</code>…
        </li>
        <li>
          <strong>Forms</strong>: the value and the disabled state sync both ways, and leaving a field marks it as
          touched. Angular validators set the form's state; the element's own attributes (<code>required</code>,{' '}
          <code>pattern</code>…) show the error message under the field.
        </li>
        <li>
          <strong>Toasts and icons</strong>: <code>toast()</code> and <code>registerIcons()</code> come from{' '}
          <code>@unframed/core</code>.
        </li>
      </ul>

      <h2>Bundle only what you use</h2>
      <p>
        Import components by name, from the root or from each component's entry point, like{' '}
        <code>@unframed/angular/input</code>. Your app then bundles only those components. An entry point also exports
        its form directive (<code>UfTextValueAccessor</code> for inputs and textareas,{' '}
        <code>UfCheckedValueAccessor</code> for checkboxes and switches…).
      </p>
      <CodeBlock standalone samples={[{ label: 'signup.component.ts', lang: 'angular-ts', code: angular.entries }]} />

      <h2>Template-driven forms</h2>
      <CodeBlock standalone samples={[{ label: 'settings.component.ts', lang: 'angular-ts', code: angular.ngModel }]} />

      <h2>Methods</h2>
      <p>
        Each component exposes its element as <code>el</code>, with its methods:
      </p>
      <CodeBlock standalone samples={[{ label: 'help.component.ts', lang: 'angular-ts', code: angular.methods }]} />

      <h2>Next</h2>
      <NextSteps />
    </article>
  );
}
