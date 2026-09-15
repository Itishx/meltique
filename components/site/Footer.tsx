import Link from "next/link";

import { footerNav, site } from "@/lib/site";
import { Media } from "@/components/ui/Media";
import { Wordmark } from "./Wordmark";

/**
 * The footer sits on the product.
 *
 * The four-cube photograph is the background, anchored to the bottom so the
 * cubes stay on the stone ledge whatever the viewport does. The copy occupies
 * the empty upper half of the frame, over a scrim that fades out before it
 * reaches the chocolate.
 */
export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-cocoa text-on-dark">
      {/* Held at its own 8:3 ratio and pinned to the bottom, so the cubes stay
          life-size instead of being blown up to fill the footer's height. The
          gradient dissolves its top edge into the cocoa above it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 aspect-[2400/900] min-h-[9rem]">
        <Media
          src="/images/editorial/footer.jpg"
          alt=""
          sizes="100vw"
          quality={92}
          className="size-full object-cover object-bottom"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-cocoa from-2% via-cocoa/55 via-28% to-transparent to-55%"
        />
      </div>

      <div className="gutter relative pb-[9rem] pt-20 sm:pb-[13rem] md:pb-[17rem] md:pt-24 lg:pb-[22rem]">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
          <div>
            <Wordmark size="lg" className="text-gold" />
            <p className="display mt-6 max-w-[26ch] text-display-sm leading-tight">
              {site.tagline}
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="label border-b border-rule-dark pb-4 text-gold">
                  {group.heading}
                </h2>
                <ul className="mt-5 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {/* Display serif at reading size — the nav is the footer's
                          only typographic moment, so it gets the good face. The
                          vertical padding is the thumb target; the list gap
                          shrinks by the same amount so the rhythm is unchanged. */}
                      <Link
                        href={link.href}
                        className="display link-draw py-2 text-lg text-on-dark-muted transition-colors duration-300 hover:text-on-dark"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-rule-dark pt-8 text-xs text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nameUpper}. {site.tagline}
          </p>
          <p>{site.provisionalNote}</p>
        </div>
      </div>
    </footer>
  );
}
