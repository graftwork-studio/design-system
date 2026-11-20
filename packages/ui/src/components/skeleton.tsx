import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Skeleton { className sets the size and shape }
 *
 * A placeholder shape while content loads. It's hidden from assistive tech:
 * mark the region that's loading with aria-busy="true", and announce when it's
 * ready if that matters.
 */

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-md bg-surface-subtle motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
