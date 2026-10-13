import type { ButtonVariant } from '@unframed/core';
import { UfButton } from '@unframed/react';
import type { ReactNode } from 'react';
import { useHref, useNavigate } from 'react-router';

/**
 * A button that links to a page of this site: a real link (new tab, copy link),
 * but in-app navigation on a plain click.
 */
export function LinkButton({ to, variant, children }: { to: string; variant?: ButtonVariant; children: ReactNode }) {
  const href = useHref(to);
  const navigate = useNavigate();
  return (
    <UfButton
      variant={variant}
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </UfButton>
  );
}
