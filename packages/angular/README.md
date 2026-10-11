# @unframed/angular

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

Add `node_modules/@unframed/tokens/dist/tokens.css` to the `styles` in `angular.json`.

**[Documentation](https://p-db.github.io/unframed-ui/)** · **[Storybook](https://p-db.github.io/unframed-ui/storybook/)** · **[GitHub](https://github.com/P-DB/unframed-ui)**

MIT licensed. Status: 0.x, APIs may change before 1.0.
