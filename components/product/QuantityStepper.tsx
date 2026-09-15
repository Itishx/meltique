"use client";

import { clsx } from "@/lib/clsx";

interface Props {
  value: number;
  onChange: (next: number) => void;
  label: string;
  min?: number;
  max?: number;
  compact?: boolean;
}

/** Minus / count / plus. The count is a live region so changes are announced. */
export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 12,
  compact = false,
}: Props) {
  const size = compact ? "size-7 text-xs" : "size-11 text-sm";

  return (
    <div
      className={clsx(
        "inline-flex items-center border border-rule",
        compact ? "gap-0" : "gap-1",
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min - 1, value - 1))}
        className={clsx(
          size,
          "grid place-items-center transition-colors hover:bg-linen disabled:opacity-30",
        )}
        aria-label="Decrease quantity"
      >
        <span aria-hidden>–</span>
      </button>

      <span
        aria-live="polite"
        className={clsx(
          "grid place-items-center tabular-nums",
          compact ? "w-7 text-xs" : "w-10 text-sm",
        )}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={clsx(
          size,
          "grid place-items-center transition-colors hover:bg-linen disabled:opacity-30",
        )}
        aria-label="Increase quantity"
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
