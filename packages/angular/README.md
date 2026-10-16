# @unframed/angular

[![npm](https://img.shields.io/npm/v/@unframed/angular?color=6930c3)](https://www.npmjs.com/package/@unframed/angular)

Angular standalone components and form directives for [Unframed](https://p-db.github.io/unframed-ui/) web components. `ngModel`, `formControl` and `formControlName` work with every form control; no `CUSTOM_ELEMENTS_SCHEMA` needed.

```bash
npm install @unframed/angular @unframed/tokens
```

```ts
import { UNFRAMED } from '@unframed/angular';

@Component({
  imports: [UNFRAMED, ReactiveFormsModule],
  template: `<uf-input [formControl]="email" type="email" label="Email" required />`,
})
export class SignupComponent {
  email = new FormControl('');
}
```

`UNFRAMED` brings every component. To bundle only what you use, import components by name, from `@unframed/angular` or from each component's entry point:

```ts
import { UfInput, UfTextValueAccessor } from '@unframed/angular/input';
```

Load the tokens once, in `src/styles.css`: `@import '@unframed/tokens/tokens.css';`

**[Documentation](https://p-db.github.io/unframed-ui/)** · **[Storybook](https://p-db.github.io/unframed-ui/storybook/)** · **[GitHub](https://github.com/P-DB/unframed-ui)**

MIT licensed. Status: 0.x, APIs may change before 1.0.
