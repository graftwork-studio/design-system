"use client";

import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import {
  Button as ButtonPrimitive,
  Disclosure,
  DisclosureGroup,
  type DisclosureGroupProps,
  DisclosurePanel,
  type DisclosurePanelProps,
  type DisclosureProps,
  Heading,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Accordion { allowsMultipleExpanded }, AccordionItem { id; isDisabled },
 *                 AccordionTrigger { level }, AccordionContent
 *
 * A stack of sections that open and close. Each trigger is a heading with a
 * button inside, so the sections show up in the page outline.
 */

export type AccordionProps = Omit<DisclosureGroupProps, "className" | "style"> & { className?: string };

export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <DisclosureGroup
      data-slot="accordion"
      className={cn("flex w-full flex-col divide-y divide-border-default border-y border-border-default", className)}
      {...props}
    />
  );
}

export type AccordionItemProps = Omit<DisclosureProps, "className" | "style"> & { className?: string };

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <Disclosure data-slot="accordion-item" className={cn("group/accordion", className)} {...props} />;
}

export type AccordionTriggerProps = {
  children: React.ReactNode;
  /** Heading level, so the sections fit the page outline. Defaults to 3. */
  level?: 2 | 3 | 4 | 5 | 6;
  className?: string;
};

export function AccordionTrigger({ children, level = 3, className }: AccordionTriggerProps) {
  return (
    <Heading level={level} className="flex">
      <ButtonPrimitive
        slot="trigger"
        data-slot="accordion-trigger"
        className={cn(
          "focus-ring flex flex-1 cursor-pointer items-center justify-between gap-4 py-2.5 text-start text-body font-medium text-text-default",
          "hover:underline data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className,
        )}
      >
        {children}
        <ChevronDownIcon
          aria-hidden
          className="size-4 shrink-0 text-icon-default transition-transform duration-(--gw-motion-duration-fast) group-data-expanded/accordion:rotate-180"
        />
      </ButtonPrimitive>
    </Heading>
  );
}

export type AccordionContentProps = Omit<DisclosurePanelProps, "className" | "style"> & { className?: string };

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  return (
    <DisclosurePanel data-slot="accordion-content" {...props}>
      <div className={cn("pb-2.5 text-body text-text-default", className)}>{children}</div>
    </DisclosurePanel>
  );
}
