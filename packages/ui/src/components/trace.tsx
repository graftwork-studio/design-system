"use client";

import { ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import { Button as ButtonPrimitive, type ButtonProps } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Collapsible, CollapsibleContent, type CollapsibleContentProps, type CollapsibleProps } from "./collapsible.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Shows an assistant's steps: reasoning, tool calls and sources. Say the status
 * in the title ("Searching", "Search failed"), so colour is never the only cue.
 */

export function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="trace" className={cn("flex w-full min-w-0 flex-col gap-2", className)} {...props} />;
}

export type TraceLineProps = React.ComponentProps<"span"> & { status?: "running" | "error" | "pending" };

export function TraceLine({ className, status, ...props }: TraceLineProps) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn("flex w-fit max-w-full min-w-0 items-center gap-2 text-sm text-text-secondary data-[status=error]:text-text-error", className)}
      {...props}
    />
  );
}

export function TraceIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn("flex size-4 shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    />
  );
}

export function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="trace-title" className={cn("min-w-0 truncate", className)} {...props} />;
}

export function TraceDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="trace-description" className={cn("shrink-0 text-text-secondary tabular-nums", className)} {...props} />;
}

export function TraceCollapsible({ className, ...props }: CollapsibleProps) {
  return <Collapsible data-slot="trace-collapsible" className={cn("flex w-full min-w-0 flex-col gap-0", className)} {...props} />;
}

export type TraceCollapsibleTriggerProps = Omit<ButtonProps, "className" | "children" | "slot" | "style"> & {
  className?: string;
  children?: React.ReactNode;
};

export function TraceCollapsibleTrigger({ className, children, ...props }: TraceCollapsibleTriggerProps) {
  return (
    <ButtonPrimitive
      slot="trigger"
      data-slot="trace-collapsible-trigger"
      className={cn(
        "group/trace-trigger focus-ring hit-area flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-md text-left text-text-secondary transition-colors hover:text-text-default",
        className,
      )}
      {...props}
    >
      {children}
      <TraceIcon className="transition-transform group-aria-expanded/trace-trigger:rotate-90 motion-reduce:transition-none rtl:rotate-180">
        <ChevronRightIcon />
      </TraceIcon>
    </ButtonPrimitive>
  );
}

export function TraceCollapsibleContent({ className, children, ...props }: CollapsibleContentProps) {
  return (
    <CollapsibleContent data-slot="trace-collapsible-content" {...props}>
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn("ms-[calc(--spacing(2)-1px)] mt-2 mb-1 min-w-0 border-s border-border-default ps-4 pe-1 text-sm leading-relaxed wrap-break-word text-text-secondary", className)}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}
