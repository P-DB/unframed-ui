# AI assistants

## The Unframed skill

An Agent Skill (agentskills.io format, read by Claude Code and many other assistants) that teaches an assistant to write Unframed code: which package to import from in each framework, every component's attributes, events, slots, parts and examples, the patterns that are easy to get wrong, and theming with tokens. It's generated from the same sources as the docs, so it matches the installed version.

## In Claude Code: install the plugin

The skill is also a Claude Code plugin, in this repository's marketplace. It works in every project, and updates with each Unframed release:

```
/plugin marketplace add P-DB/unframed-ui
/plugin install unframed@unframed
```

From a shell: `claude plugin marketplace add P-DB/unframed-ui`, then `claude plugin install unframed@unframed`. Start a new session afterwards. For a project pinned to an older Unframed version, use the project skill below, which matches the installed version.

## In your project: any assistant

1. From the project root (needs `@unframed/cli` 0.3.0 or later):

   ```bash
   npx @unframed/cli skill
   ```

2. Commit the new `.claude/skills/unframed` folder, so the whole team gets it.
3. Use the assistant as usual; it loads the skill when a task involves Unframed. Start a new session if one was running.
4. After upgrading Unframed, run the command again.

Other assistants read skills from their own folder: `npx @unframed/cli skill --dir .agents/skills`.

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
