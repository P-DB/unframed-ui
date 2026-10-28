/**
 * How a `<uf-checkbox>` asks its `<uf-checkbox-group>` to update "select all"
 * when its `checked` changes from code. A symbol, so it isn't public API.
 */
export const syncSelectAll = Symbol('syncSelectAll');

export interface SelectAllHost extends HTMLElement {
  [syncSelectAll](): void;
}
