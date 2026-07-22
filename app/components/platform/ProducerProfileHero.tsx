import type {Producer} from '~/lib/platform/types';
import {getAudioTrackById} from '~/lib/platform/mockData';
import {PlatformCoverImage} from './PlatformCoverImage';
import {PlatformPlayButton} from './PlatformPlayButton';
import {AffiliationBadgeList} from './AffiliationBadge';

export function ProducerProfileHero({producer}: {producer: Producer}) {
  const previewTrack = producer.audioTrackIds
    .map((id) => getAudioTrackById(id))
    .find(Boolean);

  return (
    <section className="producer-profile-hero">
      <PlatformCoverImage
        src={producer.heroImage ?? producer.portrait}
        alt={producer.name}
        className="producer-profile-hero-image"
      />
      <div className="producer-profile-hero-content">
        <AffiliationBadgeList affiliations={producer.affiliations} />
        <h1 className="producer-profile-hero-name">{producer.name}</h1>
        {producer.location && (
          <span className="producer-profile-hero-location">{producer.location}</span>
        )}
        {producer.genres.length > 0 && (
          <div className="producer-card-genres">
            {producer.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}
        <p className="producer-profile-hero-bio">{producer.bio}</p>
        <PlatformPlayButton track={previewTrack} contextTitle={producer.name} size="md" />
      </div>
    </section>
  );
}
