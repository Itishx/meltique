export interface CartLine {
  /** `slug` or `slug:variantId` — one line per sellable configuration. */
  id: string;
  slug: string;
  variantId?: string;
  name: string;
  variantName?: string;
  priceInPaise: number;
  image: string;
  imageAlt: string;
  quantity: number;
}

const STORAGE_KEY = "meltyk.cart.v1";
const MAX_PER_LINE = 12;

/**
 * Slugs that have been renamed since carts started being saved.
 *
 * A cart lives in localStorage for months. When Classic Dark became Meltyk
 * Muse the slug moved with it, and every basket saved before that kept
 * pointing at a product the checkout could no longer resolve — so those lines
 * were dropped on the way to Shopify and people watched their order shrink.
 *
 * Renaming a slug means adding an entry here. There is no way around it: the
 * old value is already sitting in other people's browsers.
 */
const RENAMED_SLUGS: Record<string, string> = {
  "classic-dark": "meltyk-muse",
};

function migrate(saved: CartLine[]): CartLine[] {
  const merged = new Map<string, CartLine>();

  for (const line of saved) {
    const slug = RENAMED_SLUGS[line.slug] ?? line.slug;
    const id = line.id === line.slug ? slug : line.id.replace(/^[^:]+/, slug);

    /* A cart can hold both the old and the new slug — added either side of
       the rename — and they are the same product, so they fold together. */
    const existing = merged.get(id);
    merged.set(
      id,
      existing
        ? { ...existing, quantity: Math.min(MAX_PER_LINE, existing.quantity + line.quantity) }
        : { ...line, id, slug },
    );
  }

  return [...merged.values()];
}

/**
 * The cart lives outside React, in localStorage.
 *
 * Modelling it as an external store rather than effect-synchronised state
 * means the snapshot is correct on first client render, and a change in one
 * tab reaches every other tab through the `storage` event.
 */
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return migrate(parsed as CartLine[]);
  } catch {
    /* Private browsing or blocked storage — an empty cart is the right answer. */
    return EMPTY;
  }
}

function write(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* The cart still works for this session. */
  }
  for (const listener of listeners) listener();
}

export function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    lines = read();
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Cached so repeated calls stay referentially stable, as React requires. */
export function getSnapshot(): CartLine[] {
  if (!hydrated) {
    lines = read();
    hydrated = true;
  }
  return lines;
}

/** The server has no cart; React swaps to the real snapshot after hydration. */
export function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function addLine(line: Omit<CartLine, "quantity">, quantity = 1) {
  const current = getSnapshot();
  const existing = current.find((l) => l.id === line.id);

  write(
    existing
      ? current.map((l) =>
          l.id === line.id
            ? { ...l, quantity: Math.min(MAX_PER_LINE, l.quantity + quantity) }
            : l,
        )
      : [...current, { ...line, quantity: Math.min(MAX_PER_LINE, quantity) }],
  );
}

export function setLineQuantity(id: string, quantity: number) {
  const current = getSnapshot();
  write(
    quantity <= 0
      ? current.filter((l) => l.id !== id)
      : current.map((l) =>
          l.id === id ? { ...l, quantity: Math.min(MAX_PER_LINE, quantity) } : l,
        ),
  );
}

export function removeLine(id: string) {
  write(getSnapshot().filter((l) => l.id !== id));
}

export function clearCart() {
  write(EMPTY);
}

export const cartLineId = (slug: string, variantId?: string) =>
  variantId ? `${slug}:${variantId}` : slug;
