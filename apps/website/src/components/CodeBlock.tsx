import { toast } from '@unframed/core';
import { UfButton, UfTab, UfTabPanel, UfTabs } from '@unframed/react';
import { useEffect, useState } from 'react';
import type { ThemedToken } from 'shiki/core';
import { guessLang, tokenize, type Lang } from '../highlight';

export interface CodeSample {
  label: string;
  code: string;
  /** Grammar for highlighting; guessed from the label when omitted. */
  lang?: Lang;
}

/** Highlighted code. Shows plain text until the highlighter has loaded, or while `highlight` is off. */
function Code({ code, lang, highlight }: { code: string; lang: Lang; highlight: boolean }) {
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);

  useEffect(() => {
    if (!highlight) return;
    let current = true;
    setTokens(null);
    tokenize(code, lang)
      .then((t) => current && setTokens(t))
      .catch(() => {
        // Highlighting is an enhancement: keep the plain code.
      });
    return () => {
      current = false;
    };
  }, [code, lang, highlight]);

  if (!tokens) return <code>{code}</code>;
  return (
    <code>
      {tokens.map((line, i) => (
        <span key={i}>
          {line.map((token, j) => (
            <span
              key={j}
              style={{
                color: token.color,
                fontStyle: token.fontStyle && token.fontStyle & 1 ? 'italic' : undefined,
                fontWeight: token.fontStyle && token.fontStyle & 2 ? 600 : undefined,
              }}
            >
              {token.content}
            </span>
          ))}
          {i < tokens.length - 1 ? '\n' : null}
        </span>
      ))}
    </code>
  );
}

/** Code with tabs (e.g. HTML / React), drawn by `<uf-tabs>`, and a copy button. */
export function CodeBlock({ samples, standalone = false }: { samples: CodeSample[]; standalone?: boolean }) {
  const [active, setActive] = useState(0);
  // Samples shown at least once: highlighted, and kept highlighted when you switch back.
  const [seen, setSeen] = useState(() => new Set([0]));
  const sample = samples[active];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sample.code);
      toast('Copied to clipboard', { variant: 'success', duration: 2000 });
    } catch {
      toast('Copying is not available here', { variant: 'warning' });
    }
  };

  return (
    <div className={`code-block${standalone ? ' code-block--standalone' : ''}`}>
      <UfTabs
        className="code-block__tabs"
        label="Code language"
        active={`code-${active}`}
        onUfTabChange={(event) => {
          const index = Number(event.detail.name.replace('code-', ''));
          setActive(index);
          setSeen((previous) => new Set(previous).add(index));
        }}
      >
        {samples.map((s, i) => (
          <UfTab key={s.label} panel={`code-${i}`}>
            {s.label}
          </UfTab>
        ))}
        {samples.map((s, i) => (
          <UfTabPanel key={s.label} name={`code-${i}`}>
            {/*
              Every panel holds its code, so the one a tab shows is never empty for a frame
              (that made the page jump). Only samples you open are highlighted, so a page
              loads only the grammars it shows.
            */}
            <pre className="code-block__panel">
              <Code code={s.code} lang={s.lang ?? guessLang(s.label, s.code)} highlight={seen.has(i)} />
            </pre>
          </UfTabPanel>
        ))}
      </UfTabs>
      {/* Beside the tab list, not in it: a tab list holds only tabs. */}
      <UfButton className="code-block__copy" variant="ghost" size="sm" onClick={copy}>
        Copy
      </UfButton>
    </div>
  );
}
