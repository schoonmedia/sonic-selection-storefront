import {Link} from 'react-router';

/**
 * Home template §7 "Free Starter Kit" module. Links to the real Shopify
 * "Free" collection (already live — see docs catalog work) rather than mock
 * data, since free packs are genuine store content. Copy from
 * copy/copy-library.md.
 */
export function FreeStarterKitTeaser() {
  return (
    <section className="home-section free-starter-kit-band" aria-labelledby="free-starter-kit-heading">
      <div className="free-starter-kit-content">
        <span className="platform-eyebrow">Free Starter Kit</span>
        <h2 id="free-starter-kit-heading" className="free-starter-kit-title">
          Start creating with free sounds from Sonic Selection.
        </h2>
        <Link className="platform-hero-cta" to="/collections/free" prefetch="intent">
          Explore Free Sounds
        </Link>
      </div>
    </section>
  );
}
