import {useLoaderData} from 'react-router';
import type {Route} from './+types/stories.$storySlug';
import {
  getStoryBySlug,
  getProducersByIds,
  getProjectsByIds,
  getProductsByIds,
} from '~/lib/platform/mockData';
import {StoryHero} from '~/components/platform/StoryHero';
import {ProducerGrid} from '~/components/platform/ProducerGrid';
import {ArtistPackCard} from '~/components/platform/ArtistPackCard';
import {RelatedContentRail, type RelatedContentItem} from '~/components/platform/RelatedContentRail';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Sonic Selection | ${data?.story.title ?? 'Story'}`}];
};

export async function loader({params}: Route.LoaderArgs) {
  const {storySlug} = params;
  const story = storySlug ? getStoryBySlug(storySlug) : undefined;

  if (!story) {
    throw new Response(`Story ${storySlug} not found`, {status: 404});
  }

  const relatedProducers = getProducersByIds(story.relatedProducerIds);
  const relatedProjects = getProjectsByIds(story.relatedProjectIds);
  const relatedProducts = getProductsByIds(story.relatedProductIds);

  return {story, relatedProducers, relatedProjects, relatedProducts};
}

export default function StoryDetail() {
  const {story, relatedProducers, relatedProjects, relatedProducts} =
    useLoaderData<typeof loader>();

  const projectItems: RelatedContentItem[] = relatedProjects.map((project) => ({
    id: project.id,
    title: project.title,
    subtitle: project.shortDescription,
    image: project.heroImage,
    href: `/projects/${project.handle}`,
  }));

  return (
    <div className="platform-page">
      <StoryHero story={story} />

      <article className="platform-section story-content">
        {story.content ? (
          <p>{story.content}</p>
        ) : (
          <p className="story-content-placeholder">{story.excerpt}</p>
        )}
      </article>

      {relatedProducers.length > 0 && (
        <section className="platform-section">
          <h2 className="platform-section-title">Related Producers</h2>
          <ProducerGrid producers={relatedProducers} />
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="platform-section">
          <h2 className="platform-section-title">Related Sound Packs</h2>
          <div className="artist-pack-grid">
            {relatedProducts.map((product) => (
              <ArtistPackCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <RelatedContentRail title="Related Projects" items={projectItems} />
    </div>
  );
}
