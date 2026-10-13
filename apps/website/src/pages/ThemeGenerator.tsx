import tokens from '@unframed/tokens/tokens.json';
import {
  UfAvatar,
  UfBadge,
  UfButton,
  UfCard,
  UfCheckbox,
  UfInput,
  UfPagination,
  UfRadio,
  UfRadioGroup,
  UfSelect,
  UfSwitch,
  UfTab,
  UfTabPanel,
  UfTabs,
} from '@unframed/react';
import type { CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CodeBlock } from '../components/CodeBlock';
import { contrast, generatePalette, parseHex, STEPS, type Palette } from '../theme/color';

// Only string tokens are read here (colors, radii, font stacks); font weights are numbers.
const base = tokens.base as Record<string, string | number> as Record<string, string>;
const paletteOf = (name: string) => Object.fromEntries(STEPS.map((step) => [step, base[`--uf-palette-${name}-${step}`]])) as Palette;
const defaultAccent = paletteOf('accent');
const defaultDanger = paletteOf('danger');
const surface = { light: (tokens.light as Record<string, string>)['--uf-color-surface'], dark: (tokens.dark as Record<string, string>)['--uf-color-surface'] };

const fonts: [string, string][] = [
  ['System', base['--uf-font-family-sans']],
  ['Rounded', "ui-rounded, 'SF Pro Rounded', 'Varela Round', system-ui, sans-serif"],
  ['Humanist', "Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif"],
  ['Serif', "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif"],
  ['Mono', base['--uf-font-family-mono']],
];

const defaults = {
  accent: defaultAccent['600'],
  danger: defaultDanger['600'],
  control: parseInt(base['--uf-radius-control'], 10),
  surface: parseInt(base['--uf-radius-md'], 10),
  font: 'System',
};

/** The theme's settings, kept in the URL so a theme can be shared as a link. */
function useTheme() {
  const [params, setParams] = useSearchParams();
  const color = (key: 'accent' | 'danger') => {
    const value = params.get(key);
    return value && parseHex(value) ? `#${value.replace('#', '').toLowerCase()}` : defaults[key];
  };
  const number = (key: 'control' | 'surface', max: number) => {
    const value = Number(params.get(key));
    return params.has(key) && Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value))) : defaults[key];
  };
  const theme = {
    accent: color('accent'),
    danger: color('danger'),
    control: number('control', 24),
    surface: number('surface', 24),
    font: fonts.some(([name]) => name === params.get('font')) ? params.get('font')! : defaults.font,
  };
  const set = (changes: Partial<typeof theme>) => {
    const next = { ...theme, ...changes };
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value !== defaults[key as keyof typeof defaults]) search.set(key, String(value).replace('#', ''));
    }
    setParams(search, { replace: true, preventScrollReset: true });
  };
  return [theme, set] as const;
}

type Theme = ReturnType<typeof useTheme>[0];

/** The custom properties a theme overrides, as name -> value. Only what differs from the defaults. */
function themeVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  if (theme.accent !== defaults.accent) {
    const palette = generatePalette(theme.accent, defaultAccent);
    for (const step of STEPS) vars[`--uf-palette-accent-${step}`] = palette[step];
  }
  if (theme.danger !== defaults.danger) {
    const palette = generatePalette(theme.danger, defaultDanger);
    for (const step of STEPS) vars[`--uf-palette-danger-${step}`] = palette[step];
  }
  if (theme.control !== defaults.control) vars['--uf-radius-control'] = `${theme.control}px`;
  if (theme.surface !== defaults.surface) {
    vars['--uf-radius-sm'] = `${Math.round(theme.surface / 2)}px`;
    vars['--uf-radius-md'] = `${theme.surface}px`;
    vars['--uf-radius-lg'] = `${Math.round(theme.surface * 1.5)}px`;
  }
  if (theme.font !== defaults.font) vars['--uf-font-family-sans'] = fonts.find(([name]) => name === theme.font)![1];
  return vars;
}

