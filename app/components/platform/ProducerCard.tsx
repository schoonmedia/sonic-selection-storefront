import {Link} from 'react-router';
import type {Producer} from '~/lib/platform/types';
import {getAudioTrackById, getProductById} from '~/lib/platform/mockData';
import {PlatformCoverImage} from './PlatformCoverImage';
import {PlatformPlayButton} from './PlatformPlayButton';
import {AffiliationBadgeList} from './AffiliationBadge';

export function ProducerCard({producer}: {producer: Producer}) {
  const previewTrack = producer.audioTrackIds
    .map((id) => getAudioTrackById(id))
    .find(Boolean);
  const featuredProduct = producer.featuredProductIds
    .map((id) => getProductById(id))
    .find(Boolean);

  return (
    <div className="producer-card">
      <Link to={`/producers/${producer.handle}`} className="producer-card-media" prefetch="intent">
        <PlatformCoverImage
          src={producer.portrait}
          alt={producer.name}
          className="producer-card-portrait"
        />
      </Link>
      <div className="producer-card-body">
        <Link to={`/producers/${producer.handle}`} className="producer-card-name" prefetch="intent">
          {producer.name}
        </Link>
        {producer.location && <span className="producer-card-location">{producer.location}</span>}
        {producer.genres.length > 0 && (
          <div className="producer-card-genres">
            {producer.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}
        <AffiliationBadgeList affiliations={producer.affiliations} />
        {featuredProduct && (
          <span className="producer-card-featured-pack">{featuredProduct.title}</span>
        )}
      </div>
      <PlatformPlayButton track={previewTrack} contextTitle={producer.name} size="sm" />
    </div>
  );
}
