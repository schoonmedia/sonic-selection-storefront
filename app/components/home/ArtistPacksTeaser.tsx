import {Link} from 'react-router';
import {products} from '~/lib/platform/mockData';
import {ArtistPackGrid} from '~/components/platform/ArtistPackGrid';

/** Home template §7 "Artist Packs" module — platform-wide, not FPC-limited.
 * Mock data for now; see app/lib/platform/mockData.ts. */
export function ArtistPacksTeaser() {
  const artistPacks = products.filter((product) => product.type === 'artist_pack').slice(0, 4);
  if (artistPacks.length === 0) return null;

  return (
    <section className="home-section" aria-labelledby="artist-packs-heading">
      <div className="section-header">
        <h2 id="artist-packs-heading">Artist Packs</h2>
        <Link className="section-view-all" to="/artist-packs" prefetch="intent">
          View all →
        </Link>
      </div>
      <ArtistPackGrid products={artistPacks} />
    </section>
  );
}
