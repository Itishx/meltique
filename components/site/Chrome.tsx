"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

/** Routes that open on full-bleed dark imagery get a transparent header.
 *  Home is not one of them — its hero sits on paper. */
const OVERLAY_ROUTES = ["/our-craft", "/gifts"];

export function Chrome() {
  const pathname = usePathname();
  const overlay =
    OVERLAY_ROUTES.includes(pathname) || pathname.startsWith("/collections/");

  return <Header overlay={overlay} />;
}
