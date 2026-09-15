# Connecting MELTYK to Shopify

MELTYK is a **headless** Shopify storefront. The site you are looking at stays
exactly as it is, on Vercel. Shopify sits behind it and handles products,
inventory, orders, payment and checkout.

Nothing here is required for the site to run. With no tokens set, the Shopify
layer stays asleep and the storefront behaves exactly as it does today, in
pre-order mode. You can connect it whenever you are ready.

---

## Why not a Shopify theme?

Worth writing down, because it is the obvious first assumption and it is wrong.

A Shopify theme can only run **Liquid**, Shopify's template language. There is
no Node runtime, no React, no Next.js build. Per
[Shopify's theme architecture docs](https://shopify.dev/docs/storefronts/themes/architecture),
a theme is `layout/theme.liquid` plus Liquid templates, and "subdirectories
other than the ones listed aren't supported."

So turning this site into a theme would not be a conversion. It would be a
rewrite of all 184 files, and the React components, the cart, the scroll-driven
flavours rail and the whole Next.js app would be thrown away. Only the CSS and
the images would survive.

Headless keeps all of it and still gives you real Shopify commerce. That is the
trade this project made.

There is also a third thing that sounds relevant and isn't: `npm init
@shopify/app` scaffolds an **embedded admin app**, which runs *inside* the
Shopify admin to extend the backend. It has nothing to do with the storefront.

---

## Who owns what

The split is deliberate:

| | Owner |
|---|---|
| Story, tagline, sensory notes, ingredients, photography | `lib/products.ts` |
| Price, stock, variant IDs, orders, checkout | **Shopify** |

They are joined on **`handle` == `slug`**. A Shopify product with handle
`classic-dark` binds to the local product with slug `classic-dark`.

This matters: a commerce backend is a poor place to keep writing, and a
codebase is a poor place to keep inventory. Keeping them apart also means the
site still renders in full if Shopify is slow, down, or not yet configured.

---

## Setup

### 1. Get the Storefront token

This is the only token the website itself needs.

1. Shopify admin → **Settings → Apps and sales channels**
2. **Shopify App Store** → search **Headless** → install the Headless channel
3. Click **Create storefront**
4. Copy the **private access token**

(You need the *Apps and channels* permission on the store to do this.)

### 2. Put it in `.env.local`

Copy `.env.example` to `.env.local` and fill in:

```
SHOPIFY_STORE_DOMAIN=5pxmtf-ni.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your_token_here
```

The token is read on the server only. It is never sent to the browser — the
site talks to Shopify through its own `/api/checkout` route.

### 3. Check it

```bash
npm run shopify:check
```

This walks the whole connection and, for anything not yet done, prints the one
next step. Run it whenever something looks wrong.

### 4. Create the products

The five MELTYK products need to exist in Shopify. To push them from
`lib/products.ts` you need a second, more powerful token.

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**
2. **Create an app** → **Configure Admin API scopes**
3. Tick `write_products` and `read_products` → **Save** → **Install app**
4. Reveal and copy the **Admin API access token** (starts `shpat_`)
5. Add it to `.env.local` as `SHOPIFY_ADMIN_TOKEN`

Then:

```bash
npm run shopify:sync              # dry run, shows exactly what it would do
npm run shopify:sync -- --write   # actually creates them
```

The sync upserts on handle, so it is safe to re-run. Change a price in
`lib/products.ts`, run it again, and the same five products update rather than
five more appearing.

Product images are pulled by Shopify from the deployed site, so the site must
be live for images to sync. Set `SHOPIFY_PUBLIC_ORIGIN` if that is not
`https://meltique.vercel.app`.

**Keep the Admin token out of Vercel.** It can change your live store and the
running site never reads it — only the sync script does.

### 5. Deploy

Add the two site variables in the Vercel dashboard
(**Settings → Environment Variables**):

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`

Not `SHOPIFY_ADMIN_TOKEN`.

---

## Going live

Two things gate real orders, and neither is code:

1. **The store is password-protected.** Normal for a trial. Remove it under
   **Online Store → Preferences**.
2. **You need a paid plan** to take real payments. Basic and above support
   headless. Until then checkout renders but cannot charge.

---

## How checkout works

The local cart stays the source of truth for the UI, so adding and changing
quantities is instant and works offline. Shopify only gets involved at the
moment of checkout, which is the first moment it has to be authoritative.

1. Shopper clicks **Proceed to checkout** in `components/site/CartView.tsx`
2. `lib/checkout.ts` POSTs `{slug, quantity}[]` to `/api/checkout`
3. `app/api/checkout/route.ts` resolves each slug to a live Shopify variant ID,
   creates a Shopify cart, and returns its `checkoutUrl`
4. The browser follows that URL to Shopify's hosted checkout

Variant IDs are resolved **server-side at checkout time**, not stored in the
browser cart. So a cart saved last week, or saved before the store existed at
all, still checks out, and re-creating a variant in the Shopify admin does not
strand anyone's basket.

If Shopify is not configured the route answers `503 not_configured` and the
button offers pre-order instead. That is a normal state of this project, not an
error.

---

## Files

```
lib/shopify/config.ts       env, API version, isShopifyConfigured
lib/shopify/client.ts       Storefront GraphQL fetch (server only)
lib/shopify/queries.ts      every GraphQL document in one place
lib/shopify/types.ts        response shapes, paise conversion
lib/shopify/cart.ts         cart create / add / update / remove
lib/shopify/catalogue.ts    merges Shopify price+stock onto local products
lib/checkout.ts             client helper, returns a result rather than throwing
app/api/checkout/route.ts   cart -> Shopify checkout URL
scripts/shopify-check.mjs   connection diagnostics
scripts/shopify-sync.mjs    pushes lib/products.ts into Shopify
```

The Storefront API version is pinned to `2026-07` in `lib/shopify/config.ts`.
Shopify retires versions on a schedule, so this needs a deliberate bump roughly
once a year rather than being left to float.
