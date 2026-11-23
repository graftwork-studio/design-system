"use client";

import type * as React from "react";
import {
  Link as LinkPrimitive,
  type LinkProps,
  Popover as PopoverPrimitive,
  type PopoverProps,
  PreviewTrigger,
  type PreviewTriggerProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { floatingPanel } from "./popover.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Previews what's behind a link on hover, focus or long press. The link must
 * still work on its own, so never put anything essential only in the card.
 */

export function HoverCard(props: PreviewTriggerProps) {
  return <PreviewTrigger {...props} />;
}

export type HoverCardTriggerProps = Omit<LinkProps, "className" | "style"> & { className?: string };

export function HoverCardTrigger({ className, ...props }: HoverCardTriggerProps) {
  return <LinkPrimitive data-slot="hover-card-trigger" className={cn("focus-ring hit-area cursor-pointer rounded-sm font-medium", className)} {...props} />;
}

export type HoverCardContentProps = Omit<PopoverProps, "className" | "style" | "children"> & {
  className?: string;
  children: React.ReactNode;
};

export function HoverCardContent({ className, placement = "bottom", offset = 4, ...props }: HoverCardContentProps) {
  return (
    <PopoverPrimitive
      data-slot="hover-card-content"
      placement={placement}
      offset={offset}
      className={cn(floatingPanel, "w-64 max-w-[calc(100vw-2rem)] p-2.5 text-sm", className)}
      {...props}
    />
  );
}
