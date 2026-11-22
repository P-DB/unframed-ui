---
'@unframed/cli': patch
'@unframed/mcp': patch
---

The table docs that the agent skill and the MCP server serve show how to type columns in TypeScript: `const columns: TableColumn<Invoice>[]`. Without it, a separate `const columns = [...]` widens `align` to `string`, and `columns` rejects it.
