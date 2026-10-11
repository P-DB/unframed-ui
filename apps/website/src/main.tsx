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
import { GettingStarted } from './pages/GettingStarted';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Theming } from './pages/Theming';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'docs/getting-started', element: <GettingStarted /> },
      { path: 'docs/theming', element: <Theming /> },
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
