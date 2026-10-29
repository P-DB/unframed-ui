import { lazy, StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import '@unframed/tokens/tokens.css';
import '@unframed/core';
import './styles.css';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';

// Every page but the home page loads when it's first opened, so the first visit downloads less.
const page = <T extends string>(load: () => Promise<Record<T, ComponentType>>, name: T) =>
  lazy(() => load().then((module) => ({ default: module[name] })));

const ComponentPage = page(() => import('./pages/ComponentPage'), 'ComponentPage');
const ComponentsIndex = page(() => import('./pages/ComponentsIndex'), 'ComponentsIndex');
const AiAssistants = page(() => import('./pages/AiAssistants'), 'AiAssistants');
const AngularGuide = page(() => import('./pages/frameworks/Angular'), 'AngularGuide');
const HtmlGuide = page(() => import('./pages/frameworks/Html'), 'HtmlGuide');
const ReactGuide = page(() => import('./pages/frameworks/React'), 'ReactGuide');
const VueGuide = page(() => import('./pages/frameworks/Vue'), 'VueGuide');
const GettingStarted = page(() => import('./pages/GettingStarted'), 'GettingStarted');
const NotFound = page(() => import('./pages/NotFound'), 'NotFound');
const Packages = page(() => import('./pages/Packages'), 'Packages');
const Stability = page(() => import('./pages/Stability'), 'Stability');
const ThemeGenerator = page(() => import('./pages/ThemeGenerator'), 'ThemeGenerator');
const Theming = page(() => import('./pages/Theming'), 'Theming');
const Translations = page(() => import('./pages/Translations'), 'Translations');
const Ssr = page(() => import('./pages/Ssr'), 'Ssr');

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'docs/getting-started', element: <GettingStarted /> },
      { path: 'docs/packages', element: <Packages /> },
      { path: 'docs/stability', element: <Stability /> },
      { path: 'docs/ai-assistants', element: <AiAssistants /> },
      { path: 'docs/frameworks/html', element: <HtmlGuide /> },
      { path: 'docs/frameworks/react', element: <ReactGuide /> },
      { path: 'docs/frameworks/vue', element: <VueGuide /> },
      { path: 'docs/frameworks/angular', element: <AngularGuide /> },
      { path: 'docs/ssr', element: <Ssr /> },
      { path: 'docs/theming', element: <Theming /> },
      { path: 'docs/theme-generator', element: <ThemeGenerator /> },
      { path: 'docs/translations', element: <Translations /> },
      { path: 'components', element: <ComponentsIndex /> },
      { path: 'components/:slug', element: <ComponentPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], {
  // '/' locally, '/unframed-ui/' on GitHub Pages.
  basename: import.meta.env.BASE_URL,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
