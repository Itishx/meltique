import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[70svh] flex-col justify-center pb-24 pt-32">
      <p className="label text-bronze-ink">404</p>
      <h1 className="display mt-5 max-w-[26ch] text-display-xl">
        This page has melted away.
      </h1>
      <p className="mt-6 max-w-[60ch] text-sm text-muted">
        The link may be old, or the edition may have closed. Seasonal runs are
        not repeated.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
        <Link
          href="/shop"
          className="label flex h-13 items-center bg-cocoa px-9 text-gold transition-colors hover:bg-espresso"
        >
          Shop the range
        </Link>
        <Link href="/" className="label link-draw self-center">
          Back home
        </Link>
      </div>
    </div>
  );
}
