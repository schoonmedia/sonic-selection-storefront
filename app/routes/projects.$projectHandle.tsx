import {useLoaderData} from 'react-router';
import type {Route} from './+types/projects.$projectHandle';
import {
  getProjectByHandle,
  getProducersByProject,
  getProducersByIds,
  getStoriesByProject,
  getProductsByProject,
} from '~/lib/platform/mockData';
import {FPCProjectHero} from '~/components/platform/FPCProjectHero';
import {GlobalProjectHero} from '~/components/platform/GlobalProjectHero';
import {ProducerGrid} from '~/components/platform/ProducerGrid';
import {ArtistPackGrid} from '~/components/platform/ArtistPackGrid';
import {RelatedContentRail, type RelatedContentItem} from '~/components/platform/RelatedContentRail';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Sonic Selection | ${data?.project.title ?? 'Project'}`}];
};

export async function loader({params}: Route.LoaderArgs) {
  const {projectHandle} = params;
  const project = projectHandle ? getProjectByHandle(projectHandle) : undefined;

  if (!project) {
    throw new Response(`Project ${projectHandle} not found`, {status: 404});
  }

  const isFpc = project.id === 'female-producer-collective';

  // Binding rule (rules/fpc-affiliation-rules.md): FPC's producer list is
  // ALWAYS derived from explicit `producer.affiliations`, never from a
  // hand-curated `relatedProducerIds` list — this is what guarantees a
  // non-FPC producer can never show up here. Other project pages use the
  // looser `relatedProducerIds` relation (a project can mention/feature a
  // producer without a formal affiliation entry).
  const relatedProducers = isFpc
    ? getProducersByProject(project.id)
    : getProducersByIds(project.relatedProducerIds);

  const relatedStories = getStoriesByProject(project.id);
  const relatedProducts = getProductsByProject(project.id);

  return {project, isFpc, relatedProducers, relatedStories, relatedProducts};
}

export default function ProjectDetail() {
  const {project, isFpc, relatedProducers, relatedStories, relatedProducts} =
    useLoaderData<typeof loader>();

  const storyItems: RelatedContentItem[] = relatedStories.map((story) => ({
    id: story.id,
    title: story.title,
    subtitle: story.excerpt,
    image: story.coverImage,
    href: `/stories/${story.slug}`,
  }));

  return (
    <div className="platform-page">
      {isFpc ? (
        <FPCProjectHero project={project} />
      ) : (
        <GlobalProjectHero
          title={project.title}
          description={project.description}
          image={project.heroImage}
          cta={project.cta}
        />
      )}

      {relatedProducers.length > 0 && (
        <section className="platform-section">
          <h2 className="platform-section-title">
            {isFpc ? 'FPC Producers' : 'Related Producers'}
          </h2>
          <ProducerGrid producers={relatedProducers} />
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="platform-section">
          <h2 className="platform-section-title">Sound Packs</h2>
          <ArtistPackGrid products={relatedProducts} />
        </section>
      )}

      <RelatedContentRail title="Stories" items={storyItems} />
    </div>
  );
}
