// NOTE: https://shopify.dev/docs/api/customer/latest/mutations/metafieldsSet
// Writes the logged-in customer's full playlists array (as JSON) to the
// custom.playlists metafield. Mirrors CustomerPreferencesMutation.ts. That
// metafield definition must have "Customer Account API access: Read and
// write" enabled in Shopify Admin (Settings > Custom data > Customers) —
// without it this mutation fails with a DISALLOWED_OWNER_TYPE error.
export const CUSTOMER_PLAYLISTS_MUTATION = `#graphql
  mutation customerPlaylistsSet(
    $customerId: ID!
    $value: String!
    $language: LanguageCode
  ) @inContext(language: $language) {
    metafieldsSet(
      metafields: [
        {
          ownerId: $customerId
          namespace: "custom"
          key: "playlists"
          type: "json"
          value: $value
        }
      ]
    ) {
      metafields {
        id
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
` as const;
