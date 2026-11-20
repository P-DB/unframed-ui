---
'@unframed/mcp': minor
---

New `@unframed/mcp`: an MCP server that AI coding tools (Claude Code, Cursor, VS Code and others) start on their own, so they look up the real API instead of guessing. `list_components` finds the right component, `get_component` returns its examples and full API, and `validate_usage` checks the code the assistant wrote: unknown tags, attributes and events, invalid values, `disabled="false"`, and missing labels, each with its line and a fix. Setup is on the [AI assistants](https://p-db.github.io/unframed-ui/docs/ai-assistants) page.
