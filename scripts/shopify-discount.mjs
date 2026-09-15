/**
 * Creates (or updates) the launch discount code in Shopify.
 *
 *   node scripts/shopify-discount.mjs            # dry run
 *   node scripts/shopify-discount.mjs --write    # apply
 *
 * The code and percentage come from lib/site.ts, which is also what the
 * announcement bar prints. One source, so the bar cannot advertise a code that
 * does not exist.
 *
 * Needs an Admin token with `read_discounts` and `write_discounts`. The
 * products app only carries write_products, so add those scopes to the app
 * version in the Dev Dashboard and reinstall before running this.
 */

import { readFileSync } from "node:fs";

const API_VERSION = "2026-07";
const WRITE = process.argv.includes("--write");

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
const token = process.env.SHOPIFY_ADMIN_TOKEN;

const die = (m) => {
  console.error(`\n  ${m}\n`);
  process.exit(1);
};
if (!shop) die("SHOPIFY_STORE_DOMAIN is not set.");
if (WRITE && !token) die("SHOPIFY_ADMIN_TOKEN is not set. Needed for --write.");

const { offers } = await import("../lib/site.ts");

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
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const body = await response.json();
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  return body.data;
}

const FIND = `
  query Find($query: String!) {
    codeDiscountNodes(first: 5, query: $query) {
      nodes {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
            codes(first: 1) { nodes { code } }
          }
        }
      }
    }
  }
`;

const CREATE = `
  mutation Create($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode { id }
      userErrors { field message code }
    }
  }
`;

const UPDATE = `
  mutation Update($id: ID!, $basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicUpdate(id: $id, basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode { id }
      userErrors { field message code }
    }
  }
`;

const { code, percentOff } = offers.promo;

const input = {
  title: `Launch offer — ${percentOff}% off`,
  code,
  /* Starts now and does not expire. An end date is a promise to remember to
     extend it; leaving it open means the only way it stops is deliberately. */
  startsAt: new Date().toISOString(),
  customerSelection: { all: true },
  customerGets: {
    value: { percentage: percentOff / 100 },
    items: { all: true },
  },
  appliesOncePerCustomer: true,
  /* Guards against a leak becoming unlimited free chocolate. */
  usageLimit: 500,
};

console.log(`\n  MELTYK discount -> ${shop}`);
console.log(`  code    ${code}`);
console.log(`  value   ${percentOff}% off everything`);
console.log(`  limits  once per customer, 500 uses total`);
console.log(`  mode    ${WRITE ? "WRITE" : "dry run (pass --write to apply)"}\n`);

if (!WRITE) {
  console.log("  Nothing written.\n");
  process.exit(0);
}

try {
  /* Look first so a second run updates the existing code rather than failing
     on a duplicate, which is what makes this safe to re-run after a change. */
  const found = await admin(FIND, { query: `code:${code}` });
  const existing = found.codeDiscountNodes.nodes.find((node) =>
    node.codeDiscount?.codes?.nodes?.some((c) => c.code === code),
  );

  const result = existing
    ? (await admin(UPDATE, { id: existing.id, basicCodeDiscount: input }))
        .discountCodeBasicUpdate
    : (await admin(CREATE, { basicCodeDiscount: input }))
        .discountCodeBasicCreate;

  if (result.userErrors?.length) {
    for (const error of result.userErrors) {
      console.error(`  x ${error.field?.join(".") ?? ""} ${error.message}`);
    }
    process.exit(1);
  }

  console.log(
    `  ${existing ? "updated" : "created"}  ${result.codeDiscountNode.id}\n`,
  );
} catch (error) {
  die(`Failed: ${error.message}`);
}
