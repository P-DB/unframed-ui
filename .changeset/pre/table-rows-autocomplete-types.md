---
'@unframed/core': patch
'@unframed/react': patch
'@unframed/vue': patch
'@unframed/angular': patch
---

Typed data and autofill hints type-check as written. `<uf-table>` takes rows typed by your own interfaces or type aliases, like `rows={orders}` with `orders: Order[]`, and `TableColumn<Order>` types `row` in `format` and `compare` and suggests the keys of `Order`. `TableRow` is now `object`: to read a property of `table.rows` by a dynamic key, cast the rows to your own type. `autocomplete` on `<uf-input>`, `<uf-textarea>` and `<uf-select>` accepts any HTML autofill token, such as `nickname`, which TypeScript's `AutoFill` type leaves out, and still suggests the common ones.
