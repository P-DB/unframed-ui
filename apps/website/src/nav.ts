import { pages } from './demos';

export interface NavEntry {
  to: string;
  label: string;
  /** Active only on this exact path, not on the pages below it. */
  end?: boolean;
}

/** The docs navigation: the sidebar on wide screens, the menu drawer on phones. */
export const navSections: { heading: string; links: NavEntry[] }[] = [
  {
    heading: 'Get started',
    links: [
      { to: '/docs/getting-started', label: 'Installation' },
      { to: '/docs/packages', label: 'Packages' },
      { to: '/docs/theming', label: 'Theming' },
      { to: '/docs/theme-generator', label: 'Theme generator' },
      { to: '/docs/translations', label: 'Translations' },
      { to: '/docs/ai-assistants', label: 'AI assistants' },
      { to: '/docs/stability', label: 'Stability' },
      { to: '/docs/changelog', label: 'Changelog' },
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

export const isActive = (entry: NavEntry, pathname: string) => (entry.end ? pathname === entry.to : pathname === entry.to || pathname.startsWith(`${entry.to}/`));

