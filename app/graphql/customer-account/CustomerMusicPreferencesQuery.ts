// NOTE: minimal query used by routes/_index.tsx's loader to check whether
// the logged-in customer has saved genre preferences (account.preferences.tsx),
// so the homepage can show a "Für dich empfohlen" section. Kept separate
// from CUSTOMER_DETAILS_QUERY (used by the /account layout) since this
// only needs to run on the homepage and shouldn't pull in address data.
export const CUSTOMER_MUSIC_PREFERENCES_QUERY = `#graphql
  query CustomerMusicPreferences {
    customer {
      musicPreferences: metafield(namespace: "custom", key: "music_preferences") {
        value
      }
    }
  }
` as const;
