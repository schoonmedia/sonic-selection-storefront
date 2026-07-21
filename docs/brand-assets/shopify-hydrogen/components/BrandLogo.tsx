type BrandLogoProps = {
  variant?: 'horizontal' | 'mark';
  color?: 'white' | 'lime' | 'gold';
  className?: string;
};

const colorMap = {
  white: '#F2F2F4',
  lime: '#C6FF00',
  gold: '#D4AF7A',
};

export function BrandLogo({variant = 'horizontal', color = 'white', className}: BrandLogoProps) {
  const stroke = colorMap[color];

  const Mark = (
    <svg viewBox="0 0 128 128" aria-label="Sonic Selection" role="img" className={className}>
      <g fill="none" stroke={stroke} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M98 25H44C28 25 20 34 20 45.5S29 66 44 66h40c9.5 0 15 5 15 12.5S93.5 91 84 91H30" />
        <path d="M30 37h54c16 0 24 9 24 20.5S99 78 84 78H44c-9.5 0-15 5-15 12.5S34.5 103 44 103h54" />
        <path d="M40 51h48" opacity=".55" />
        <path d="M40 78h48" opacity=".55" />
      </g>
    </svg>
  );

  if (variant === 'mark') return Mark;

  return (
    <div className={`ss-logo ${className ?? ''}`} aria-label="Sonic Selection">
      <div className="ss-logo-mark">{Mark}</div>
      <div className="ss-logo-type">
        <span>SONIC</span>
        <span>SELECTION</span>
      </div>
    </div>
  );
}
