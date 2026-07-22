import {Link} from 'react-router';
import type {HomeCategoryFragment} from 'storefrontapi.generated';
import iconSound from '~/assets/icons/icon-sound.svg';
import iconMelody from '~/assets/icons/icon-melody.svg';
import iconOneShots from '~/assets/icons/icon-one-shots.svg';
import iconPresets from '~/assets/icons/icon-presets.svg';
import iconMidi from '~/assets/icons/icon-midi.svg';
import iconMic from '~/assets/icons/icon-mic.svg';
import iconFx from '~/assets/icons/icon-fx.svg';
import iconTools from '~/assets/icons/icon-tools.svg';
import iconBundle from '~/assets/icons/icon-bundle.svg';
import iconDownload from '~/assets/icons/icon-download.svg';

// Keyed by the Shopify-generated collection handle (title, lowercased +
// hyphenated). If a new collection is added later with a handle that isn't
// in this map, it falls back to the generic sound icon rather than breaking.
// Each icon is purpose-drawn for its category (piano-roll grid for MIDI,
// microphone for vocals, lightning bolt for FX, stacked boxes for bundles,
// beamed notes for melody/loops) rather than reused from an unrelated icon.
const ICON_BY_HANDLE: Record<string, string> = {
  'drum-kits': iconSound,
  'melody-loops': iconMelody,
  'one-shots': iconOneShots,
  presets: iconPresets,
  'midi-packs': iconMidi,
  'vocal-samples': iconMic,
  'sound-fx': iconFx,
  tools: iconTools,
  bundles: iconBundle,
  free: iconDownload,
};

/** "Browse by Category" tile grid, wired to the real Shopify collections. */
export function CategoryGrid({categories}: {categories: HomeCategoryFragment[]}) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="home-section" aria-labelledby="browse-by-category">
      <div className="section-header">
        <h2 id="browse-by-category">Browse by Category</h2>
        <Link className="section-view-all" to="/collections" prefetch="intent">
          View all categories →
        </Link>
      </div>
      <div className="category-grid">
        {categories.map((category) => {
          const count = category.products.nodes.length;
          return (
            <Link
              className="category-tile"
              key={category.id}
              to={`/collections/${category.handle}`}
              prefetch="intent"
            >
              <img
                className="category-tile-icon"
                src={ICON_BY_HANDLE[category.handle] || iconSound}
                alt=""
                width={40}
                height={40}
              />
              <p className="category-tile-title">{category.title}</p>
              <p className="category-tile-count">
                {count} Pack{count === 1 ? '' : 's'}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
