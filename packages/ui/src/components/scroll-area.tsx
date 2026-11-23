import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: ScrollArea { aria-label; children }
 *
 * A scrolling region with a thin native scrollbar. It takes keyboard focus so
 * arrow keys can scroll it, which is why it needs an aria-label.
 */

export type ScrollAreaProps = React.ComponentProps<"div"> & {
  /** Says what the region contains. Required, because the region is focusable. */
  "aria-label": string;
};

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <div
      role="region"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users need to reach a scrolling region (WCAG 2.1.1).
      tabIndex={0}
      data-slot="scroll-area"
      className={cn(
        "focus-ring relative overflow-auto [scrollbar-color:var(--gw-color-border-input)_transparent] [scrollbar-width:thin]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
