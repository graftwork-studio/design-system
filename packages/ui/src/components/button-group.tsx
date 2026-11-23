import type * as React from "react";
import { cn } from "../lib/utils.js";
import { Separator, type SeparatorProps } from "./separator.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Joins related buttons into one control. Give the group an aria-label. For
 * buttons that stay pressed, use ToggleGroup.
 */

const orientations = {
  horizontal:
    "flex-row [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none [&>*:not(:first-child):not([data-slot=button-group-separator])]:-ms-px",
  vertical:
    "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child):not([data-slot=button-group-separator])]:-mt-px",
} as const;

export type ButtonGroupProps = React.ComponentProps<"div"> & {
  /** Defaults to horizontal. */
  orientation?: keyof typeof orientations;
};

export function ButtonGroup({ className, orientation = "horizontal", ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn("flex w-fit items-stretch [&>*:focus-visible]:z-10", orientations[orientation], className)}
      {...props}
    />
  );
}

/** Text attached to the group, such as a unit or a prefix. */
export function ButtonGroupText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border-input bg-surface-subtle px-2.5 text-sm font-medium text-text-default [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/** A divider between buttons that have no border of their own, such as primary buttons. */
export function ButtonGroupSeparator({ className, orientation = "vertical", ...props }: SeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn("relative z-1 self-stretch bg-border-input", orientation === "vertical" ? "h-auto w-px" : "h-px w-auto", className)}
      {...props}
    />
  );
}
