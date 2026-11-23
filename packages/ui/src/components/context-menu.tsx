"use client";

import type * as React from "react";
import { MenuTrigger, type MenuTriggerProps, Pressable } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator, DropdownMenuSub } from "./dropdown-menu.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Opens on right-click, long press, or the keyboard's menu key (Shift + F10).
 * Many people never discover these, so offer the same actions somewhere visible too.
 */

export type ContextMenuProps = Omit<MenuTriggerProps, "trigger">;

export function ContextMenu(props: ContextMenuProps) {
  return <MenuTrigger {...props} {...({ trigger: "contextMenu" } as unknown as Partial<MenuTriggerProps>)} />;
}

/** Its text names the control. Add an aria-label that includes that text if it has none. */
export type ContextMenuTriggerProps = React.ComponentProps<"div">;

/** The area that opens the menu. */
export function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return (
    <Pressable>
      <div
        role="button"
        tabIndex={0}
        data-slot="context-menu-trigger"
        className={cn("focus-ring rounded-lg select-none", className)}
        {...props}
      />
    </Pressable>
  );
}

export const ContextMenuContent = DropdownMenuContent;
export const ContextMenuItem = DropdownMenuItem;
export const ContextMenuSection = DropdownMenuSection;
export const ContextMenuSeparator = DropdownMenuSeparator;
export const ContextMenuSub = DropdownMenuSub;
