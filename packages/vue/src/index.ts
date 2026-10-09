export * from './generated/index.js';
export { createWrapper } from './create-wrapper.js';
export type { ModelConfig, ModelEmits, ModelProps, WrapperComponent } from './create-wrapper.js';

/**
 * For using the `<uf-*>` tags directly in templates (without the components),
 * tell Vue's compiler they are custom elements:
 *
 * @example vue({ template: { compilerOptions: { isCustomElement: isUnframedElement } } })
 */
export const isUnframedElement = (tag: string): boolean => tag.startsWith('uf-');
