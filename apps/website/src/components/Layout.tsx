import { UfButton, UfIcon, UfTooltip } from '@unframed/react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { pages } from '../demos';

type Theme = 'light' | 'dark';

/** BEM classes for NavLinks, with the --active modifier on the current page. */
const sidebarLink = ({ isActive }: { isActive: boolean }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`;
const headerLink = ({ isActive }: { isActive: boolean }) =>
  `site-header__link${isActive ? ' site-header__link--active' : ''}`;

/** The visitor's saved choice, or dark: the site's default look. */
function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('uf-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Storage can be unavailable (private mode); use the default.
  }
  return 'dark';
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
    const link = document.querySelector<HTMLElement>('.sidebar__link--active');
    const strip = link?.parentElement;
    if (link && strip && strip.scrollWidth > strip.clientWidth) strip.scrollLeft = link.offsetLeft - 16;
  }, [pathname]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <header className="site-header" data-uf-theme="dark">
        <div className="site-header__inner">
          <NavLink to="/" className="site-header__logo">
            <span className="site-header__logo-mark">
              <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                <path d="M9 8v10a7 7 0 0 0 14 0V8" fill="none" stroke="currentColor" strokeWidth="3.5" />
              </svg>
            </span>
            Unframed
          </NavLink>
          <nav className="site-header__nav" aria-label="Main">
            <NavLink to="/docs/getting-started" className={headerLink}>
              Docs
            </NavLink>
            <NavLink to="/components" className={headerLink}>
              Components
            </NavLink>
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
          <aside className="docs-layout__sidebar sidebar" aria-label="Documentation">
            <h4 className="sidebar__heading">Get started</h4>
            <NavLink to="/docs/getting-started" className={sidebarLink}>Installation</NavLink>
            <NavLink to="/docs/packages" className={sidebarLink}>Packages</NavLink>
            <NavLink to="/docs/theming" className={sidebarLink}>Theming</NavLink>
            <h4 className="sidebar__heading">Frameworks</h4>
            <NavLink to="/docs/frameworks/html" className={sidebarLink}>HTML &amp; JavaScript</NavLink>
            <NavLink to="/docs/frameworks/react" className={sidebarLink}>React</NavLink>
            <NavLink to="/docs/frameworks/vue" className={sidebarLink}>Vue</NavLink>
            <NavLink to="/docs/frameworks/angular" className={sidebarLink}>Angular</NavLink>
            <h4 className="sidebar__heading">Components</h4>
            <NavLink to="/components" end className={sidebarLink}>
              Overview
            </NavLink>
            {pages.map((page) => (
              <NavLink key={page.slug} to={`/components/${page.slug}`} className={sidebarLink}>
                {page.title}
              </NavLink>
            ))}
          </aside>
          <main className="docs-layout__content">
            <Outlet />
          </main>
        </div>
      ) : (
        <main>
          <Outlet />
        </main>
      )}

      <footer className="site-footer">
        <div className="site-footer__inner">Unframed is MIT licensed. Built with Lit, documented with Unframed.</div>
      </footer>
      <ScrollRestoration />
    </>
  );
}
