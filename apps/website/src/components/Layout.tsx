import { UfButton, UfDrawer, UfIcon, UfTooltip } from '@unframed/react';
import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, ScrollRestoration, useLocation, useNavigate, useOutletContext } from 'react-router';
import { pages } from '../demos';
import { LogoMark } from './Logo';

export type Theme = 'light' | 'dark';

/** The site's current light or dark mode, for pages that render previews in it. */
export const useSiteTheme = () => useOutletContext<Theme>();

interface NavEntry {
  to: string;
  label: string;
  /** Active only on this exact path, not on the pages below it. */
  end?: boolean;
}

/** The docs navigation: the sidebar on wide screens, the menu drawer on phones. */
const navSections: { heading: string; links: NavEntry[] }[] = [
  {
    heading: 'Get started',
    links: [
      { to: '/docs/getting-started', label: 'Installation' },
      { to: '/docs/packages', label: 'Packages' },
      { to: '/docs/theming', label: 'Theming' },
      { to: '/docs/theme-generator', label: 'Theme generator' },
      { to: '/docs/translations', label: 'Translations' },
      { to: '/docs/ai-assistants', label: 'AI assistants' },
    ],
  },
  {
    heading: 'Frameworks',
    links: [
      { to: '/docs/frameworks/html', label: 'HTML & JavaScript' },
      { to: '/docs/frameworks/react', label: 'React' },
      { to: '/docs/frameworks/vue', label: 'Vue' },
      { to: '/docs/frameworks/angular', label: 'Angular' },
      { to: '/docs/ssr', label: 'Server-side rendering' },
    ],
  },
  {
    heading: 'Components',
    links: [{ to: '/components', label: 'Overview', end: true }, ...pages.map((page) => ({ to: `/components/${page.slug}`, label: page.title }))],
  },
];

const isActive = (entry: NavEntry, pathname: string) => (entry.end ? pathname === entry.to : pathname === entry.to || pathname.startsWith(`${entry.to}/`));

/**
 * The navigation on phones: a Menu button that opens it in a <uf-drawer>, each
 * page a <uf-button> link. Links navigate inside the app and close the drawer.
 */
function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const current = navSections.flatMap((s) => s.links).find((entry) => isActive(entry, pathname));

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="docs-menu">
      <UfButton variant="outline" size="sm" aria-expanded={open ? 'true' : 'false'} onClick={() => setOpen(true)}>
        Menu
      </UfButton>
      {current && <span className="docs-menu__current">{current.label}</span>}
      <UfDrawer
        className="docs-menu__drawer"
        label="Documentation"
        placement="start"
        open={open}
        lightDismiss
        onUfShow={(event) => {
          // Long list: start with the current page in view.
          (event.currentTarget as HTMLElement).querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
        }}
        onUfHide={() => setOpen(false)}
      >
        <nav className="docs-menu__nav" aria-label="Documentation">
          {navSections.map((section) => (
            <section key={section.heading} className="docs-menu__section">
              <h2 className="docs-menu__heading">{section.heading}</h2>
              {section.links.map((entry) => {
                const active = isActive(entry, pathname);
                return (
                  <UfButton
                    key={entry.to}
                    className={`docs-menu__link${active ? ' docs-menu__link--active' : ''}`}
                    variant="ghost"
                    href={entry.to}
                    aria-current={active ? 'page' : undefined}
                    onClick={(event) => {
                      // Plain clicks stay in the app; Ctrl/Cmd/Shift-clicks open a new tab as usual.
                      if (event.ctrlKey || event.metaKey || event.shiftKey) return;
                      event.preventDefault();
                      navigate(entry.to);
                    }}
                  >
                    {entry.label}
                  </UfButton>
                );
              })}
            </section>
          ))}
        </nav>
      </UfDrawer>
    </div>
  );
}

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

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <header className="site-header" data-uf-theme="dark">
        <div className="site-header__inner">
          <NavLink to="/" className="site-header__logo">
            <LogoMark className="site-header__logo-mark" />
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
          <MobileMenu pathname={pathname} />
          <nav className="docs-layout__sidebar sidebar" aria-label="Documentation">
            {navSections.map((section) => (
              <div key={section.heading} className="sidebar__section">
                <h4 className="sidebar__heading">{section.heading}</h4>
                {section.links.map((entry) => (
                  <NavLink key={entry.to} to={entry.to} end={entry.end} className={sidebarLink}>
                    {entry.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
          <main className="docs-layout__content">
            <Suspense fallback={null}>
              <Outlet context={theme} />
            </Suspense>
          </main>
        </div>
      ) : (
        <main>
          <Suspense fallback={null}>
            <Outlet context={theme} />
          </Suspense>
        </main>
      )}

      <footer className="site-footer">
        <div className="site-footer__inner">
          <span>Unframed is MIT licensed. Built with Lit.</span>
          <span className="site-footer__credit">
            Made by{' '}
            <UfButton variant="link" size="sm" href="https://p-db.github.io/" target="_blank">
              Patrizio Di Bartolomeo
            </UfButton>
          </span>
        </div>
      </footer>
      <ScrollRestoration />
    </>
  );
}
