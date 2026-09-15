/**
 * Tells you exactly how far the Shopify connection has got.
 *
 *   npm run shopify:check
 *
 * Each step either passes or prints the one thing to do next, so a
 * half-finished setup is visible now rather than showing up later as an empty
 * catalogue or a checkout button that quietly does nothing.
 */

import { readFileSync } from "node:fs";

const API_VERSION = "2026-07";

try {
  const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of raw.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
} catch {
  /* Vars may already be exported. */
}

const shop = process.env.SHOPIFY_STORE_DOMAIN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
const token = privateToken || publicToken;

const pass = (m) => console.log(`  [ok]   ${m}`);
const fail = (m, next) => {
  console.log(`  [FAIL] ${m}`);
  if (next) console.log(`         -> ${next}`);
};
const info = (m) => console.log(`         ${m}`);

console.log("\n  MELTYK . Shopify connection\n");

/* ------------------------------------------------------------ 1. domain -- */
if (!shop) {
  fail("SHOPIFY_STORE_DOMAIN not set", "Add it to .env.local");
  process.exit(1);
}
pass(`store domain  ${shop}`);

/* ------------------------------------------------------ 2. store online -- */
try {
  const response = await fetch(`https://${shop}/`, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  if (location.endsWith("/password")) {
    pass("store reachable (password-protected, normal for a trial)");
    info("Shoppers cannot browse it yet. Remove the password under");
    info("Online Store > Preferences when you are ready to launch.");
  } else {
    pass("store reachable and public");
  }
} catch {
  fail("store unreachable", "Check the domain spelling");
}

/* --------------------------------------------------- 3. storefront token -- */
if (!token) {
  fail(
    "no Storefront token",
    "Install the Headless channel, Create storefront, copy the private token",
  );
  console.log("\n  Stopped: the site stays in pre-order mode until this is set.\n");
  process.exit(1);
}
pass(`storefront token (${privateToken ? "private" : "public"})`);

/* ------------------------------------------------------- 4. api reaches -- */
const headers = { "Content-Type": "application/json" };
headers[
  privateToken ? "Shopify-Storefront-Private-Token" : "X-Shopify-Storefront-Access-Token"
] = token;

async function storefront(query) {
  const response = await fetch(`https://${shop}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
  const body = await response.json();
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join("; "));
  return body.data;
}

try {
  const data = await storefront(`{ shop { name paymentSettings { currencyCode } } }`);
  pass(`Storefront API ${API_VERSION} responding - "${data.shop.name}"`);
  const currency = data.shop.paymentSettings.currencyCode;
  if (currency === "INR") {
    pass(`store currency ${currency}`);
  } else {
    fail(
      `store currency is ${currency}, catalogue is priced in INR`,
      "Change it under Settings > Store details",
    );
  }
} catch (error) {
  fail(
    `Storefront API rejected the token: ${error.message}`,
    "Re-copy the token from the Headless channel",
  );
  process.exit(1);
}

/* ---------------------------------------------------------- 5. products -- */
const { products: local } = await import("../lib/products.ts");

try {
  const data = await storefront(
    `{ products(first: 50) { nodes { handle title availableForSale
         variants(first: 1) { nodes { id price { amount currencyCode } } } } } }`,
  );
  const remote = new Map(data.products.nodes.map((p) => [p.handle, p]));

  if (remote.size === 0) {
    fail("Shopify has no products", "Run: npm run shopify:sync -- --write");
  } else {
    pass(`${remote.size} product${remote.size === 1 ? "" : "s"} in Shopify`);
  }

  const missing = [];
  for (const product of local) {
    const match = remote.get(product.slug);
    if (!match) {
      missing.push(product.slug);
      continue;
    }
    const variant = match.variants.nodes[0];
    const remotePaise = Math.round(Number.parseFloat(variant.price.amount) * 100);
    const drift = remotePaise !== product.priceInPaise;
    const stock = match.availableForSale ? "in stock" : "SOLD OUT";
    info(
      `${product.slug.padEnd(16)} ${(remotePaise / 100).toFixed(2).padStart(8)}  ${stock}` +
        (drift ? `   (local says ${(product.priceInPaise / 100).toFixed(2)})` : ""),
    );
  }

  if (missing.length) {
    fail(`not in Shopify: ${missing.join(", ")}`, "Run: npm run shopify:sync -- --write");
  } else if (remote.size > 0) {
    pass("every local product has a Shopify match");
  }
} catch (error) {
  fail(`could not read products: ${error.message}`);
}

/* ------------------------------------------------------- 6. admin token -- */
if (adminToken) pass("admin token present (sync can write)");
else info("no admin token - needed only for: npm run shopify:sync -- --write");

console.log("");