function Preview({ mode, vars }: { mode: 'light' | 'dark'; vars: Record<string, string> }) {
  return (
    <div className="theme-generator__preview" data-uf-theme={mode} style={vars as CSSProperties}>
      <div className="theme-generator__preview-label">{mode === 'light' ? 'Light' : 'Dark'}</div>
      <div className="theme-generator__row">
        <UfButton>Primary</UfButton>
        <UfButton variant="secondary">Secondary</UfButton>
        <UfButton variant="outline">Outline</UfButton>
        <UfButton variant="danger">Delete</UfButton>
        <UfButton variant="link">Link</UfButton>
      </div>
      <div className="theme-generator__grid">
        <UfInput label="Email" value="john@example.com" />
        <UfSelect label="Plan" value="pro">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </UfSelect>
      </div>
      <div className="theme-generator__row">
        <UfCheckbox checked>Updates</UfCheckbox>
        <UfSwitch checked>Sync</UfSwitch>
        <UfRadioGroup label="Size" value="m" orientation="horizontal">
          <UfRadio value="s">S</UfRadio>
          <UfRadio value="m">M</UfRadio>
        </UfRadioGroup>
      </div>
      <div className="theme-generator__row">
        <UfBadge variant="accent">Accent</UfBadge>
        <UfBadge variant="accent" appearance="solid">Solid</UfBadge>
        <UfBadge variant="danger">Overdue</UfBadge>
        <UfBadge variant="success" dot>
          Online
        </UfBadge>
      </div>
      <UfCard>
        <span slot="header" className="theme-generator__card-header">
          <UfAvatar name="John Smith" decorative size="sm" />
          <strong>John Smith</strong>
        </span>
        <UfTabs label={`Profile (${mode})`}>
          <UfTab panel="about">About</UfTab>
          <UfTab panel="activity">Activity</UfTab>
          <UfTabPanel name="about">Product designer, based in London.</UfTabPanel>
          <UfTabPanel name="activity">No recent activity.</UfTabPanel>
        </UfTabs>
      </UfCard>
      <UfPagination label={`Pages (${mode})`} pages={9} page={3} size="sm" />
    </div>
  );
}

/** Contrast checks for the text and indicators that use the theme's colors. */
function checks(theme: Theme) {
  const accent = generatePalette(theme.accent, defaultAccent);
  const danger = generatePalette(theme.danger, defaultDanger);
  return [
    { what: 'Text on primary buttons', fg: '#ffffff', bg: accent['600'], min: 4.5 },
    { what: 'Links and accent text, light', fg: accent['600'], bg: surface.light, min: 4.5 },
    { what: 'Links and accent text, dark', fg: accent['300'], bg: surface.dark, min: 4.5 },
    { what: 'Focus ring, dark', fg: accent['400'], bg: surface.dark, min: 3 },
    { what: 'Text on danger buttons', fg: '#ffffff', bg: danger['600'], min: 4.5 },
    { what: 'Error messages, light', fg: danger['600'], bg: surface.light, min: 4.5 },
    { what: 'Error messages, dark', fg: danger['300'], bg: surface.dark, min: 4.5 },
  ].map((check) => ({ ...check, ratio: contrast(check.fg, check.bg) }));
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="theme-generator__color">
      <input
        type="color"
        className="theme-generator__swatch"
        aria-label={`${label} color picker`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <UfInput
        label={label}
        value={value}
        pattern="#?[0-9a-fA-F]{6}"
        hint="Becomes step 600 of its palette."
        onInput={(event) => {
          const text = (event.target as HTMLInputElement).value;
          if (parseHex(text)) onChange(`#${text.replace('#', '').toLowerCase()}`);
        }}
      />
    </div>
  );
}

