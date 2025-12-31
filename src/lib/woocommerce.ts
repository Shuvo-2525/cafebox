import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Initialize the WooCommerce Rest API client.
// NOTE: This must only be used in Server Components or API Routes to protect the Consumer Secret.
export const wooCommerceClient = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "",
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
    version: "wc/v3",
});
