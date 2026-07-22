import type {StoryCategory} from './types';

/**
 * Phase 1 story categories per content-model.md. "Tutorials" is intentionally
 * excluded from `STORY_CATEGORIES` (the list rendered as browsable category
 * cards) — it's a later-phase category per the briefing, not a Phase 1
 * requirement, even though the `StoryCategory` type already reserves the
 * value so a future story can use it without a type change.
 */
export const STORY_CATEGORIES: {value: StoryCategory; label: string; description: string}[] = [
  {
    value: 'producer_stories',
    label: 'Producer Stories',
    description: 'Profiles and features on the producers shaping Sonic Selection.',
  },
  {
    value: 'industry_culture',
    label: 'Industry & Culture',
    description: 'Signals from the culture behind the sound.',
  },
  {
    value: 'behind_the_pack',
    label: 'Behind the Pack',
    description: 'The story and process behind a specific release.',
  },
  {
    value: 'sound_design',
    label: 'Sound Design',
    description: 'Techniques, layering and process from the producers themselves.',
  },
  {
    value: 'projects',
    label: 'Projects',
    description: 'Updates and features from Sonic Selection initiatives.',
  },
  {
    value: 'free_downloads',
    label: 'Free Downloads',
    description: 'Announcements and context for free sounds and starter kits.',
  },
];

export function getStoryCategoryLabel(category: StoryCategory): string {
  if (category === 'tutorials') return 'Tutorials';
  return STORY_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
