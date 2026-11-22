"use client";

import { cva } from "class-variance-authority";
import {
  composeRenderProps,
  ToggleButton as TogglePrimitive,
  type ToggleButtonProps as TogglePrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Toggle { variant: ghost | secondary; size: sm | md | lg; isSelected; isDisabled }
 *
 * A button that stays pressed, like Bold in a text editor. Give icon-only
 * toggles an aria-label.
 */

export const toggleVariants = cva(
  [
    "focus-ring hit-area inline-flex shrink-0 cursor-pointer items-center justify-center gap-1",
    "rounded-lg border border-transparent font-medium whitespace-nowrap text-text-default select-none",
    "transition-colors duration-(--gw-motion-duration-fast)",
    "hover:bg-action-ghost-bg-hover data-selected:bg-action-secondary-bg-hover data-selected:border-border-input",
    "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        ghost: "bg-transparent",
        secondary: "border-border-input bg-action-secondary-bg",
      },
      size: {
        sm: "h-7 min-w-7 rounded-md px-2.5 text-[0.8rem] [&_svg]:size-3.5",
        md: "h-8 min-w-8 px-2.5 text-body [&_svg]:size-4",
        lg: "h-9 min-w-9 px-2.5 text-body [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

export type ToggleVariant = "ghost" | "secondary";

export type ToggleProps = Omit<TogglePrimitiveProps, "className" | "style"> & {
  /** Visual style. Defaults to ghost. */
  variant?: ToggleVariant;
  /** Visual size: 28, 32 or 36px tall. Defaults to md. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Toggle({ className, variant = "ghost", size = "md", children, ...props }: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    >
      {composeRenderProps(children, (c) => c)}
    </TogglePrimitive>
  );
}
