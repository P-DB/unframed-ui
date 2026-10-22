import { svg, type SVGTemplateResult } from 'lit';

/** Built-in 24×24 stroke icons, drawn with currentColor. */
export const icons = {
  check: svg`<path d="M5 12.5l4.5 4.5L19 7.5" />`,
  minus: svg`<path d="M6 12h12" />`,
  x: svg`<path d="M6 6l12 12M18 6L6 18" />`,
  'chevron-down': svg`<path d="M6 9l6 6 6-6" />`,
  'chevron-up': svg`<path d="M6 15l6-6 6 6" />`,
  'chevron-left': svg`<path d="M15 6l-6 6 6 6" />`,
  'chevron-right': svg`<path d="M9 6l6 6-6 6" />`,
  plus: svg`<path d="M12 5v14M5 12h14" />`,
  search: svg`<circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />`,
  info: svg`<circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />`,
  'check-circle': svg`<circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" />`,
  'alert-triangle': svg`<path d="M12 4L2.5 20h19L12 4z" /><path d="M12 10v4M12 17h.01" />`,
  'alert-circle': svg`<circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16h.01" />`,
  sun: svg`<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />`,
  calendar: svg`<rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" />`,
  user: svg`<circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />`,
  moon: svg`<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />`,
  upload: svg`<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /><path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />`,
  file: svg`<path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" /><path d="M13.5 3v5.5H19" />`,
} satisfies Record<string, SVGTemplateResult>;

export type BuiltInIconName = keyof typeof icons;

/** Wraps an icon's paths in an `<svg>` element. */
export function iconSvg(paths: SVGTemplateResult, part = 'icon') {
  return svg`<svg part=${part} class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}
