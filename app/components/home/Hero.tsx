import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {HeroProductFragment} from 'storefrontapi.generated';

/**
 * Homepage hero, per docs/brand-assets/references/reference-shopify-layout.png:
 * two-column layout with headline/CTAs on the left and a product visual +
 * "listen & buy" widget on the right. The right side only renders once a
 * matching hero product exists in the catalog (see HOME_HERO_PRODUCT_QUERY
 * in routes/_index.tsx). Renders the product's real featuredImage when one
 * exists; falls back to the brand mark instead of a broken image otherwise.
 */
export function Hero({heroProduct}: {heroProduct: HeroProductFragment | null}) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-kicker">Next Level Sounds</p>
        <h1 className="hero-headline">
          Sounds that inspire.
          <br />
          <span className="hero-headline-accent">Tools that elevate.</span>
        </h1>
        <p className="hero-subline">
          Premium sounds, loops, presets and tools for modern producers.
        </p>
        <div className="hero-cta-row">
          <Link className="ss-button-primary" to="/collections" prefetch="intent">
            Browse Sounds →
          </Link>
          <a className="hero-cta-outline" href="#new-releases">
            New Releases
          </a>
        </div>
      </div>

      {heroProduct && (
        <div className="hero-visual">
          {heroProduct.featuredImage ? (
            <Image
              className="hero-visual-image"
              alt={heroProduct.featuredImage.altText || heroProduct.title}
              data={heroProduct.featuredImage}
              sizes="(min-width: 45em) 420px, 80vw"
            />
          ) : (
            <div className="hero-visual-box" aria-hidden="true">
              <span className="hero-visual-mark">S</span>
            </div>
          )}
          <div className="hero-track-info">
            <p className="hero-track-eyebrow">New Release</p>
            <h3 className="hero-track-title">{heroProduct.title}</h3>
            <Link
              className="hero-listen-buy"
              to={`/products/${heroProduct.handle}`}
              prefetch="intent"
            >
              Listen &amp; Buy — <Money data={heroProduct.priceRange.minVariantPrice} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
