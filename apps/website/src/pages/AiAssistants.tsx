import { CodeBlock, type CodeSample } from '../components/CodeBlock';

const tree = `.claude/skills/unframed/
├── SKILL.md                  # when to use it, the rules, every component and its import
└── references/
    ├── components.md         # each component's API and examples
    ├── frameworks.md         # setup and usage in HTML, React, Vue and Angular
    └── theming.md            # tokens, custom properties, ::part(), dark mode`;

// JSON is highlighted as JavaScript, which also shows the file name comment.
const mcpSetup: CodeSample[] = [
  { label: 'Claude Code', lang: 'bash', code: 'claude mcp add unframed --scope project -- npx unframed-mcp' },
  { label: 'Cursor', lang: 'javascript', code: '// .cursor/mcp.json\n{ "mcpServers": { "unframed": { "command": "npx", "args": ["unframed-mcp"] } } }' },
  { label: 'VS Code', lang: 'javascript', code: '// .vscode/mcp.json\n{ "servers": { "unframed": { "type": "stdio", "command": "npx", "args": ["unframed-mcp"] } } }' },
];

const prompts = [
  'Add a sign-up form with Unframed: email, password, terms checkbox, and a submit button that shows a success toast.',
  'Show the orders in an Unframed table, sortable by date and amount, with pagination of 20 rows.',
  'Make our Unframed theme teal with rounded buttons.',
];

export function AiAssistants() {
  const base = import.meta.env.BASE_URL;
  return (
    <article>
      <h1>AI assistants</h1>
      <p className="lead">
        Give your coding assistant the Unframed skill, and it writes Unframed code the way the docs do: the right
        components, attributes, events and form bindings for your framework and your version. Add the MCP server, and it
        checks that code before showing it to you.
      </p>

      <h2>The Unframed skill</h2>
      <p>
        A skill is a folder of instructions that an assistant loads when a task needs it. The Unframed skill uses the{' '}
        <a href="https://agentskills.io" target="_blank" rel="noreferrer">
          Agent Skills
        </a>{' '}
        format, read by Claude Code and many other assistants. It teaches:
      </p>
      <ul>
        <li>which package to import from, in HTML, React, Vue or Angular, and how to set up the tokens;</li>
        <li>every component, with its attributes, events, slots, parts and examples;</li>
        <li>the patterns that are easy to get wrong: boolean attributes, event names, forms and validation, labels, options as children, table data as properties, closing dialogs;</li>
        <li>theming with tokens, custom properties and <code>::part()</code>, instead of overriding internals.</li>
      </ul>
      <p>It's generated from the same sources as these docs, so it always matches the version you install.</p>

      <h2>In Claude Code: install the plugin</h2>
      <p>
        The skill is also a Claude Code plugin, in this repository's marketplace. Add the marketplace once, then install
        the plugin: it works in every project, and Claude Code updates it with each Unframed release.
      </p>
      <CodeBlock
        standalone
        samples={[
          { label: 'Claude Code', lang: 'bash', code: '/plugin marketplace add P-DB/unframed-ui\n/plugin install unframed@unframed' },
          { label: 'Terminal', lang: 'bash', code: 'claude plugin marketplace add P-DB/unframed-ui\nclaude plugin install unframed@unframed' },
        ]}
      />
      <p>
        Start a new session afterwards. The skill is the same as the one below; the plugin just keeps it up to date for
        you, and starts the MCP server too. If your project pins an older Unframed version, use the project skill and
        server instead, which match the version you install.
      </p>

      <h2>In your project: any assistant</h2>
      <ol>
        <li>
          <p>From your project's root, install the skill. It needs <code>@unframed/cli</code> 0.3.0 or later.</p>
          <CodeBlock standalone samples={[{ label: 'Terminal', code: 'npx @unframed/cli skill' }]} />
        </li>
        <li>
          <p>
            Commit the new <code>.claude/skills/unframed</code> folder, so your whole team, and their assistants, get it.
          </p>
        </li>
        <li>
          <p>
            Use your assistant as usual. It picks the skill up whenever a task involves Unframed. If it was already
            running, start a new session.
          </p>
        </li>
        <li>
          <p>After upgrading Unframed, run the command again to update the skill.</p>
        </li>
      </ol>

      <h2>Other assistants</h2>
      <p>
        <code>.claude/skills</code> is where Claude Code reads a project's skills. Other assistants that support Agent
        Skills read their own folder: check their docs, and pass it with <code>--dir</code>.
      </p>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: 'npx @unframed/cli skill --dir .agents/skills' }]} />

      <h2>The MCP server</h2>
      <p>
        <code>@unframed/mcp</code> is an{' '}
        <a href="https://modelcontextprotocol.io" target="_blank" rel="noreferrer">
          MCP
        </a>{' '}
        server: your assistant starts it on its own and calls its tools while it works.
      </p>
      <ul>
        <li>
          <code>list_components</code> finds the right component, and <code>get_component</code> returns its examples and
          full API.
        </li>
        <li>
          <code>validate_usage</code> checks the code the assistant wrote: unknown tags, attributes and events, invalid
          values, <code>disabled="false"</code> and missing labels, each with its line and a fix. It reads HTML, JSX, Vue,
          Angular, Svelte and Lit templates.
        </li>
      </ul>
      <p>Install it in your project, so it matches your Unframed version:</p>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: 'npm install -D @unframed/mcp' }]} />
      <p>Then add it to your assistant, and commit the config file so your team gets it too:</p>
      <CodeBlock standalone samples={mcpSetup} />
      <p>
        Other assistants: start <code>npx unframed-mcp</code> as a stdio MCP server. To try it without installing, use{' '}
        <code>npx -y @unframed/mcp</code>, which runs the latest version. The Claude Code plugin above already includes
        it.
      </p>

      <h2>What's inside</h2>
      <CodeBlock standalone samples={[{ label: 'Files', lang: 'bash', code: tree }]} />
      <p>
        <code>SKILL.md</code> stays short, because assistants read it often. The references are only read when a task
        needs them, like the API of a component the assistant is about to use.
      </p>

      <h2>Make it yours</h2>
      <p>
        Add your team's conventions to <code>SKILL.md</code>, like "use ghost buttons for secondary actions" or "every
        table has a label". Running <code>skill</code> again keeps an edited file; pass <code>--overwrite</code> to
        replace it with the new version, and add your notes back.
      </p>

      <h2>Try it</h2>
      <p>Ask for what you need in your own words, for example:</p>
      <ul>
        {prompts.map((prompt) => (
          <li key={prompt}>
            <q>{prompt}</q>
          </li>
        ))}
      </ul>

      <h2>Assistants that read the web</h2>
      <p>
        No install needed for assistants that browse: point them to <a href={`${base}llms.txt`}>llms.txt</a>, an index of
        these docs as Markdown, or give them <a href={`${base}llms-full.txt`}>llms-full.txt</a>, everything in one file.
        Each component also has its own page, like{' '}
        <a href={`${base}llms/components/dialog.md`}>llms/components/dialog.md</a>.
      </p>
    </article>
  );
}
