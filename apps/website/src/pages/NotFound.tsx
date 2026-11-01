import { UfButton, UfEmptyState } from '@unframed/react';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page-error">
      <UfEmptyState icon="search">
        <h1 slot="heading">Page not found</h1>
        It may have moved, or the address has a typo. Try the search at the top, or start from the home page.
        <UfButton slot="actions" variant="primary" onClick={() => navigate('/')}>
          Home page
        </UfButton>
      </UfEmptyState>
    </div>
  );
}
