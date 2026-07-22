// NOTE: https://shopify.dev/docs/api/customer/latest/objects/LineItem
// Minimal-field query used only to answer "has this customer bought
// product X" (app/routes/api.downloads.authorize.tsx). `productId` is a
// direct scalar on LineItem specifically for entitlement checks like this
// one — no need to pull in the full Order/LineItem fragments from
// CustomerOrderQuery.ts, which are for the human-facing order history UI.
export const CUSTOMER_PRODUCT_ORDERS_QUERY = `#graphql
  query CustomerProductOrders($first: Int!, $language: LanguageCode)
    @inContext(language: $language) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          lineItems(first: 50) {
            nodes {
              productId
            }
          }
        }
      }
    }
  }
` as const;
