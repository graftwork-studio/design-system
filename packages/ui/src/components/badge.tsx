import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Badge { variant: neutral | info | success | warning | error | outline }
 *
 * A short label for a status or category. The words carry the meaning, so
 * "Live" and "Draft" read the same in any colour.
 */

export const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-transparent bg-surface-subtle text-text-default",
        info: "border-transparent bg-status-info-bg text-text-info",
        success: "border-transparent bg-status-success-bg text-text-success",
        warning: "border-transparent bg-status-warning-bg text-text-warning",
        error: "border-transparent bg-status-error-bg text-text-error",
        outline: "border-border-input bg-transparent text-text-default",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "error" | "outline";

export type BadgeProps = React.ComponentProps<"span"> & {
  /** Defaults to neutral. */
  variant?: BadgeVariant;
};

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return <span data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />;
}
