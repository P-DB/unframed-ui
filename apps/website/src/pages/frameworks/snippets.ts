// Code shown on the framework guides. Kept apart from the pages so the examples
// can be copied into a real project and type-checked when the APIs change
// (scripts/check-snippets.mjs runs in CI).
import core from '../../../../../packages/core/package.json' with { type: 'json' };

/** The CDN examples pin the current minor version: 0.x minors can break. */
const minor = core.version.split('.').slice(0, 2).join('.');

export const html = {
  install: 'npm install @unframed/core @unframed/tokens',
  setup: `// main.js: load the tokens once, then the components you use
import '@unframed/tokens/tokens.css';
import '@unframed/core/button';
import '@unframed/core/input';
import '@unframed/core/checkbox';
import '@unframed/core/dialog';
// or every component at once: import '@unframed/core';`,
  cdn: `<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unframed/tokens@${minor}/dist/tokens.css" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/@unframed/core@${minor}/+esm"></script>
  </head>
  <body>
    <uf-button variant="primary">It works</uf-button>
  </body>
</html>`,
  markup: `<form id="signup">
  <uf-input name="email" type="email" label="Email" required></uf-input>
  <uf-checkbox name="terms" required>I accept the terms</uf-checkbox>
  <uf-button type="submit">Sign up</uf-button>
</form>

<uf-dialog id="welcome" label="Welcome!">
  <p>Check your inbox to confirm your email.</p>
  <uf-button slot="footer" data-dialog="close">Got it</uf-button>
</uf-dialog>`,
  script: `import { toast } from '@unframed/core';

const form = document.querySelector('#signup');
const dialog = document.querySelector('#welcome');

// Form controls take part in forms like native ones: validation, FormData, reset.
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form); // { email: '…', terms: 'on' }
  console.log(Object.fromEntries(data));
  dialog.show();
});

// Events: native ones (input, change) and uf-* ones.
form.querySelector('uf-input').addEventListener('input', (event) => {
  console.log(event.target.value);
});
dialog.addEventListener('uf-hide', () => toast('Welcome aboard!', { variant: 'success' }));`,
  types: `import type { UfDialog, UfInput } from '@unframed/core';

const dialog = document.querySelector('uf-dialog'); // typed as UfDialog | null
const input = document.querySelector<UfInput>('#email');`,
};

export const react = {
  install: 'npm install @unframed/react @unframed/tokens',
  setup: `// main.tsx: load the tokens once
import '@unframed/tokens/tokens.css';`,
  app: `import { useState } from 'react';
import { toast, type UfCheckbox as UfCheckboxElement, type UfInput as UfInputElement } from '@unframed/core';
import { UfButton, UfCheckbox, UfDialog, UfInput } from '@unframed/react';

export function Signup() {
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        <UfInput
          name="email"
          type="email"
          label="Email"
          required
          value={email}
          onInput={(event) => setEmail((event.target as UfInputElement).value)}
        />
        <UfCheckbox
          name="terms"
          required
          checked={terms}
          onChange={(event) => setTerms((event.target as UfCheckboxElement).checked)}
        >
          I accept the terms
        </UfCheckbox>
        <UfButton type="submit" disabled={!terms}>
          Sign up
        </UfButton>
      </form>

      <UfDialog
        label="Welcome!"
        open={open}
        onUfHide={() => {
          setOpen(false);
          toast('Welcome aboard!', { variant: 'success' });
        }}
      >
        <p>Check {email} to confirm your email.</p>
        <UfButton slot="footer" data-dialog="close">
          Got it
        </UfButton>
      </UfDialog>
    </>
  );
}`,
  ref: `import { useRef } from 'react';
import type { UfDialog as UfDialogElement } from '@unframed/core';
import { UfButton, UfDialog } from '@unframed/react';

export function Help() {
  const dialog = useRef<UfDialogElement>(null);
  return (
    <>
      <UfButton onClick={() => dialog.current?.show()}>Help</UfButton>
      <UfDialog ref={dialog} label="Help">…</UfDialog>
    </>
  );
}`,
};

