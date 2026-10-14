import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import '@unframed/tokens/tokens.css';
import '@unframed/core';
import './styles.css';
import { Layout } from './components/Layout';
import { ComponentPage } from './pages/ComponentPage';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { AiAssistants } from './pages/AiAssistants';
import { AngularGuide } from './pages/frameworks/Angular';
import { HtmlGuide } from './pages/frameworks/Html';
import { ReactGuide } from './pages/frameworks/React';
import { VueGuide } from './pages/frameworks/Vue';
import { GettingStarted } from './pages/GettingStarted';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Packages } from './pages/Packages';
import { ThemeGenerator } from './pages/ThemeGenerator';
import { Theming } from './pages/Theming';
import { Translations } from './pages/Translations';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'docs/getting-started', element: <GettingStarted /> },
      { path: 'docs/packages', element: <Packages /> },
      { path: 'docs/ai-assistants', element: <AiAssistants /> },
      { path: 'docs/frameworks/html', element: <HtmlGuide /> },
      { path: 'docs/frameworks/react', element: <ReactGuide /> },
      { path: 'docs/frameworks/vue', element: <VueGuide /> },
      { path: 'docs/frameworks/angular', element: <AngularGuide /> },
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
