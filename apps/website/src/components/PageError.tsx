import { UfButton, UfEmptyState } from '@unframed/react';
import { useEffect, useState } from 'react';
import { useNavigate, useRouteError } from 'react-router';

const reloadKey = 'uf-reloaded';

/**
 * A page's code is split into files named after their content. After a deploy, a
 * tab opened before it asks for files that no longer exist: Chrome, Firefox and
 * Safari each word that failure differently.
 */
function isStaleBuild(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message);
}

/** Not again right after a reload: then it isn't an old tab, so show the message. */
function reloadedRecently(): boolean {
  try {
    return Date.now() - Number(sessionStorage.getItem(reloadKey)) < 10_000;
  } catch {
    return true;
  }
}

/**
 * Shown in place of a page that failed to load or render, inside the site's
 * header and footer. A page missing after a deploy reloads once, to get the new
 * version; if that doesn't help, or it's another error, an empty state offers to
 * try again.
 */
export function PageError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const stale = isStaleBuild(error);
  // Decided once, so a page that reloads shows nothing meanwhile.
  const [reloading] = useState(() => stale && !reloadedRecently());

  useEffect(() => {
    if (!reloading) return;
    try {
      sessionStorage.setItem(reloadKey, String(Date.now()));
    } catch {
      // Storage is full: reload without the guard.
    }
    window.location.reload();
  }, [reloading]);

  if (reloading) return null;

  return (
    <div className="page-error">
      <UfEmptyState icon="alert-circle">
        <h1 slot="heading">This page didn't load</h1>
        {stale
          ? 'The docs were updated since you opened them. Reloading gets the new version.'
          : 'Something went wrong while showing this page. Reloading usually fixes it.'}
        <UfButton slot="actions" variant="primary" onClick={() => window.location.reload()}>
          Reload
        </UfButton>
        <UfButton slot="actions" variant="secondary" onClick={() => navigate('/')}>
          Home page
        </UfButton>
      </UfEmptyState>
    </div>
  );
}
