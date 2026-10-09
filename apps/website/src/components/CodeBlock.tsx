import { toast } from '@unframed/core';
import { UfButton } from '@unframed/react';
import { useId, useState, type KeyboardEvent } from 'react';

export interface CodeSample {
  label: string;
  code: string;
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
        <code>{sample.code}</code>
      </pre>
    </div>
  );
}
