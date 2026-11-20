# AI assistants

## The Unframed skill

An Agent Skill (agentskills.io format, read by Claude Code and many other assistants) that teaches an assistant to write Unframed code: which package to import from in each framework, every component's attributes, events, slots, parts and examples, the patterns that are easy to get wrong, and theming with tokens. It's generated from the same sources as the docs, so it matches the installed version.

## In Claude Code: install the plugin

The skill is also a Claude Code plugin, in this repository's marketplace. It works in every project, and updates with each Unframed release:

```
/plugin marketplace add P-DB/unframed-ui
/plugin install unframed@unframed
```

From a shell: `claude plugin marketplace add P-DB/unframed-ui`, then `claude plugin install unframed@unframed`. Start a new session afterwards. The plugin also starts the MCP server. For a project pinned to an older Unframed version, use the project skill and server below, which match the installed version.

## In your project: any assistant

1. From the project root (needs `@unframed/cli` 0.3.0 or later):

   ```bash
   npx @unframed/cli skill
   ```

2. Commit the new `.claude/skills/unframed` folder, so the whole team gets it.
3. Use the assistant as usual; it loads the skill when a task involves Unframed. Start a new session if one was running.
4. After upgrading Unframed, run the command again.

Other assistants read skills from their own folder: `npx @unframed/cli skill --dir .agents/skills`.

## The MCP server

`@unframed/mcp` is an MCP server: the assistant starts it on its own and calls its tools while it works.

- `list_components` finds the right component; `get_component` returns its examples and full API.
- `validate_usage` checks the code the assistant wrote: unknown tags, attributes and events, invalid values, `disabled="false"` and missing labels, each with its line and a fix. It reads HTML, JSX, Vue, Angular, Svelte and Lit templates.

Install it in the project, so it matches the Unframed version: `npm install -D @unframed/mcp`. Then add it to the assistant and commit the config file:

- Claude Code: `claude mcp add unframed --scope project -- npx unframed-mcp`
- Cursor, `.cursor/mcp.json`: `{ "mcpServers": { "unframed": { "command": "npx", "args": ["unframed-mcp"] } } }`
- VS Code, `.vscode/mcp.json`: `{ "servers": { "unframed": { "type": "stdio", "command": "npx", "args": ["unframed-mcp"] } } }`
- Other assistants: start `npx unframed-mcp` as a stdio MCP server.

To try it without installing: `npx -y @unframed/mcp`, which runs the latest version.

## What's inside

```
.claude/skills/unframed/
├── SKILL.md                  # when to use it, the rules, every component and its import
└── references/
    ├── components.md         # each component's API and examples
    ├── frameworks.md         # setup and usage in HTML, React, Vue and Angular
    └── theming.md            # tokens, custom properties, ::part(), dark mode
```

Add your team's conventions to `SKILL.md`. Running `skill` again keeps an edited file; `--overwrite` replaces it.

## Assistants that read the web

`llms.txt` indexes these docs as Markdown; `llms-full.txt` has everything in one file.
