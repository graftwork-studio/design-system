import { LoaderCircleIcon } from "lucide-react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Spinner { size: sm | md | lg; label }
 *
 * Shows that something is loading. It has role="status" and a label, which
 * screen readers announce. Under reduced motion it stops turning.
 */

const sizes = { sm: "size-4", md: "size-6", lg: "size-8" } as const;

export type SpinnerProps = {
  /** Read out to screen readers. Defaults to "Loading". */
  label?: string;
  /** Defaults to md. */
  size?: keyof typeof sizes;
  className?: string;
};

export function Spinner({ label = "Loading", size = "md", className }: SpinnerProps) {
  return (
    <span data-slot="spinner" role="status" aria-label={label} className={cn("inline-flex text-icon-brand", className)}>
      <LoaderCircleIcon aria-hidden className={cn("animate-spin motion-reduce:animate-none", sizes[size])} />
    </span>
  );
}
