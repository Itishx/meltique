/**
 * Pushes the MELTYK catalogue into Shopify.
 *
 * lib/products.ts stays the source of truth. This script mirrors it into the
 * store using `productSet` keyed on handle, which upserts: run it once to
 * create the products, run it again after a price change and it updates the
 * same five rather than making five more.
 *
 *   node scripts/shopify-sync.mjs            # dry run, prints the payload
 *   node scripts/shopify-sync.mjs --write    # actually writes to Shopify
 *
 * Needs an Admin API token (scopes: write_products, read_products) from a
 * custom app, in SHOPIFY_ADMIN_TOKEN. That token can change your live store,
 * so it is deliberately separate from the Storefront token and is never read
 * by the running site — only by this script.
 */

import { readFileSync } from "node:fs";

const API_VERSION = "2026-07";
const WRITE = process.argv.includes("--write");

/* --------------------------------------------------------------- env ---- */
function loadEnv() {
  /* Read .env.local directly: this runs as a bare node script, outside the
     Next.js runtime that would normally load it. */
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, "");
      if (!process.env[match[1]]) process.env[match[1]] = value;
    }
  } catch {
    /* No .env.local is fine if the vars are already exported. */
  }
}
loadEnv();

const shop = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_TOKEN;
/* Product media must be fetchable by Shopify, so images are referenced at
   their deployed URLs rather than uploaded from disk. */
const publicOrigin =
  process.env.SHOPIFY_PUBLIC_ORIGIN ?? "https://meltique.vercel.app";

function die(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!shop) die("SHOPIFY_STORE_DOMAIN is not set (e.g. 5pxmtf-ni.myshopify.com).");
if (WRITE && !token) die("SHOPIFY_ADMIN_TOKEN is not set. Needed for --write.");

/* ----------------------------------------------------------- catalogue -- */
const { products } = await import("../lib/products.ts");

/* `productSet` upserts on the handle identifier, which is what makes this
   script safe to re-run: the same five products are updated, not duplicated. */
const DOCUMENT = `
  mutation SetProduct($input: ProductSetInput!, $handle: String!) {
    productSet(input: $input, identifier: { handle: $handle }, synchronous: true) {
      product {
        id
        handle
        title
        status
        variants(first: 5) { nodes { id title price sku } }
      }
      userErrors { field message code }
    }
  }
`;

const rupees = (paise) => (paise / 100).toFixed(2);

function describe(product) {
  /* The product page is the real writing; Shopify gets a faithful short
     version so the admin and any channel listing read properly. */
  const story = product.story.map((p) => `<p>${p}</p>`).join("");
  const notes = product.sensoryNotes.length
    ? `<p><strong>Notes:</strong> ${product.sensoryNotes.join(" · ")}</p>`
    : "";
  const ingredients = product.ingredients.length
    ? `<p><strong>Ingredients:</strong> ${product.ingredients.join(", ")}</p>`
    : "";
  const allergens = product.allergens.length
    ? `<p><strong>Allergens:</strong> ${product.allergens.join(", ")}</p>`
    : "";
  return `<p><em>${product.tagline}</em></p><p>${product.summary}</p>${story}${notes}${ingredients}${allergens}<p><strong>Storage:</strong> ${product.storage}</p>`;
}

function toInput(product) {
  const image = product.boxImage ?? product.poster ?? product.images[0];
  return {
    handle: product.slug,
    title: product.name,
    descriptionHtml: describe(product),
    vendor: "MELTYK",
    productType: "Chocolate",
    status: "ACTIVE",
    tags: [
      "box-of-4",
      product.assorted ? "assorted" : "single-flavour",
      ...product.dietary.map((d) => d.toLowerCase()),
    ],
    /* A Box of 4 has no choices to make, so it carries Shopify's implicit
       single option rather than inventing one. */
    productOptions: [
      { name: "Title", values: [{ name: "Default Title" }] },
    ],
    variants: [
      {
        optionValues: [{ optionName: "Title", name: "Default Title" }],
        price: rupees(product.priceInPaise),
        sku: `MLTK-${product.slug.toUpperCase().replace(/-/g, "")}`,
        inventoryPolicy: "DENY",
      },
    ],
    files: image
      ? [
          {
            originalSource: new URL(image.src, publicOrigin).toString(),
            contentType: "IMAGE",
            alt: image.alt,
          },
        ]
      : [],
  };
}

/* ------------------------------------------------------------- request -- */
async function admin(query, variables) {
  const response = await fetch(
    `https://${shop}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} ${response.statusText} ${text.slice(0, 300)}`);
  }

  const body = await response.json();
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  return body.data;
}

/* ---------------------------------------------------------------- run --- */
console.log(`\n  MELTYK → ${shop}`);
console.log(`  ${products.length} products, API ${API_VERSION}`);
console.log(`  mode: ${WRITE ? "WRITE" : "dry run (pass --write to apply)"}\n`);

let failures = 0;

for (const product of products) {
  const input = toInput(product);
  const price = `₹${rupees(product.priceInPaise)}`;

  if (!WRITE) {
    console.log(`  · ${input.handle.padEnd(16)} ${input.title.padEnd(20)} ${price.padStart(9)}`);
    console.log(`      sku   ${input.variants[0].sku}`);
    console.log(`      image ${input.files[0]?.originalSource ?? "none"}`);
    continue;
  }

  try {
    const data = await admin(DOCUMENT, { input, handle: input.handle });
    const result = data.productSet;
    if (result.userErrors?.length) {
      failures += 1;
      console.error(`  ✗ ${input.handle}`);
      for (const error of result.userErrors) {
        console.error(`      ${error.field?.join(".") ?? ""} ${error.message}`);
      }
      continue;
    }
    const variant = result.product.variants.nodes[0];
    console.log(
      `  ✓ ${result.product.handle.padEnd(16)} ${price.padStart(9)}  ${result.product.id}`,
    );
    if (variant) console.log(`      variant ${variant.id}`);
  } catch (error) {
    failures += 1;
    console.error(`  ✗ ${input.handle}: ${error.message}`);
  }
}

if (!WRITE) {
  console.log(`\n  Nothing written. Re-run with --write to apply.\n`);
} else if (failures) {
  console.error(`\n  ${failures} of ${products.length} failed.\n`);
  process.exit(1);
} else {
  console.log(`\n  All ${products.length} products synced.\n`);
}
