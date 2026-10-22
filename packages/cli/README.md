# @unframed/cli

[![npm](https://img.shields.io/npm/v/@unframed/cli?color=6930c3)](https://www.npmjs.com/package/@unframed/cli)

Copy [Unframed](https://p-db.github.io/unframed-ui/) components into your project, and own the code.

```bash
npx @unframed/cli init
```

```bash
npx @unframed/cli add dialog combobox   # copies the source and what it needs
npx @unframed/cli list                  # what's available, what you've added
npx @unframed/cli diff dialog           # compare your copy with upstream
```

Files go to `src/components/uf-ui/` by default, in TypeScript or JavaScript. Edited files are never overwritten unless you pass `--overwrite`.

## For AI assistants

```bash
npx @unframed/cli skill                          # .claude/skills/unframed (Claude Code)
npx @unframed/cli skill --dir .agents/skills     # any assistant that reads Agent Skills
```

Installs an [Agent Skill](https://agentskills.io): a `SKILL.md` with the rules for using Unframed, plus references with every component's API and examples, for this exact version. Run it again after upgrading.

In Claude Code you can install the same skill as a plugin instead, kept up to date with each release: `/plugin marketplace add P-DB/unframed-ui`, then `/plugin install unframed@unframed`.

**[Documentation](https://p-db.github.io/unframed-ui/)** · **[Storybook](https://p-db.github.io/unframed-ui/storybook/)** · **[GitHub](https://github.com/P-DB/unframed-ui)**

MIT licensed. Status: 0.x, APIs may change before 1.0.
