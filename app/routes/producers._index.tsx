import {useLoaderData} from 'react-router';
import type {Route} from './+types/producers._index';
import {producers} from '~/lib/platform/mockData';
import {ProducerGrid} from '~/components/platform/ProducerGrid';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Producers'}];
};

/**
 * Global producer index — shows EVERY featured producer regardless of
 * project affiliation (architecture-correction.md: "/producers is global").
 * Do not filter this list by FPC or any other project.
 */
export async function loader(_args: Route.LoaderArgs) {
  return {producers};
}

export default function ProducersIndex() {
  const {producers: allProducers} = useLoaderData<typeof loader>();

  return (
    <div className="platform-page">
      <section className="platform-hero platform-hero--compact">
        <div className="platform-hero-content">
          <h1 className="platform-hero-title">Meet the producers shaping the sound.</h1>
          <p className="platform-hero-description">
            Discover artists, beatmakers and sound designers behind Sonic Selection.
          </p>
        </div>
      </section>
      <ProducerGrid producers={allProducers} />
    </div>
  );
}
