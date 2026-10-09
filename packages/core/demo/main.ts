import '@unframed/tokens/tokens.css';
import { toast, type ToastVariant, type UfButton, type UfDialog } from '../src/index.js';

const root = document.documentElement;

document.querySelector('#theme-toggle')!.addEventListener('click', () => {
  const current =
    root.dataset.ufTheme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.ufTheme = current === 'dark' ? 'light' : 'dark';
});

const saveButton = document.querySelector<UfButton>('#save')!;
saveButton.addEventListener('click', () => {
  saveButton.loading = true;
  setTimeout(() => (saveButton.loading = false), 1500);
});

const form = document.querySelector<HTMLFormElement>('#signup')!;
const output = form.querySelector('output')!;
// novalidate on the form + reportValidity() here: show inline errors instead of browser bubbles.
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const controls = [...form.querySelectorAll<HTMLElement & { reportValidity(): boolean }>('[name]')];
  // Check every control (not just until the first failure) so all errors show at once.
  const firstInvalid = controls.filter((c) => typeof c.reportValidity === 'function' && !c.reportValidity())[0];
  if (firstInvalid) {
    firstInvalid.focus();
    output.textContent = 'Please fix the highlighted fields.';
    return;
  }
  output.textContent = JSON.stringify(Object.fromEntries(new FormData(form)));
  toast('Your account was created.', { title: 'Welcome!', variant: 'success' });
});
form.addEventListener('reset', () => (output.textContent = 'Form reset'));

const dialog = document.querySelector<UfDialog>('#dialog')!;
document.querySelector('#open-dialog')!.addEventListener('click', () => dialog.show());
document.querySelector('#confirm-delete')!.addEventListener('click', () => {
  dialog.hide();
  toast('The project was deleted.', { variant: 'danger', title: 'Deleted' });
});

document.addEventListener('uf-select', (event) => {
  const { value, item } = (event as CustomEvent<{ value: string; item: { type: string; checked: boolean } }>).detail;
  const state = item.type === 'checkbox' ? (item.checked ? ' (on)' : ' (off)') : '';
  toast(`Menu: ${value}${state}`);
});

const messages: Record<ToastVariant, string> = {
  neutral: 'Draft saved.',
  info: 'A new version is available.',
  success: 'Changes published.',
  warning: 'Your trial ends in 3 days.',
  danger: 'Payment failed. Check your card.',
};
for (const button of document.querySelectorAll<HTMLElement>('[data-toast]')) {
  const variant = button.dataset.toast as ToastVariant;
  button.addEventListener('click', () => toast(messages[variant], { variant }));
}
