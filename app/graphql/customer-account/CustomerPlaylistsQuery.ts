// NOTE: minimal query used by api.playlists.sync.tsx's loader (GET) to read
// the logged-in customer's server-synced playlists. Mirrors
// CustomerMusicPreferencesQuery.ts. Requires the custom.playlists metafield
// definition (Content > Custom data > Customers) with "Customer Account API
// access: Read and write" — see docs/playlists-and-profile.md.
export const CUSTOMER_PLAYLISTS_QUERY = `#graphql
  query CustomerPlaylists {
    customer {
      playlists: metafield(namespace: "custom", key: "playlists") {
        value
      }
    }
  }
` as const;
