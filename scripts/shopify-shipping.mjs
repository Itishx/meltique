/**
 * Brings Shopify's shipping rates in line with what the site promises.
 *
 *   node scripts/shopify-shipping.mjs            # inspect only
 *   node scripts/shopify-shipping.mjs --write    # apply
 *
 * Two things to fix:
 *
 *   1. The default rate is a flat 379 on boxes that cost 350-425. Nobody
 *      completes that checkout.
 *   2. The cart shows a free-delivery meter driven by
 *      offers.freeDeliveryOverPaise. Without a matching rule in Shopify that
 *      meter is a promise checkout breaks.
 *
 * Needs an Admin token with read_shipping and write_shipping.
 */

import { readFileSync } from "node:fs";

const API_VERSION = "2026-07";
const WRITE = process.argv.includes("--write");

/** What a 90g parcel should actually cost to send within India. */
const STANDARD_RATE = 70;

/**
 * Domestic only.
 *
 * The free-delivery meter in the cart is priced against Indian rupees and
 * Indian postage. Applying the same numbers to the international zone would
 * reprice an 1800 rupee overseas rate down to 70 and hand out free worldwide
 * shipping over 999 — a loss on every order that left the country.
 */
const HOME_COUNTRY = "IN";

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
if (!token) die("SHOPIFY_ADMIN_TOKEN is not set.");

const { offers } = await import("../lib/site.ts");
const freeOver = offers.freeDeliveryOverPaise / 100;

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
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
  const body = await response.json();
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join("; "));
  return body.data;
}

const PROFILES = `
  query {
    deliveryProfiles(first: 5) {
      nodes {
        id
        name
        default
        profileLocationGroups {
          locationGroup { id }
          locationGroupZones(first: 20) {
            nodes {
              zone { id name countries { code { countryCode } } }
              methodDefinitions(first: 20) {
                nodes {
                  id
                  name
                  active
                  rateProvider {
                    ... on DeliveryRateDefinition {
                      id
                      price { amount currencyCode }
                    }
                  }
                  methodConditions {
                    id
                    field
                    operator
                    conditionCriteria {
                      ... on MoneyV2 { amount currencyCode }
                      ... on Weight { value unit }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const UPDATE = `
  mutation Update($id: ID!, $profile: DeliveryProfileInput!) {
    deliveryProfileUpdate(id: $id, profile: $profile) {
      profile { id }
      userErrors { field message }
    }
  }
`;

console.log(`\n  MELTYK shipping -> ${shop}`);
console.log(`  standard rate     ${STANDARD_RATE}`);
console.log(`  free delivery at  ${freeOver} (from lib/site.ts)`);
console.log(`  mode              ${WRITE ? "WRITE" : "inspect only"}\n`);

const data = await admin(PROFILES);
const profile = data.deliveryProfiles.nodes.find((p) => p.default) ?? data.deliveryProfiles.nodes[0];
if (!profile) die("No delivery profile found.");

console.log(`  profile: ${profile.name} (${profile.id})\n`);

const plan = [];

for (const group of profile.profileLocationGroups) {
  for (const zoneNode of group.locationGroupZones.nodes) {
    const codes = zoneNode.zone.countries.map((c) => c.code.countryCode);
    const domestic = codes.length === 1 && codes[0] === HOME_COUNTRY;
    console.log(
      `  zone: ${zoneNode.zone.name} [${codes.join(",") || "—"}]` +
        (domestic ? "" : "  (skipped — not domestic)"),
    );

    for (const method of zoneNode.methodDefinitions.nodes) {
      const price = method.rateProvider?.price;
      const conditions = method.methodConditions
        .map((c) => `${c.field} ${c.operator} ${JSON.stringify(c.conditionCriteria)}`)
        .join("; ");
      console.log(
        `    - "${method.name}" ${price ? price.amount + " " + price.currencyCode : "carrier-calculated"}` +
          (conditions ? `  [${conditions}]` : "") +
          (method.active ? "" : "  (inactive)"),
      );
    }

    if (!domestic) continue;

    const hasFreeTier = zoneNode.methodDefinitions.nodes.some(
      (m) => Number.parseFloat(m.rateProvider?.price?.amount ?? "-1") === 0,
    );

    plan.push({
      zoneId: zoneNode.zone.id,
      zoneName: zoneNode.zone.name,
      locationGroupId: group.locationGroup.id,
      /* Repriced rather than replaced: an existing definition keeps its id,
         so anything already referencing it keeps working. */
      repricing: zoneNode.methodDefinitions.nodes
        .filter((m) => {
          const amount = Number.parseFloat(m.rateProvider?.price?.amount ?? "-1");
          return amount > 0 && amount !== STANDARD_RATE;
        })
        .map((m) => ({ id: m.id, from: m.rateProvider.price.amount })),
      needsFreeTier: !hasFreeTier,
    });
  }
}

console.log("\n  Plan");
for (const zone of plan) {
  for (const rate of zone.repricing) {
    console.log(`    ${zone.zoneName}: reprice ${rate.from} -> ${STANDARD_RATE}`);
  }
  if (zone.needsFreeTier) {
    console.log(`    ${zone.zoneName}: add "Free delivery" at 0, orders >= ${freeOver}`);
  }
}

if (!WRITE) {
  console.log(`\n  Nothing written. Re-run with --write to apply.\n`);
  process.exit(0);
}

for (const zone of plan) {
  const methodDefinitionsToUpdate = zone.repricing.map((rate) => ({
    id: rate.id,
    rateDefinition: { price: { amount: STANDARD_RATE, currencyCode: "INR" } },
  }));

  const methodDefinitionsToCreate = zone.needsFreeTier
    ? [
        {
          name: "Free delivery",
          description: `On orders over ${freeOver}`,
          active: true,
          rateDefinition: { price: { amount: 0, currencyCode: "INR" } },
          priceConditionsToCreate: [
            { operator: "GREATER_THAN_OR_EQUAL_TO", criteria: { amount: freeOver, currencyCode: "INR" } },
          ],
        },
      ]
    : [];

  if (!methodDefinitionsToUpdate.length && !methodDefinitionsToCreate.length) continue;

  const result = await admin(UPDATE, {
    id: profile.id,
    profile: {
      locationGroupsToUpdate: [
        {
          id: zone.locationGroupId,
          zonesToUpdate: [
            { id: zone.zoneId, methodDefinitionsToCreate, methodDefinitionsToUpdate },
          ],
        },
      ],
    },
  });

  const errors = result.deliveryProfileUpdate.userErrors;
  if (errors?.length) {
    for (const error of errors) {
      console.error(`  x ${zone.zoneName}: ${error.field?.join(".") ?? ""} ${error.message}`);
    }
    process.exit(1);
  }
  console.log(`  ok  ${zone.zoneName}`);
}

console.log("\n  Shipping updated.\n");
