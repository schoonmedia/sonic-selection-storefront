import type {SonicProduct} from '~/lib/platform/types';
import {getAudioTrackById} from '~/lib/platform/mockData';
import {PlatformCoverImage} from './PlatformCoverImage';
import {PlatformPlayButton} from './PlatformPlayButton';

/**
 * Cinematic "movie-poster" hero for the /artist-packs index — spotlights
 * one featured pack (defaults to the first in the list) rather than using
 * the generic GlobalProjectHero, per claude-master-briefing.md §7 ("Artist
 * Packs are cinematic, movie-poster style drops where the producer/artist
 * is the main visual subject").
 */
export function ArtistPackHero({featuredProduct}: {featuredProduct?: SonicProduct}) {
  const previewTrack = featuredProduct?.audioTrackIds
    .map((id) => getAudioTrackById(id))
    .find(Boolean);

  return (
    <section className="platform-hero artist-pack-hero">
      <PlatformCoverImage
        src={featuredProduct?.coverImage}
        alt={featuredProduct?.title ?? 'Artist Packs'}
        className="platform-hero-image artist-pack-hero-image"
      />
      <div className="platform-hero-content">
        <span className="platform-eyebrow">Artist Packs</span>
        <h1 className="platform-hero-title">Cinematic. Artist-driven. Yours to sample.</h1>
        <p className="platform-hero-description">
          Artist-driven sound packs with a story, a sound and a signature — from selected
          producers and sound designers across the Sonic Selection platform.
        </p>
        {featuredProduct && (
          <div className="artist-pack-hero-featured">
            <span className="artist-pack-hero-featured-title">{featuredProduct.title}</span>
            <PlatformPlayButton
              track={previewTrack}
              contextTitle={featuredProduct.title}
              size="md"
            />
          </div>
        )}
      </div>
    </section>
  );
}
