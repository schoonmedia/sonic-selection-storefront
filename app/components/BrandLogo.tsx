/**
 * Sonic Selection wordmark + mark, from the official brand asset kit.
 * Uses `currentColor` for the icon stroke so it inherits the surrounding
 * text color (e.g. the header's active/hover link colors) instead of a
 * hardcoded fill.
 */
export function BrandLogo({className}: {className?: string}) {
  return (
    <span className={`ss-logo ${className ?? ''}`}>
      <svg
        className="ss-logo-mark"
        viewBox="0 0 128 128"
        role="img"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M98 25H44C28 25 20 34 20 45.5S29 66 44 66h40c9.5 0 15 5 15 12.5S93.5 91 84 91H30" />
          <path d="M30 37h54c16 0 24 9 24 20.5S99 78 84 78H44c-9.5 0-15 5-15 12.5S34.5 103 44 103h54" />
          <path d="M40 51h48" opacity=".55" />
          <path d="M40 78h48" opacity=".55" />
        </g>
      </svg>
      <span className="ss-logo-type">Sonic Selection</span>
    </span>
  );
}
