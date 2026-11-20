"use client";

import type * as React from "react";
import {
  Button as ButtonPrimitive,
  type ButtonProps,
  Disclosure,
  DisclosurePanel,
  type DisclosurePanelProps,
  type DisclosureProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Collapsible { isExpanded; isDisabled }, CollapsibleTrigger, CollapsibleContent
 *
 * One section that shows and hides. For a set of them, use Accordion.
 * CollapsibleTrigger is unstyled: pass a Button-style className, or put your
 * own content inside.
 */

export type CollapsibleProps = Omit<DisclosureProps, "className" | "style"> & { className?: string };

export function Collapsible({ className, ...props }: CollapsibleProps) {
  return <Disclosure data-slot="collapsible" className={cn("group/collapsible flex flex-col gap-2", className)} {...props} />;
}

export type CollapsibleTriggerProps = Omit<ButtonProps, "slot" | "style" | "className"> & { className?: string };

export function CollapsibleTrigger({ className, ...props }: CollapsibleTriggerProps) {
  return (
    <ButtonPrimitive
      slot="trigger"
      data-slot="collapsible-trigger"
      className={cn("focus-ring hit-area inline-flex cursor-pointer items-center gap-2 rounded-md", className)}
      {...props}
    />
  );
}

export type CollapsibleContentProps = Omit<DisclosurePanelProps, "className" | "style"> & {
  className?: string;
  children?: React.ReactNode;
};

export function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
  return <DisclosurePanel data-slot="collapsible-content" className={className} {...props} />;
}
