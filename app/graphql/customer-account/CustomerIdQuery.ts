// NOTE: minimal query used by account.preferences.tsx's action to resolve
// the logged-in customer's GID (needed as metafieldsSet's ownerId). Kept
// separate from CUSTOMER_DETAILS_QUERY so the write path doesn't depend on
// the full customer/address fragment.
export const CUSTOMER_ID_QUERY = `#graphql
  query CustomerId {
    customer {
      id
    }
  }
` as const;
