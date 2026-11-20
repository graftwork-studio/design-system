import type * as React from "react";
import { Keyboard } from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Kbd { children }
 *
 * A key or shortcut, like ⌘K. Spell out keys where symbols are unclear
 * ("Ctrl", "Enter"), and say what the shortcut does in the text around it.
 */

export type KbdProps = React.ComponentProps<typeof Keyboard>;

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <Keyboard
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border-input bg-surface-subtle px-1 font-sans text-sm font-medium text-text-default",
        className,
      )}
      {...props}
    />
  );
}