export const vue = {
  install: 'npm install @unframed/vue @unframed/tokens',
  setup: `// main.ts: load the tokens once
import { createApp } from 'vue';
import '@unframed/tokens/tokens.css';
import App from './App.vue';

createApp(App).mount('#app');`,
  app: `<script setup lang="ts">
import { ref } from 'vue';
import { toast } from '@unframed/core';
import { UfButton, UfCheckbox, UfDialog, UfInput } from '@unframed/vue';

const email = ref('');
const terms = ref(false);
const open = ref(false);

function onHide() {
  open.value = false;
  toast('Welcome aboard!', { variant: 'success' });
}
</script>

<template>
  <form @submit.prevent="open = true">
    <UfInput v-model="email" name="email" type="email" label="Email" required />
    <UfCheckbox v-model="terms" name="terms" required>I accept the terms</UfCheckbox>
    <UfButton type="submit" :disabled="!terms">Sign up</UfButton>
  </form>

  <UfDialog label="Welcome!" :open="open" @uf-hide="onHide">
    <p>Check {{ email }} to confirm your email.</p>
    <UfButton slot="footer" data-dialog="close">Got it</UfButton>
  </UfDialog>
</template>`,
  plugin: `// main.ts: register every component globally instead of importing them
import { UnframedVue } from '@unframed/vue';

createApp(App).use(UnframedVue).mount('#app');`,
  plainTags: `// vite.config.ts: only if you write <uf-*> tags instead of the components
import vue from '@vitejs/plugin-vue';
import { isUnframedElement } from '@unframed/vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: isUnframedElement } } })],
});`,
};

export const angular = {
  install: 'npm install @unframed/angular @unframed/tokens',
  setup: `/* src/styles.css: load the tokens once */
@import '@unframed/tokens/tokens.css';`,
  component: `import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from '@unframed/core';
import { UNFRAMED } from '@unframed/angular';

@Component({
  selector: 'app-signup',
  imports: [UNFRAMED, ReactiveFormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    terms: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });
  readonly open = signal(false);

  submit() {
    if (this.form.valid) this.open.set(true);
  }

  welcome() {
    this.open.set(false);
    toast('Welcome aboard!', { variant: 'success' });
  }
}`,
  template: `<form [formGroup]="form" (ngSubmit)="submit()">
  <uf-input formControlName="email" type="email" label="Email" required />
  <uf-checkbox formControlName="terms" required>I accept the terms</uf-checkbox>
  <uf-button type="submit" [disabled]="form.invalid">Sign up</uf-button>
</form>

<uf-dialog label="Welcome!" [open]="open()" (uf-hide)="welcome()">
  <p>Check {{ form.value.email }} to confirm your email.</p>
  <uf-button slot="footer" data-dialog="close">Got it</uf-button>
</uf-dialog>`,
  ngModel: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UfCheckedValueAccessor, UfSwitch } from '@unframed/angular/switch';

@Component({
  selector: 'app-settings',
  imports: [UfSwitch, UfCheckedValueAccessor, FormsModule],
  template: \`<uf-switch [(ngModel)]="notifications">Notifications</uf-switch>\`,
})
export class SettingsComponent {
  notifications = true;
}`,
  entries: `import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// Each component has its own entry point, which also exports its form directive.
import { UfButton } from '@unframed/angular/button';
import { UfInput, UfTextValueAccessor } from '@unframed/angular/input';

// Importing by name from the root works too: unused components are left out.
import { UfDialog } from '@unframed/angular';

@Component({
  selector: 'app-signup',
  imports: [UfButton, UfInput, UfTextValueAccessor, UfDialog, ReactiveFormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {}`,
  methods: `import { Component, viewChild } from '@angular/core';
import { UfButton, UfDialog } from '@unframed/angular';

@Component({
  selector: 'app-help',
  imports: [UfButton, UfDialog],
  template: \`
    <uf-button (click)="dialog().el.show()">Help</uf-button>
    <uf-dialog label="Help">…</uf-dialog>
  \`,
})
export class HelpComponent {
  readonly dialog = viewChild.required(UfDialog);
}`,
};
