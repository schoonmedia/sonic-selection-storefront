import {Link} from 'react-router';

const FREE_KIT_IMAGE =
  'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1619078515712-c8e13a3f2d37.jpg?v=1784711291';

/**
 * Home template §7 "Free Starter Kit" module. Links to the real Shopify
 * "Free" collection (already live — see docs catalog work) rather than mock
 * data, since free packs are genuine store content. Copy from
 * copy/copy-library.md. Image reuses the "free-starter-kit-launch" story's
 * cover (same real photography, already hosted on the Shopify CDN).
 */
export function FreeStarterKitTeaser() {
  return (
    <section className="home-section free-starter-kit-band" aria-labelledby="free-starter-kit-heading">
      <img
        src={FREE_KIT_IMAGE}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="free-starter-kit-image"
      />
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