export function ThemeGenerator() {
  const [theme, set] = useTheme();
  const vars = themeVariables(theme);
  const results = checks(theme);
  const failing = results.filter((r) => r.ratio < r.min).length;
  const css = Object.keys(vars).length
    ? `/* Unframed theme. Load it after @unframed/tokens/tokens.css. */\n:root {\n${Object.entries(vars)
        .map(([name, value]) => `  ${name}: ${value};`)
        .join('\n')}\n}`
    : '/* These are the default tokens: change a setting to get your theme. */';
  const palette = generatePalette(theme.accent, defaultAccent);

  return (
    <article className="theme-generator">
      <h1>Theme generator</h1>
      <p className="lead">
        Pick an accent color, corners and a font. You get a palette for light and dark mode, contrast checks, and the CSS
        to copy into your app.
      </p>

      <div className="theme-generator__layout">
        <form className="theme-generator__controls" onSubmit={(event) => event.preventDefault()}>
          <ColorField label="Accent" value={theme.accent} onChange={(accent) => set({ accent })} />
          <div className="theme-generator__palette" aria-label="Accent palette" role="img">
            {STEPS.map((step) => (
              <span key={step} className="theme-generator__step" style={{ background: palette[step] }} title={`${step}: ${palette[step]}`} />
            ))}
          </div>
          <ColorField label="Danger" value={theme.danger} onChange={(danger) => set({ danger })} />

          <label className="theme-generator__range">
            <span>
              Buttons and fields corners <output>{theme.control}px</output>
            </span>
            <input type="range" min={0} max={24} value={theme.control} onChange={(e) => set({ control: Number(e.target.value) })} />
          </label>
          <label className="theme-generator__range">
            <span>
              Cards and menus corners <output>{theme.surface}px</output>
            </span>
            <input type="range" min={0} max={24} value={theme.surface} onChange={(e) => set({ surface: Number(e.target.value) })} />
          </label>

          <UfSelect label="Font" value={theme.font} hint="Load web fonts in your app; these stacks use fonts already on most devices." onChange={(event) => set({ font: (event.target as HTMLSelectElement).value })}>
            {fonts.map(([name]) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </UfSelect>

          <UfButton variant="outline" type="button" onClick={() => set({ ...defaults })}>
            Reset to defaults
          </UfButton>
        </form>

        <div className="theme-generator__previews">
          <Preview mode="light" vars={vars} />
          <Preview mode="dark" vars={vars} />
        </div>
      </div>

      <h2>Contrast</h2>
      <p>
        {failing
          ? `${failing} check${failing > 1 ? 's' : ''} below the WCAG minimum: try a darker or more saturated color.`
          : 'Every check meets the WCAG minimum.'}
      </p>
      <div className="api-table">
        <table className="api-table__table">
          <thead>
            <tr>
              <th scope="col" className="api-table__header">Where</th>
              <th scope="col" className="api-table__header">Colors</th>
              <th scope="col" className="api-table__header">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.what} className="api-table__row">
                <td className="api-table__cell">{r.what}</td>
                <td className="api-table__cell">
                  <span className="theme-generator__sample" style={{ color: r.fg, background: r.bg }}>
                    Aa
                  </span>{' '}
                  <code>{r.fg}</code> on <code>{r.bg}</code>
                </td>
                <td className="api-table__cell">
                  <UfBadge variant={r.ratio >= r.min ? 'success' : 'danger'}>
                    {r.ratio.toFixed(2)}:1 {r.ratio >= r.min ? 'passes' : `needs ${r.min}:1`}
                  </UfBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Your theme</h2>
      <p>
        Add it after the tokens. It overrides the palette, so the light and dark themes both follow. To share this theme,
        copy the page's address: the settings are in it.
      </p>
      <CodeBlock standalone samples={[{ label: 'CSS', code: css }]} />
      <p>
        See <Link to="/docs/theming">Theming</Link> for every token and how to style single components.
      </p>
    </article>
  );
}
