"use client";

import { cva } from "class-variance-authority";
import type * as React from "react";
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Button { variant: primary | secondary | ghost | destructive; size: sm | md | lg }
 */

export const buttonVariants = cva(
  [
    "focus-ring hit-area inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "rounded-md border border-transparent font-medium whitespace-nowrap select-none",
    "transition-colors duration-(--gw-motion-duration-fast)",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-action-primary-bg text-text-on-primary hover:bg-action-primary-bg-hover data-pressed:bg-action-primary-bg-hover",
        secondary:
          "border-border-input bg-action-secondary-bg text-text-default hover:bg-action-secondary-bg-hover data-pressed:bg-action-secondary-bg-hover",
        ghost: "bg-transparent text-text-default hover:bg-action-ghost-bg-hover data-pressed:bg-action-ghost-bg-hover",
        destructive:
          "bg-action-destructive-bg text-text-on-destructive hover:bg-action-destructive-bg-hover data-pressed:bg-action-destructive-bg-hover",
      },
      size: {
        sm: "h-8 px-3 text-sm [&_svg]:size-4",
        md: "h-10 px-4 text-md [&_svg]:size-4",
        lg: "h-11 px-6 text-lg [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonPrimitiveProps, "className" | "style"> &
  React.RefAttributes<HTMLButtonElement> & {
    /** Visual style. Defaults to primary. */
    variant?: ButtonVariant;
    /** Visual size. Every size keeps a hit area of at least 44 × 44px. Defaults to md. */
    size?: ButtonSize;
    className?: string;
  };

export function Button({ className, variant = "primary", size = "md", children, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {composeRenderProps(children, (c) => c)}
    </ButtonPrimitive>
  );
}
