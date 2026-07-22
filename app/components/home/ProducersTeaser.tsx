import {Link} from 'react-router';
import {producers} from '~/lib/platform/mockData';
import {ProducerGrid} from '~/components/platform/ProducerGrid';

/** Home template §7 "Producers / Featured Producers" module — global list,
 * not filtered by any project affiliation. */
export function ProducersTeaser() {
  if (producers.length === 0) return null;

  return (
    <section className="home-section" aria-labelledby="producers-heading">
      <div className="section-header">
        <h2 id="producers-heading">Featured Producers</h2>
        <Link className="section-view-all" to="/producers" prefetch="intent">
          View all →
        </Link>
      </div>
      <ProducerGrid producers={producers.slice(0, 4)} />
    </section>
  );
}
