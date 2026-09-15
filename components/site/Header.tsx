"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { clsx } from "@/lib/clsx";
import { useCart, useHydrated } from "@/lib/cart";
import { nav, site } from "@/lib/site";
import { AnnouncementBar } from "./AnnouncementBar";
import { Wordmark } from "./Wordmark";

/**
 * The header is transparent over a dark hero and solid everywhere else.
 * Pages that open on full-bleed imagery set `overlay`.
 */
export function Header({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const { count, open } = useCart();
  const ready = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onDark = overlay && !scrolled;

  return (
    <>
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500",
        /* The promo bar carries its own opaque ground, so only the nav row
           below it goes transparent over a hero. */
        onDark
          ? "border-b border-transparent text-on-dark"
          : "border-b border-rule bg-paper/92 text-ink backdrop-blur-xl",
      )}
    >
      <AnnouncementBar />

      {/* Three columns so the nav stays optically centred whatever the sides do. */}
      {/* Mobile is a plain flex row. The three-column grid exists only to centre
          the desktop nav, and on a phone it reserves equal side columns for a
          nav that is not rendered. */}
      <div className="gutter flex h-[var(--header-h)] items-center justify-between gap-4 [--header-h:4.25rem] md:[--header-h:6rem] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <Link
          href="/"
          className="justify-self-start py-2 leading-none"
          aria-label={`${site.name} · home`}
        >
          <Wordmark size="md" className="text-[1.4rem] sm:text-[1.65rem] md:text-[2.1rem]" />
        </Link>

        <nav aria-label="Primary" className="hidden justify-self-center lg:block">
          <ul className="flex items-center gap-9 xl:gap-11">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "label link-draw whitespace-nowrap",
                      active && "after:scale-x-100",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-5 lg:col-start-3 lg:gap-7">
          <button type="button" onClick={open} className="label link-draw">
            Cart
            <span aria-hidden className="ml-1.5 tabular-nums">
              ({ready ? count : 0})
            </span>
            <span className="sr-only">
              {ready ? `${count} item${count === 1 ? "" : "s"} in cart` : "open cart"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="label -mr-2 px-2 py-3 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            Menu
          </button>
        </div>
      </div>
    </header>

      {/* Mobile navigation sheet.
          Deliberately a SIBLING of <header>, not a child. The header carries
          `backdrop-blur`, and a backdrop-filter makes an element a containing
          block for fixed-position descendants — nested here, `fixed inset-0`
          resolved against the 68px header bar instead of the viewport and the
          page showed through beneath it. */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        data-open={menuOpen ? "" : undefined}
        className="nav-sheet fixed inset-0 z-[80] flex flex-col overflow-y-auto overscroll-contain bg-espresso text-on-dark lg:hidden"
      >
        <div className="gutter flex h-[4.5rem] shrink-0 items-center justify-between border-b border-rule-dark">
          <Wordmark size="md" className="text-[1.6rem] text-gold" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="label -mr-2 px-2 py-3"
          >
            Close
          </button>
        </div>

        <nav
          aria-label="Primary"
          className="gutter flex flex-1 flex-col justify-center py-6"
        >
          {/* Centred rather than top-aligned: five items leave a large
              void under a tall phone otherwise. */}
          <ul className="w-full">
            {nav.map((item, index) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li
                  key={item.href}
                  className="border-b border-rule-dark"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 py-5"
                  >
                    <span className="label w-6 shrink-0 text-gold tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={clsx(
                        "display text-display-sm",
                        active && "text-gold",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="gutter shrink-0 border-t border-rule-dark py-7">
          <Link
            href="/pre-order"
            onClick={() => setMenuOpen(false)}
            className="label flex h-13 w-full items-center justify-center bg-gold text-espresso"
          >
            Pre-order a box
          </Link>
          <p className="label mt-5 text-on-dark-muted">{site.tagline}</p>
        </div>
      </div>
    </>
  );
}
