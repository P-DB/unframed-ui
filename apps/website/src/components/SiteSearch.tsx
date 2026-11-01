import { UfButton, UfCombobox, UfDialog, UfIcon } from '@unframed/react';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { useNavigate } from 'react-router';
import { navSections } from '../nav';
import type { Theme } from './Layout';

/** The <uf-combobox> element, typed by the React wrapper. */
type Combobox = ComponentRef<typeof UfCombobox>;

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * Search across every page of the docs, from the header or with ⌘K / Ctrl+K: a
 * <uf-combobox> in a <uf-dialog>, with the pages grouped like the sidebar.
 * Picking one goes to it. The dialog takes the page's theme, not the header's.
 */
export function SiteSearch({ theme }: { theme: Theme }) {
  const [open, setOpen] = useState(false);
  const combobox = useRef<Combobox>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <UfButton variant="ghost" size="sm" className="site-search__button" label="Search the docs" onClick={() => setOpen(true)}>
        <UfIcon slot="prefix" name="search" />
        <span className="site-search__text">Search</span>
        <kbd slot="suffix" className="site-search__key">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </UfButton>
      <UfDialog
        className="site-search"
        data-uf-theme={theme}
        label="Search the docs"
        open={open}
        lightDismiss
        onUfShow={() => {
          // A fresh search each time. The list opens once you type.
          const field = combobox.current;
          if (!field) return;
          field.value = '';
          field.focus();
        }}
        onUfHide={() => setOpen(false)}
      >
        <UfCombobox
          ref={combobox}
          label="Page"
          placeholder="Components, guides…"
          onChange={(event) => {
            const to = (event.currentTarget as Combobox).value;
            if (!to) return;
            setOpen(false);
            navigate(to);
          }}
        >
          {navSections.map((section) => (
            <optgroup key={section.heading} label={section.heading}>
              {section.links.map((link) => (
                <option key={link.to} value={link.to}>
                  {section.heading === 'Components' && link.label === 'Overview' ? 'All components' : link.label}
                </option>
              ))}
            </optgroup>
          ))}
        </UfCombobox>
      </UfDialog>
    </>
  );
}
