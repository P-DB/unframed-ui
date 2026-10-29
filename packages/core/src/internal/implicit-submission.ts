const submitTypes = new Set(['submit', 'image']);

function isSubmitButton(el: Element): boolean {
  if (el instanceof HTMLButtonElement) return el.type === 'submit';
  if (el instanceof HTMLInputElement) return submitTypes.has(el.type);
  // The property, not the attribute: frameworks may set only the property.
  return el.localName === 'uf-button' && (el as Element & { type?: string }).type === 'submit';
}

/** Fields where Enter submits, the ones that count for implicit submission. */
const textTypes = new Set(['text', 'search', 'url', 'tel', 'email', 'password', 'date', 'month', 'week', 'time', 'datetime-local', 'number']);

function blocksImplicitSubmission(el: Element): boolean {
  if (el instanceof HTMLInputElement) return textTypes.has(el.type);
  return el.localName === 'uf-input' || el.localName === 'uf-number-input';
}

/**
 * Enter submits the form, like in a native input: through its default button (the
 * first submit button), unless that's disabled. Without one, only when the field
 * is the form's only text field.
 */
export function submitOnEnter(event: KeyboardEvent, form: HTMLFormElement | null): void {
  if (event.key !== 'Enter' || event.isComposing || event.defaultPrevented || !form) return;
  const fields = [...form.elements];
  const submitter = fields.find(isSubmitButton);
  if (submitter) {
    if ((submitter as Element & { disabled?: boolean }).disabled || submitter.matches(':disabled')) return;
  } else if (fields.filter(blocksImplicitSubmission).length > 1) {
    return;
  }
  event.preventDefault();
  // Native submit buttons go with the form data; ours submit no value.
  form.requestSubmit(submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement ? submitter : undefined);
}
