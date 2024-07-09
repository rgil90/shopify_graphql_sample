import dotenv from 'dotenv';
import { argv } from 'process';
import {createGraphQLClient} from '@shopify/graphql-client';

dotenv.config();

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

const keywordSearchTerm = argv[2];

if (!keywordSearchTerm) {
  console.error('Please provide a keyword to search for products. Example: node app.js "shirt"');
  process.exit(1);
}


console.log(`Searching for products with title containing: ${keywordSearchTerm}`);

// Initialize Shopify Graphql API Client
const client = createGraphQLClient({
  url: `${SHOPIFY_STORE_URL}/api/2024-07/graphql.json`,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
  },
  retries: 3,
});

const productsWithVariantsQuery = `
  query ProductsQuery($query: String) {
    products(first:10, query: $query) {
      edges {
        node {
          id
          title
          variants(first: 100) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const {data, errors, extensions} = await client.request(productsWithVariantsQuery, {
  variables: {
    query: `title:*${keywordSearchTerm}*`,
  },
});

if (data) {
  const allVariants = [];
  data.products.edges.forEach((product) => {
    product.node.variants.edges.map((variant) => {
      allVariants.push({
        productName: product.node.title,
        title: variant.node.title,
        price: parseFloat(variant.node.priceV2.amount),
      });
    });
  });

  allVariants.sort((a, b) => {
    return a.price - b.price;
  });

  allVariants.forEach((variant) => {
    console.log(`Product: ${variant.productName} - Variant: ${variant.title} - Price: $${variant.price}`);
  });
} else if (errors) {
  console.error('Error fetching products:', errors);
  if (extensions) {
    console.error('Extensions:', extensions);
  }
}
