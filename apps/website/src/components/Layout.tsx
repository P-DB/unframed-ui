import { UfButton, UfIcon, UfTooltip } from '@unframed/react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { pages } from '../demos';

type Theme = 'light' | 'dark';

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('uf-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Storage can be unavailable (private mode); fall back to the system setting.
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function Layout() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const { pathname } = useLocation();
  const inDocs = pathname.startsWith('/docs') || pathname.startsWith('/components');

  useEffect(() => {
    document.documentElement.dataset.ufTheme = theme;
    try {
      localStorage.setItem('uf-theme', theme);
    } catch {
      // Not persisted; the toggle still works for this visit.
    }
  }, [theme]);

  // On phones the sidebar is a horizontal strip: bring the current page's link into view.
  useEffect(() => {
    const link = document.querySelector<HTMLElement>('.sidebar a.active');
    const strip = link?.parentElement;
    if (link && strip && strip.scrollWidth > strip.clientWidth) strip.scrollLeft = link.offsetLeft - 16;
  }, [pathname]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <header className="site-header" data-uf-theme="dark">
        <div className="site-header-inner">
          <NavLink to="/" className="logo">
            <span className="logo-mark">
              <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                <path d="M9 8v10a7 7 0 0 0 14 0V8" fill="none" stroke="currentColor" strokeWidth="3.5" />
              </svg>
            </span>
            Unframed
          </NavLink>
          <nav className="site-nav" aria-label="Main">
            <NavLink to="/docs/getting-started">Docs</NavLink>
            <NavLink to="/components">Components</NavLink>
          </nav>
          <UfTooltip content={`Switch to ${next} theme`} placement="bottom">
            <UfButton variant="ghost" size="sm" label={`Switch to ${next} theme`} onClick={() => setTheme(next)}>
              <UfIcon slot="prefix" name={theme === 'dark' ? 'sun' : 'moon'} />
            </UfButton>
          </UfTooltip>
        </div>
      </header>

      {inDocs ? (
        <div className="docs-layout">
          <aside className="sidebar" aria-label="Documentation">
            <h4>Get started</h4>
            <NavLink to="/docs/getting-started">Installation</NavLink>
            <NavLink to="/docs/theming">Theming</NavLink>
            <h4>Components</h4>
            <NavLink to="/components" end>
              Overview
            </NavLink>
            {pages.map((page) => (
              <NavLink key={page.slug} to={`/components/${page.slug}`}>
                {page.title}
              </NavLink>
            ))}
          </aside>
          <main className="docs-content">
            <Outlet />
          </main>
        </div>
      ) : (
        <main>
          <Outlet />
        </main>
      )}

      <footer className="site-footer">
        <div>Unframed is MIT licensed. Built with Lit, documented with Unframed.</div>
      </footer>
      <ScrollRestoration />
    </>
  );
}
