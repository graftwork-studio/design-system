"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import {
  composeRenderProps,
  Header,
  Keyboard,
  Menu,
  MenuItem,
  type MenuItemProps,
  type MenuProps,
  MenuSection,
  type MenuSectionProps,
  MenuTrigger,
  type MenuTriggerProps,
  Popover as PopoverPrimitive,
  type PopoverProps,
  Separator,
  SubmenuTrigger,
  type SubmenuTriggerProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { floatingPanel } from "./popover.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: DropdownMenu, DropdownMenuContent { placement; selectionMode: none | single | multiple },
 *                 DropdownMenuItem { variant: default | destructive; shortcut; isDisabled },
 *                 DropdownMenuSection { title }, DropdownMenuSeparator, DropdownMenuSub
 *
 *   <DropdownMenu>
 *     <Button variant="secondary">Actions</Button>
 *     <DropdownMenuContent aria-label="Actions" onAction={…}>
 *       <DropdownMenuItem id="rename">Rename</DropdownMenuItem>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 *
 * Arrow keys move, Enter chooses, typing jumps to an item, Escape closes and
 * returns focus to the trigger.
 */

export function DropdownMenu(props: MenuTriggerProps) {
  return <MenuTrigger {...props} />;
}

export type DropdownMenuContentProps<T extends object> = Omit<MenuProps<T>, "className" | "style"> & {
  placement?: PopoverProps["placement"];
  className?: string;
};

export function DropdownMenuContent<T extends object>({
  placement = "bottom start",
  className,
  ...props
}: DropdownMenuContentProps<T>) {
  return (
    <PopoverPrimitive data-slot="dropdown-menu-popover" placement={placement} offset={4} className={cn(floatingPanel, "min-w-32")}>
      <Menu data-slot="dropdown-menu" className={cn("focus-ring max-h-[inherit] overflow-auto p-1", className)} {...props} />
    </PopoverPrimitive>
  );
}

const item = [
  "group/item flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-body text-text-default outline-none",
  "data-focused:bg-action-ghost-bg-hover",
  "data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-icon-default",
].join(" ");

export type DropdownMenuItemProps<T extends object> = Omit<MenuItemProps<T>, "className" | "style"> & {
  /** destructive colours the label, for actions like Delete. Defaults to default. */
  variant?: "default" | "destructive";
  /** Keyboard shortcut shown on the right, e.g. "⌘D". It's a hint; wire the shortcut up yourself. */
  shortcut?: string;
  className?: string;
};

export function DropdownMenuItem<T extends object>({
  variant = "default",
  shortcut,
  className,
  children,
  ...props
}: DropdownMenuItemProps<T>) {
  return (
    <MenuItem
      data-slot="dropdown-menu-item"
      data-variant={variant}
      textValue={typeof children === "string" ? children : props.textValue}
      className={cn(item, variant === "destructive" && "text-text-error [&_svg]:text-text-error", className)}
      {...props}
    >
      {composeRenderProps(children, (content, { selectionMode, isSelected, hasSubmenu }) => (
        <>
          {selectionMode !== "none" ? (
            <span className="flex size-4 shrink-0 items-center justify-center">
              {isSelected ? <CheckIcon aria-hidden /> : null}
            </span>
          ) : null}
          <span className="flex flex-1 items-center gap-2 truncate">{content}</span>
          {shortcut ? (
            <Keyboard data-slot="dropdown-menu-shortcut" className="ms-auto ps-4 font-sans text-sm text-text-secondary">
              {shortcut}
            </Keyboard>
          ) : null}
          {hasSubmenu ? <ChevronRightIcon aria-hidden className="ms-auto" /> : null}
        </>
      ))}
    </MenuItem>
  );
}

export type DropdownMenuSectionProps<T extends object> = Omit<MenuSectionProps<T>, "className" | "style"> & {
  /** Visible heading for the group. */
  title?: string;
  className?: string;
};

export function DropdownMenuSection<T extends object>({ title, className, children, ...props }: DropdownMenuSectionProps<T>) {
  return (
    <MenuSection data-slot="dropdown-menu-section" className={className} {...props}>
      {title ? <Header className="px-1.5 py-1 text-sm font-semibold text-text-secondary">{title}</Header> : null}
      {children as React.ReactNode}
    </MenuSection>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px border-0 bg-border-default", className)} />;
}

/** A nested menu: a DropdownMenuItem followed by a DropdownMenuContent. */
export function DropdownMenuSub(props: SubmenuTriggerProps) {
  return <SubmenuTrigger {...props} />;
}
