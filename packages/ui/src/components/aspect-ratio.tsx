import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Keeps its content at a set shape, like 16 / 9 for a video.
 */

export type AspectRatioProps = React.ComponentProps<"div"> & {
  /** Width divided by height, like 16 / 9. Defaults to 1. */
  ratio?: number;
};

export function AspectRatio({ ratio = 1, className, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ aspectRatio: ratio, ...style }}
      className={cn("relative w-full overflow-hidden [&>img]:size-full [&>img]:object-cover", className)}
      {...props}
    />
  );
}
