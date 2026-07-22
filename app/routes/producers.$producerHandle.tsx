import {useLoaderData} from 'react-router';
import type {Route} from './+types/producers.$producerHandle';
import {
  getProducerByHandle,
  getProductsByProducer,
  getStoriesByProducer,
} from '~/lib/platform/mockData';
import {ProducerProfileHero} from '~/components/platform/ProducerProfileHero';
import {ArtistPackCard} from '~/components/platform/ArtistPackCard';
import {RelatedContentRail, type RelatedContentItem} from '~/components/platform/RelatedContentRail';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Sonic Selection | ${data?.producer.name ?? 'Producer'}`}];
};

export async function loader({params}: Route.LoaderArgs) {
  const {producerHandle} = params;
  const producer = producerHandle ? getProducerByHandle(producerHandle) : undefined;

  if (!producer) {
    throw new Response(`Producer ${producerHandle} not found`, {status: 404});
  }

  const products = getProductsByProducer(producer.id);
  const stories = getStoriesByProducer(producer.id);

  return {producer, products, stories};
}

export default function ProducerProfile() {
  const {producer, products, stories} = useLoaderData<typeof loader>();

  const storyItems: RelatedContentItem[] = stories.map((story) => ({
    id: story.id,
    title: story.title,
    subtitle: story.excerpt,
    image: story.coverImage,
    href: `/stories/${story.slug}`,
  }));

  return (
    <div className="platform-page">
      <ProducerProfileHero producer={producer} />

      {products.length > 0 && (
        <section className="platform-section">
          <h2 className="platform-section-title">Sound Packs</h2>
          <div className="artist-pack-grid">
            {products.map((product) => (
              <ArtistPackCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <RelatedContentRail title="Stories" items={storyItems} />
    </div>
  );
}
