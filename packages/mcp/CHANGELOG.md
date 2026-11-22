# @unframed/mcp

## 1.0.0-rc.5

### Patch Changes

- c4f3dc6: The table docs that the agent skill and the MCP server serve show how to type columns in TypeScript: `const columns: TableColumn<Invoice>[]`. Without it, a separate `const columns = [...]` widens `align` to `string`, and `columns` rejects it.

## 1.0.0-rc.4

### Patch Changes

- b988a84: `validate_usage` no longer reports false errors in Vue templates: a bound value like `:sort-direction="dir"` is read as an expression, not as the text `dir`, and `v-model` written out (`:model-value` with `@update:model-value`, or `v-model:indeterminate`) is accepted on form controls. Static values on `<UfX>` wrappers are still checked.

## 1.0.0-rc.3

### Minor Changes

- 73c3717: New `@unframed/mcp`: an MCP server that AI coding tools (Claude Code, Cursor, VS Code and others) start on their own, so they look up the real API instead of guessing. `list_components` finds the right component, `get_component` returns its examples and full API, and `validate_usage` checks the code the assistant wrote: unknown tags, attributes and events, invalid values, `disabled="false"`, and missing labels, each with its line and a fix. Setup is on the [AI assistants](https://p-db.github.io/unframed-ui/docs/ai-assistants) page.
