import type {SonicProduct} from '~/lib/platform/types';
import {ArtistPackCard} from './ArtistPackCard';

export function ArtistPackGrid({products}: {products: SonicProduct[]}) {
  if (products.length === 0) {
    return <p className="platform-empty-state">No artist packs to show yet.</p>;
  }

  return (
    <div className="artist-pack-grid">
      {products.map((product) => (
        <ArtistPackCard key={product.id} product={product} />
      ))}
    </div>
  );
}
