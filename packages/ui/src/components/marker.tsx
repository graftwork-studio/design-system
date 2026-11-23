import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Marker { variant: default | separator | border }, MarkerIcon, MarkerContent
 *
 * An inline note in a conversation, like "Today" or "Ana joined".
 */

export const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-text-secondary [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:me-1 before:h-px before:min-w-0 before:flex-1 before:bg-border-default after:ms-1 after:h-px after:min-w-0 after:flex-1 after:bg-border-default",
        border: "border-b border-border-default pb-2",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type MarkerProps = React.ComponentProps<"div"> & {
  /** Defaults to default. */
  variant?: "default" | "separator" | "border";
};

export function Marker({ className, variant = "default", ...props }: MarkerProps) {
  return <div data-slot="marker" data-variant={variant} className={cn(markerVariants({ variant }), className)} {...props} />;
}

export function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="marker-icon" aria-hidden="true" className={cn("size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} {...props} />;
}

export function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn("min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center", className)}
      {...props}
    />
  );
}
