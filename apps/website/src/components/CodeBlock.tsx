import { toast } from '@unframed/core';
import { UfButton } from '@unframed/react';
import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import type { ThemedToken } from 'shiki/core';
import { guessLang, tokenize, type Lang } from '../highlight';

export interface CodeSample {
  label: string;
  code: string;
  /** Grammar for highlighting; guessed from the label when omitted. */
  lang?: Lang;
}

/** Highlighted code. Shows plain text until the highlighter has loaded. */
function Code({ code, lang }: { code: string; lang: Lang }) {
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);

  useEffect(() => {
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
  }, [code, lang]);

  if (!tokens) return <code>{code}</code>;
  return (
    <code>
      {tokens.map((line, i) => (
        <span key={i} className="line">
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

/** Code with optional tabs (e.g. HTML / React) and a copy button. */
export function CodeBlock({ samples, standalone = false }: { samples: CodeSample[]; standalone?: boolean }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const sample = samples[active];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sample.code);
      toast('Copied to clipboard', { variant: 'success', duration: 2000 });
    } catch {
      toast('Copying is not available here', { variant: 'warning' });
    }
  };

  // Tabs pattern: arrow keys move between languages.
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + samples.length) % samples.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div className={`code-block${standalone ? ' standalone' : ''}`}>
      <div className="code-tabs" role="tablist" aria-label="Code language" onKeyDown={onKeyDown}>
        {samples.map((s, i) => (
          <button
            key={s.label}
            id={`${id}-tab-${i}`}
            className="code-tab"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
        <UfButton className="code-copy" variant="ghost" size="sm" onClick={copy}>
          Copy
        </UfButton>
      </div>
      <pre id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <Code code={sample.code} lang={sample.lang ?? guessLang(sample.label, sample.code)} />
      </pre>
    </div>
  );
}
