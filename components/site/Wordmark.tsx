import { clsx } from "@/lib/clsx";

/**
 * The logotype. Title case, high-contrast serif — never all caps, never
 * "Meltique". The optional monogram is the circled M used on seals and foil.
 */
export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-display-lg",
  };

  return (
    <span className={clsx("wordmark select-none", sizes[size], className)}>Meltyk</span>
  );
}

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-flex size-9 items-center justify-center rounded-full border border-current",
        className,
      )}
    >
      <span className="wordmark text-sm leading-none">M</span>
    </span>
  );
}
