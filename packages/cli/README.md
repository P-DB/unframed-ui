# @unframed/cli

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

**[Documentation](https://p-db.github.io/unframed-ui/)** · **[Storybook](https://p-db.github.io/unframed-ui/storybook/)** · **[GitHub](https://github.com/P-DB/unframed-ui)**

MIT licensed. Status: 0.x, APIs may change before 1.0.
