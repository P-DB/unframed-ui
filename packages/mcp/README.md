# @unframed/mcp

[![npm](https://img.shields.io/npm/v/@unframed/mcp?color=6930c3)](https://www.npmjs.com/package/@unframed/mcp)

An [MCP](https://modelcontextprotocol.io) server for [Unframed](https://p-db.github.io/unframed-ui/). Your AI coding tool starts it on its own and uses it to look up the real components, instead of guessing, and to check the code it writes.

| Tool | What it does |
|---|---|
| `list_components` | Every component, with a summary, its tags and what to import |
| `get_component` | One component's examples and full API: attributes, properties, events, slots, parts, CSS custom properties |
| `validate_usage` | Checks code that uses Unframed: unknown tags, attributes and events, invalid values, `disabled="false"`, missing labels. Each problem comes with its line and a fix. Reads HTML, JSX, Vue, Angular, Svelte and Lit templates. |

It works offline: everything it knows ships in the package, generated from the same sources as the docs.

## Setup

Install it in your project, so it matches the Unframed version you use:

```bash
npm install -D @unframed/mcp
```

Then add it to your assistant. Commit the config file, so your whole team gets it.

**Claude Code**

```bash
claude mcp add unframed --scope project -- npx unframed-mcp
```

**Cursor**: `.cursor/mcp.json`

```json
{ "mcpServers": { "unframed": { "command": "npx", "args": ["unframed-mcp"] } } }
```

**VS Code**: `.vscode/mcp.json`

```json
{ "servers": { "unframed": { "type": "stdio", "command": "npx", "args": ["unframed-mcp"] } } }
```

Other assistants: start `npx unframed-mcp` as a stdio MCP server.

To try it without installing, use `npx -y @unframed/mcp` as the command instead. It runs the latest version, which may not match yours.

In Claude Code, the [Unframed plugin](https://p-db.github.io/unframed-ui/docs/ai-assistants) includes the server and the skill.

## Use it

Ask for what you need, like "add a sign-up form with Unframed". The assistant finds the components, reads their API, writes the code and checks it with `validate_usage` before showing it to you.

**[Documentation](https://p-db.github.io/unframed-ui/)** · **[GitHub](https://github.com/P-DB/unframed-ui)**
