import {useState} from 'react';

/**
 * Cover image for platform content (producers, projects, stories, artist
 * packs). Phase 1 mock data points at `/assets/...` paths that don't have
 * real files behind them yet (real photography/artwork is a separate task —
 * see docs/platform/README.md), so this always degrades to a branded
 * fallback mark instead of showing a broken image icon. Once real files
 * exist at those paths, this starts rendering them automatically — no
 * component changes needed.
 */
export function PlatformCoverImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`platform-cover-fallback ${className ?? ''}`}>
        <span className="platform-cover-fallback-mark" aria-hidden="true">
          S
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
