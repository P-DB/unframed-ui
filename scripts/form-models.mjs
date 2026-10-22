// How each form control maps to a framework model (Vue v-model, Angular
// ControlValueAccessor): which property holds the value and which event
// reports a change. Used by the Vue and Angular wrapper generators.
//
// Add new form controls here; the generators warn about form controls
// (elements with checkValidity()) that are missing.
export const formModels = {
  'uf-input': { prop: 'value', event: 'input', type: 'string' },
  'uf-textarea': { prop: 'value', event: 'input', type: 'string' },
  'uf-select': { prop: 'value', event: 'change', type: 'string' },
  'uf-combobox': { prop: 'value', event: 'change', type: 'string' },
  'uf-date-picker': { prop: 'value', event: 'change', type: 'string' },
  'uf-date-range-picker': { prop: 'value', event: 'change', type: 'string' },
  'uf-radio-group': { prop: 'value', event: 'change', type: 'string' },
  // `synced`: other properties the user can change, kept in sync with the framework too
  // (a click clears `indeterminate`). Vue: v-model:indeterminate, Angular: [(indeterminate)].
  'uf-checkbox': { prop: 'checked', event: 'change', type: 'boolean', synced: ['indeterminate'] },
  'uf-checkbox-group': { prop: 'value', event: 'change', type: 'string[]' },
  'uf-switch': { prop: 'checked', event: 'change', type: 'boolean' },
  'uf-slider': { prop: 'value', event: 'input', type: 'number' },
  'uf-file-upload': { prop: 'files', event: 'change', type: 'File[]' },
};

/** Custom elements from @unframed/core's manifest, with the module they live in. */
export function readElements(manifest) {
  return manifest.modules.flatMap((mod) =>
    (mod.declarations ?? []).filter((d) => d.customElement && d.tagName).map((d) => ({ ...d, modulePath: mod.path })),
  );
}

/**
 * The smallest @unframed/core entry that registers and exports an element: its
 * folder's entry, which also exports the sub-elements in that folder.
 * dist/components/button/button.js -> @unframed/core/button
 * dist/components/tabs/tab.js -> @unframed/core/tabs (exports UfTab, UfTabPanel)
 */
export function coreImportPath(modulePath) {
  const match = modulePath.match(/^dist\/components\/([^/]+)\/[^/]+\.js$/);
  return match ? `@unframed/core/${match[1]}` : '@unframed/core';
}

export const pascal = (name) => name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

export function warnMissingModels(elements) {
  for (const el of elements) {
    const formControl = (el.members ?? []).some((m) => m.name === 'checkValidity');
    if (formControl && !formModels[el.tagName]) {
      console.warn(`warning: ${el.tagName} is a form control but has no entry in scripts/form-models.mjs`);
    }
  }
}
