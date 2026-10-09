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
  'uf-radio-group': { prop: 'value', event: 'change', type: 'string' },
  'uf-checkbox': { prop: 'checked', event: 'change', type: 'boolean' },
  'uf-switch': { prop: 'checked', event: 'change', type: 'boolean' },
};

/** Custom elements from @unframed/core's manifest, with the module they live in. */
export function readElements(manifest) {
  return manifest.modules.flatMap((mod) =>
    (mod.declarations ?? []).filter((d) => d.customElement && d.tagName).map((d) => ({ ...d, modulePath: mod.path })),
  );
}

/** dist/components/button/button.js -> @unframed/core/button (or the root entry). */
export function coreImportPath(modulePath) {
  const match = modulePath.match(/^dist\/components\/([^/]+)\/\1\.js$/);
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
