export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right';

const VIEWPORT_PADDING = 8;
const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;

/**
 * Positions a `position: fixed` element (usually in the top layer) next to an
 * anchor. Flips to the opposite side when it doesn't fit, then clamps to the
 * viewport. Returns the side it ended up on.
 */
export function positionFloating(
  anchor: Element,
  floating: HTMLElement,
  placement: Placement,
  offset = 8,
): Placement {
  const a = anchor.getBoundingClientRect();
  const f = floating.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  let [side, align] = placement.split('-') as [keyof typeof opposite, 'start' | 'end' | undefined];

  const fits = (s: keyof typeof opposite) => {
    if (s === 'top') return a.top - offset - f.height >= VIEWPORT_PADDING;
    if (s === 'bottom') return a.bottom + offset + f.height <= vh - VIEWPORT_PADDING;
    if (s === 'left') return a.left - offset - f.width >= VIEWPORT_PADDING;
    return a.right + offset + f.width <= vw - VIEWPORT_PADDING;
  };
  if (!fits(side) && fits(opposite[side])) side = opposite[side];

  let x: number;
  let y: number;
  if (side === 'top' || side === 'bottom') {
    y = side === 'top' ? a.top - offset - f.height : a.bottom + offset;
    x = align === 'start' ? a.left : align === 'end' ? a.right - f.width : a.left + a.width / 2 - f.width / 2;
  } else {
    x = side === 'left' ? a.left - offset - f.width : a.right + offset;
    y = a.top + a.height / 2 - f.height / 2;
  }

  x = Math.min(Math.max(x, VIEWPORT_PADDING), vw - f.width - VIEWPORT_PADDING);
  y = Math.min(Math.max(y, VIEWPORT_PADDING), vh - f.height - VIEWPORT_PADDING);

  floating.style.left = `${Math.round(x)}px`;
  floating.style.top = `${Math.round(y)}px`;
  return (align ? `${side}-${align}` : side) as Placement;
}

/** Re-runs `update` on scroll, resize and size changes. Returns a cleanup function. */
export function autoUpdate(anchor: Element, floating: HTMLElement, update: () => void): () => void {
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(anchor);
  observer.observe(floating);
  window.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', schedule, { capture: true });
    window.removeEventListener('resize', schedule);
  };
}

