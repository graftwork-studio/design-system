"use client";

import {
  Button as ButtonPrimitive,
  type ButtonProps,
  MenuTrigger,
  type MenuTriggerProps,
  Toolbar,
  type ToolbarProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSection, DropdownMenuSeparator, DropdownMenuSub } from "./dropdown-menu.js";

/*
 * Adapted from shadcn/ui's Menubar. Copyright (c) 2023 shadcn. MIT licence.
 * Built on React Aria, because shadcn's version needs Base UI.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Desktop-style menus like File, Edit and View. Arrow keys move between menus,
 * and Enter or Arrow Down opens one. Give the bar an aria-label.
 */

export type MenubarProps = Omit<ToolbarProps, "className" | "style"> & { className?: string };

export function Menubar({ className, ...props }: MenubarProps) {
  return (
    <Toolbar
      data-slot="menubar"
      className={cn("flex h-8 w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-lg border border-border-default bg-surface-default p-0.5", className)}
      {...props}
    />
  );
}

export function MenubarMenu(props: MenuTriggerProps) {
  return <MenuTrigger {...props} />;
}

export type MenubarTriggerProps = Omit<ButtonProps, "className" | "style"> & { className?: string };

export function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <ButtonPrimitive
      data-slot="menubar-trigger"
      className={cn(
        "flex h-6 shrink-0 cursor-pointer items-center rounded-sm px-2 text-sm font-medium text-text-default outline-none select-none",
        "hover:bg-action-ghost-bg-hover data-pressed:bg-action-secondary-bg-hover",
        "data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-solid data-focus-visible:outline-focus-ring",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export const MenubarContent = DropdownMenuContent;
export const MenubarItem = DropdownMenuItem;
export const MenubarSection = DropdownMenuSection;
export const MenubarSeparator = DropdownMenuSeparator;
export const MenubarSub = DropdownMenuSub;
