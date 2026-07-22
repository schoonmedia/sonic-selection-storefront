import type {Producer} from '~/lib/platform/types';
import {ProducerCard} from './ProducerCard';

export function ProducerGrid({producers}: {producers: Producer[]}) {
  if (producers.length === 0) {
    return <p className="platform-empty-state">No producers to show yet.</p>;
  }

  return (
    <div className="producer-grid">
      {producers.map((producer) => (
        <ProducerCard key={producer.id} producer={producer} />
      ))}
    </div>
  );
}
