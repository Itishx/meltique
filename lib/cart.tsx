"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  addLine,
  cartLineId,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  removeLine,
  setLineQuantity,
  subscribe,
  type CartLine,
} from "./cart-store";

export type { CartLine };
export { cartLineId };

/** Only the drawer's open state is React's to own; the cart itself is external. */
const DrawerContext = createContext<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const value = useMemo(() => ({ isOpen, setOpen }), [isOpen]);
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

const noopSubscribe = () => () => {};

/**
 * True once React has hydrated. Used to hold cart-dependent UI steady for the
 * one frame before the real snapshot arrives, without an effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useCart() {
  const drawer = useContext(DrawerContext);
  if (!drawer) throw new Error("useCart must be used inside CartProvider");

  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { isOpen, setOpen } = drawer;

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      addLine(line, quantity);
      setOpen(true);
    },
    [setOpen],
  );

  return useMemo(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalInPaise = lines.reduce((n, l) => n + l.priceInPaise * l.quantity, 0);
    return {
      lines,
      count,
      subtotalInPaise,
      isOpen,
      open,
      close,
      add,
      setQuantity: setLineQuantity,
      remove: removeLine,
      clear: clearCart,
    };
  }, [lines, isOpen, open, close, add]);
}
