"use client";

import type * as React from "react";
import {
  Dialog as DialogPrimitive,
  type DialogProps as DialogPrimitiveProps,
  DialogTrigger,
  type DialogTriggerProps,
  Heading,
  OverlayArrow,
  Popover as PopoverPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Popover, PopoverContent { placement }, PopoverTitle
 *
 *   <Popover>
 *     <Button variant="secondary">Filters</Button>
 *     <PopoverContent><PopoverTitle>Filters</PopoverTitle>…</PopoverContent>
 *   </Popover>
 *
 * Non-modal: focus moves in, Escape or clicking outside closes it, and focus
 * returns to the trigger. Give it a PopoverTitle or an aria-label.
 */

export function Popover(props: DialogTriggerProps) {
  return <DialogTrigger {...props} />;
}

/** Shared look for floating panels: Popover, DropdownMenu, Select and Combobox lists. */
export const floatingPanel = cn(
  "focus-ring rounded-md border border-border-default bg-surface-overlay text-text-default shadow-md",
  "transition-opacity duration-(--gw-motion-duration-fade) data-entering:opacity-0 data-exiting:opacity-0",
);

export type PopoverContentProps = Omit<PopoverPrimitiveProps, "className" | "style" | "children"> & {
  className?: string;
  /** Accessible name when there's no PopoverTitle. */
  "aria-label"?: string;
  children: DialogPrimitiveProps["children"];
};

export function PopoverContent({ className, children, offset = 8, "aria-label": ariaLabel, ...props }: PopoverContentProps) {
  return (
    <PopoverPrimitive data-slot="popover" offset={offset} className={cn(floatingPanel, "w-72 max-w-[calc(100vw-2rem)]")} {...props}>
      <OverlayArrow data-slot="popover-arrow" className="group">
        <svg
          aria-hidden
          width={12}
          height={12}
          viewBox="0 0 12 12"
          className="block fill-surface-overlay stroke-border-default group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90"
        >
          <path d="M0 0 L6 6 L12 0" />
        </svg>
      </OverlayArrow>
      <DialogPrimitive
        data-slot="popover-dialog"
        aria-label={ariaLabel}
        className={cn("focus-ring flex flex-col gap-3 p-4 text-body", className)}
      >
        {children}
      </DialogPrimitive>
    </PopoverPrimitive>
  );
}

export function PopoverTitle({ className, level = 2, ...props }: Omit<React.ComponentProps<typeof Heading>, "slot">) {
  return (
    <Heading
      slot="title"
      level={level}
      data-slot="popover-title"
      className={cn("text-md leading-heading font-semibold", className)}
      {...props}
    />
  );
}
