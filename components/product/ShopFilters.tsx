"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { clsx } from "@/lib/clsx";

interface Props {
  families: string[];
  active: { family?: string; sort?: string };
  count: number;
}

/**
 * Filters are URL state, so a filtered view is shareable and the back button
 * behaves. Every control is a real link except sort, which is a select.
 */
export function ShopFilters({ families, active, count }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const href = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || next.get(key) === value) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const hasFilters = Boolean(active.family);

  return (
    <div className="mt-14 border-t border-rule pt-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <FilterRow label="Shop">
            {families.map((family) => (
              <FilterLink key={family} href={href("family", family)} active={active.family === family}>
                {family}
              </FilterLink>
            ))}
          </FilterRow>
        </div>

        <div className="flex items-center gap-6">
          <p className="label text-muted">
            {count} {count === 1 ? "product" : "products"}
          </p>

          <label className="label flex items-center gap-2 text-muted">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={active.sort ?? ""}
              onChange={(event) => router.push(href("sort", event.target.value || undefined))}
              /* An explicit surface so the native option list stays legible. */
              className="label border-b border-rule bg-paper py-1 text-ink focus:outline-none"
            >
              <option value="">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </label>

          {hasFilters ? (
            <Link href={pathname} className="label link-draw text-bronze-ink">
              Clear
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="label w-12 shrink-0 text-muted">{label}</span>
      {children}
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      className={clsx(
        "label border-b pb-0.5 transition-colors",
        active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
