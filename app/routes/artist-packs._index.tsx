import {useLoaderData} from 'react-router';
import type {Route} from './+types/artist-packs._index';
import {products, getProducersByIds, getStoriesByProject} from '~/lib/platform/mockData';
import {ArtistPackGrid} from '~/components/platform/ArtistPackGrid';
import {ProducerGrid} from '~/components/platform/ProducerGrid';
import {RelatedContentRail, type RelatedContentItem} from '~/components/platform/RelatedContentRail';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Artist Packs'}];
};

/**
 * Global, platform-wide commercial + cultural layer (content-model.md
 * "Artist Packs are not restricted to FPC"). Every artist-pack product in
 * the mock catalog shows up here regardless of producer affiliation.
 */
export async function loader(_args: Route.LoaderArgs) {
  const artistPacks = products.filter((product) => product.type === 'artist_pack');
  const producerIds = [...new Set(artistPacks.flatMap((product) => product.producerIds))];
  const relatedProducers = getProducersByIds(producerIds);
  const relatedStories = getStoriesByProject('artist-collaborations');

  return {artistPacks, relatedProducers, relatedStories};
}

export default function ArtistPacksIndex() {
  const {artistPacks, relatedProducers, relatedStories} = useLoaderData<typeof loader>();

  const storyItems: RelatedContentItem[] = relatedStories.map((story) => ({
    id: story.id,
    title: story.title,
    subtitle: story.excerpt,
    image: story.coverImage,
    href: `/stories/${story.slug}`,
  }));

  return (
    <div className="platform-page">
      <section className="platform-hero platform-hero--compact">
        <div className="platform-hero-content">
          <h1 className="platform-hero-title">Artist Packs</h1>
          <p className="platform-hero-description">
            Cinematic artist packs from selected producers and sound designers.
          </p>
        </div>
      </section>

      <ArtistPackGrid products={artistPacks} />

      {relatedProducers.length > 0 && (
        <section className="platform-section">
          <h2 className="platform-section-title">Producers</h2>
          <ProducerGrid producers={relatedProducers} />
        </section>
      )}

      <RelatedContentRail title="Stories Behind the Packs" items={storyItems} />
    </div>
  );
}
