/**
 * The mark's shapes, in a 32×32 box: a square with a U cut out of its top, and
 * the cut-out piece rising out of it, with an even gap on its sides and bottom.
 */
export const mark = {
  box: 'M3 7h5v11a8 8 0 0 0 16 0V7h5v24H3z',
  piece: 'M13 2h6v16a3 3 0 0 1-6 0z',
};

/** The Unframed mark, in the text color: a U-shaped piece rising out of the square it was cut from. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={mark.box} />
      <path d={mark.piece} />
    </svg>
  );
}
