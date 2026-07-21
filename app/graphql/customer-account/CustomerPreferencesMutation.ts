// NOTE: https://shopify.dev/docs/api/customer/latest/mutations/metafieldsSet
// Writes the logged-in customer's music preferences (genres + favorite
// artists) to the custom.music_preferences JSON metafield. That metafield
// definition must have "Customer Account API access: Read and write"
// enabled in Shopify Admin (Settings > Custom data > Customers) — without
// it this mutation fails with a DISALLOWED_OWNER_TYPE error.
export const CUSTOMER_PREFERENCES_MUTATION = `#graphql
  mutation customerPreferencesSet(
    $customerId: ID!
    $value: String!
    $language: LanguageCode
  ) @inContext(language: $language) {
    metafieldsSet(
      metafields: [
        {
          ownerId: $customerId
          namespace: "custom"
          key: "music_preferences"
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
