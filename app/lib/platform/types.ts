/**
 * Content model for the Sonic Selection platform layer (Producers, Projects,
 * Stories, Artist Packs) — see docs/platform/README.md for the architecture
 * this implements.
 *
 * Phase 1 (current): all data below is mocked in ./mockData.ts. Nothing here
 * talks to the Shopify Storefront API yet. Phase 4 of the roadmap swaps
 * mockData.ts for Shopify metaobject queries without needing to change these
 * types or any component that consumes them.
 *
 * Binding rule (do not violate when extending this data): Sonic Selection is
 * the platform. Female* Producer Collective ("FPC") is one flagship Project,
 * not the parent of the producer/story/artist-pack systems. A producer's FPC
 * membership is decided ONLY by an explicit `ProjectAffiliation` entry with
 * `projectId: 'female-producer-collective'` — never inferred from name,
 * image, genre or bio text.
 */

export type ProjectType =
  | 'flagship_project'
  | 'collective'
  | 'session'
  | 'community_drop'
  | 'artist_collaboration'
  | 'workshop'
  | 'meeting'
  | 'education'
  | 'resources';

export type StoryCategory =
  | 'producer_stories'
  | 'industry_culture'
  | 'behind_the_pack'
  | 'sound_design'
  | 'projects'
  | 'free_downloads'
  | 'tutorials';

export type ProductType =
  | 'sound_pack'
  | 'artist_pack'
  | 'drum_kit'
  | 'melody_loop_pack'
  | 'one_shot_pack'
  | 'midi_pack'
  | 'preset_pack'
  | 'tool'
  | 'bundle'
  | 'free_pack';

export type AffiliationRole =
  | 'member'
  | 'founder'
  | 'featured_artist'
  | 'workshop_speaker'
  | 'collaborator'
  | 'mentor'
  | 'guest'
  | 'partner';

export type ProjectAffiliation = {
  projectId: string;
  projectHandle: string;
  label: string;
  role: AffiliationRole;
  isPrimary?: boolean;
};

/**
 * A playable preview owned by the platform mock layer. Deliberately NOT the
 * same shape as `~/types/audio`'s `AudioTrack` (that one is the real,
 * Storefront-API-backed player type) — see
 * `app/components/platform/PlatformPlayButton.tsx` for the adapter that
 * converts one into the other without creating a second audio instance.
 */
export type PlatformAudioTrack = {
  id: string;
  title: string;
  previewUrl: string;
  duration?: number;
  bpm?: number;
  key?: string;
  genre?: string;
  mood?: string;
  productId?: string;
  producerId?: string;
  projectId?: string;
  storyId?: string;
  coverImage?: string;
};

export type Producer = {
  id: string;
  name: string;
  handle: string;
  portrait: string;
  heroImage?: string;
  bio: string;
  shortBio?: string;
  genres: string[];
  location?: string;
  affiliations: ProjectAffiliation[];
  featuredProductIds: string[];
  storyIds: string[];
  audioTrackIds: string[];
  socialLinks?: {
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
    website?: string;
  };
};

export type Project = {
  id: string;
  title: string;
  handle: string;
  type: ProjectType;
  shortDescription: string;
  description: string;
  heroImage: string;
  logoImage?: string;
  relatedProducerIds: string[];
  relatedStoryIds: string[];
  relatedProductIds: string[];
  audioTrackIds: string[];
  cta?: {
    label: string;
    href: string;
  };
};

export type Story = {
  id: string;
  title: string;
  slug: string;
  category: StoryCategory;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  authorName?: string;
  relatedProducerIds: string[];
  relatedProjectIds: string[];
  relatedProductIds: string[];
  audioTrackIds: string[];
  content?: string;
};

export type SonicProduct = {
  id: string;
  shopifyHandle?: string;
  title: string;
  type: ProductType;
  price?: string;
  compareAtPrice?: string;
  coverImage: string;
  producerIds: string[];
  projectIds: string[];
  storyIds: string[];
  audioTrackIds: string[];
  tags: string[];
  isFree?: boolean;
};
