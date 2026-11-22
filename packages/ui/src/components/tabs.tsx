"use client";

import {
  Tab as TabPrimitive,
  TabList as TabListPrimitive,
  type TabListProps as TabListPrimitiveProps,
  TabPanel as TabPanelPrimitive,
  type TabPanelProps as TabPanelPrimitiveProps,
  type TabProps as TabPrimitiveProps,
  Tabs as TabsPrimitive,
  type TabsProps as TabsPrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Tabs { orientation: horizontal | vertical }, TabList { aria-label }, Tab { id; isDisabled }, TabPanel { id }
 *
 * Arrow keys move between tabs, Tab moves into the panel. The selected tab is
 * marked with a bar as well as colour.
 */

export type TabsProps = Omit<TabsPrimitiveProps, "className" | "style"> & { className?: string };

export function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive
      data-slot="tabs"
      className={cn("flex gap-4 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row", className)}
      {...props}
    />
  );
}

export type TabListProps<T extends object> = Omit<TabListPrimitiveProps<T>, "className" | "style"> & { className?: string };

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return (
    <TabListPrimitive
      data-slot="tab-list"
      className={cn(
        "group/tablist flex data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:border-b data-[orientation=horizontal]:border-border-default",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-e data-[orientation=vertical]:border-border-default",
        className,
      )}
      {...props}
    />
  );
}

export type TabProps = Omit<TabPrimitiveProps, "className" | "style"> & { className?: string };

export function Tab({ className, ...props }: TabProps) {
  return (
    <TabPrimitive
      data-slot="tab"
      className={cn(
        "relative flex h-8 cursor-pointer items-center gap-1.5 px-2 text-body font-medium whitespace-nowrap text-text-secondary outline-none",
        "hover:text-text-default data-selected:text-text-default",
        "data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        // The selected bar: a shape cue, not only colour.
        "after:absolute after:bg-transparent data-selected:after:bg-action-primary-bg",
        "group-data-[orientation=horizontal]/tablist:after:inset-x-0 group-data-[orientation=horizontal]/tablist:after:-bottom-px group-data-[orientation=horizontal]/tablist:after:h-0.5",
        "group-data-[orientation=vertical]/tablist:after:inset-y-0 group-data-[orientation=vertical]/tablist:after:-end-px group-data-[orientation=vertical]/tablist:after:w-0.5",
        className,
      )}
      {...props}
    />
  );
}

export type TabPanelProps = Omit<TabPanelPrimitiveProps, "className" | "style"> & { className?: string };

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <TabPanelPrimitive data-slot="tab-panel" className={cn("focus-ring flex-1 rounded-md text-body", className)} {...props} />;
}
