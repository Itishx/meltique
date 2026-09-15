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
    return Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
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
