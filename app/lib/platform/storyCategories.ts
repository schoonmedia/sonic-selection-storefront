import type {StoryCategory} from './types';

/**
 * Phase 1 story categories per content-model.md. "Tutorials" is intentionally
 * excluded from `STORY_CATEGORIES` (the list rendered as browsable category
 * cards) — it's a later-phase category per the briefing, not a Phase 1
 * requirement, even though the `StoryCategory` type already reserves the
 * value so a future story can use it without a type change.
 *
 * `image` reuses each category's most representative story cover (all
 * already real photography hosted on the Shopify CDN — see mockData.ts)
 * rather than sourcing separate category art, so every card has a real,
 * on-theme image instead of a blank tile.
 */
export const STORY_CATEGORIES: {
  value: StoryCategory;
  label: string;
  description: string;
  image: string;
}[] = [
  {
    value: 'producer_stories',
    label: 'Producer Stories',
    description: 'Profiles and features on the producers shaping Sonic Selection.',
    image:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1613031729579-ace1feefda4c.jpg?v=1784710979',
  },
  {
    value: 'industry_culture',
    label: 'Industry & Culture',
    description: 'Signals from the culture behind the sound.',
    image:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1601814837661-ce2832acd413.jpg?v=1784710933',
  },
  {
    value: 'behind_the_pack',
    label: 'Behind the Pack',
    description: 'The story and process behind a specific release.',
    image:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1598847873329-ed1608fb858b.jpg?v=1784710954',
  },
  {
    value: 'sound_design',
    label: 'Sound Design',
    description: 'Techniques, layering and process from the producers themselves.',
    image:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1642177437932-75d846ad48f3.jpg?v=1784711009',
  },
  {
    value: 'projects',
    label: 'Projects',
    description: 'Updates and features from Sonic Selection initiatives.',
    image:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1611532736579-6b16e2b50449.jpg?v=1784710883',
  },
  {
    value: 'free_downloads',
    label: 'Free Downloads',
    description: 'Announcements and context for free sounds and starter kits.',
    image:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1619078515712-c8e13a3f2d37.jpg?v=1784711291',
  },
];

export function getStoryCategoryLabel(category: StoryCategory): string {
  if (category === 'tutorials') return 'Tutorials';
  return STORY_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
