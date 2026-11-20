"use client";

import {
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  TooltipTrigger,
  type TooltipTriggerComponentProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Tooltip, TooltipContent { placement }
 *
 *   <Tooltip>
 *     <Button aria-label="Archive" variant="ghost"><ArchiveIcon aria-hidden /></Button>
 *     <TooltipContent>Archive</TooltipContent>
 *   </Tooltip>
 *
 * Shows on hover and on keyboard focus, and Escape hides it (WCAG 1.4.13).
 * Tooltips are a hint, not the only place to find information: never put
 * anything essential or interactive in one, and touch users won't see it.
 */

export function Tooltip({ delay = 600, closeDelay = 200, ...props }: TooltipTriggerComponentProps) {
  return <TooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />;
}

export type TooltipContentProps = Omit<TooltipPrimitiveProps, "className" | "style"> & { className?: string };

export function TooltipContent({ className, offset = 6, ...props }: TooltipContentProps) {
  return (
    <TooltipPrimitive
      data-slot="tooltip"
      offset={offset}
      className={cn(
        "max-w-xs rounded-sm bg-text-default px-2 py-1 text-sm text-surface-default",
        "transition-opacity duration-(--gw-motion-duration-fade) data-entering:opacity-0 data-exiting:opacity-0",
        className,
      )}
      {...props}
    />
  );
}
