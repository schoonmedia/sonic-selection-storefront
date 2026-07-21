/**
 * Curated genre list for the onboarding preferences quiz
 * (routes/account.preferences.tsx) and anywhere else we need a fixed set
 * of genre options. Deliberately matches the kind of values sellers would
 * type into an Audio Track's "genre" field (see
 * docs/shopify-audio-track-metaobject.md) so preference-based
 * recommendations (api.recommendations.tsx genre mode) actually line up
 * with real track data — keep this in sync if that vocabulary changes.
 */
export const MUSIC_GENRES = [
  'Hip-Hop',
  'Trap',
  'Drill',
  'R&B',
  'Pop',
  'House',
  'Deep House',
  'Techno',
  'Dubstep',
  'Drum & Bass',
  'Lo-Fi',
  'Reggaeton',
  'Afrobeats',
  'Amapiano',
  'Funk & Soul',
  'Cinematic',
] as const;
