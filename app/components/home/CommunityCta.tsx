import {Link} from 'react-router';

const COMMUNITY_IMAGE =
  'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1607748862156-7c548e7e98f4.jpg?v=1784714561';

/**
 * Home template §7 "Community CTA" module — closing band per the mockup's
 * "Join the Sonic Selection Community" banner. Purely presentational for
 * now (no real signup flow exists yet); links out to the parts of the
 * platform that already work. Image is real photography (many people,
 * community energy) hosted on the Shopify CDN, in the spirit of FPC's
 * community focus.
 */
export function CommunityCta() {
  return (
    <section className="home-section community-cta-band" aria-labelledby="community-cta-heading">
      <img src={COMMUNITY_IMAGE} alt="" aria-hidden="true" loading="lazy" className="community-cta-image" />
      <div className="community-cta-content">
        <h2 id="community-cta-heading" className="community-cta-title">
          Join the Sonic Selection Community
        </h2>
        <p className="community-cta-description">
          Free sounds, producer stories and early access drops.
        </p>
        <div className="platform-hero-cta-row community-cta-row">
          <Link className="platform-hero-cta" to="/producers" prefetch="intent">
            Meet the Producers
          </Link>
          <Link className="platform-hero-cta platform-hero-cta--outline" to="/stories" prefetch="intent">
            Read Stories
          </Link>
        </div>
      </div>
    </section>
  );
}
