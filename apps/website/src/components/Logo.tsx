/** The Unframed mark: a white square with the accent "U". */
export function LogoMark({ size = 18, className = 'logo-mark' }: { size?: number; className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
        <path d="M9 8v10a7 7 0 0 0 14 0V8" fill="none" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    </span>
  );
}
