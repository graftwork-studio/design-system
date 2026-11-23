"use client";

import * as React from "react";
import {
  composeRenderProps,
  ToggleButton as TogglePrimitive,
  ToggleButtonGroup as ToggleGroupPrimitive,
  type ToggleButtonGroupProps as ToggleGroupPrimitiveProps,
  type ToggleButtonProps as TogglePrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { type ToggleVariant, toggleVariants } from "./toggle.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * A set of toggles. Arrow keys move between them. Give the group an aria-label,
 * and give icon-only items an aria-label too.
 */

type ToggleSize = "sm" | "md" | "lg";
type Spacing = 0 | 1 | 2;

const ToggleGroupContext = React.createContext<{
  variant: ToggleVariant;
  size: ToggleSize;
  spacing: Spacing;
  orientation: "horizontal" | "vertical";
}>({ variant: "ghost", size: "md", spacing: 2, orientation: "horizontal" });

export type ToggleGroupProps = Omit<ToggleGroupPrimitiveProps, "className" | "style" | "children"> & {
  /** Visual style of every item. Defaults to ghost. */
  variant?: ToggleVariant;
  /** Size of every item. Defaults to md. */
  size?: ToggleSize;
  /** Gap between items. 0 joins them into one control. Defaults to 2. */
  spacing?: Spacing;
  className?: string;
  children: React.ReactNode;
};

const gaps: Record<Spacing, string> = { 0: "gap-0", 1: "gap-1", 2: "gap-2" };

export function ToggleGroup({
  className,
  variant = "ghost",
  size = "md",
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupProps) {
  const context = React.useMemo(() => ({ variant, size, spacing, orientation }), [variant, size, spacing, orientation]);
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      orientation={orientation}
      className={cn("flex w-fit", orientation === "vertical" ? "flex-col items-stretch" : "flex-row items-center", gaps[spacing], className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={context}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

export type ToggleGroupItemProps = Omit<TogglePrimitiveProps, "className" | "style"> & { className?: string };

export function ToggleGroupItem({ className, children, ...props }: ToggleGroupItemProps) {
  const { variant, size, spacing, orientation } = React.useContext(ToggleGroupContext);
  const joined =
    spacing === 0 &&
    (orientation === "horizontal"
      ? "rounded-none -ms-px first:ms-0 first:rounded-s-lg last:rounded-e-lg"
      : "rounded-none -mt-px first:mt-0 first:rounded-t-lg last:rounded-b-lg");
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size }), joined, "data-selected:z-1 data-focus-visible:z-10", className)}
      {...props}
    >
      {composeRenderProps(children, (c) => c)}
    </TogglePrimitive>
  );
}
