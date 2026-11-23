import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Bubble { variant: default | secondary | muted | tinted | outline | ghost | destructive; align: start | end },
 *                 BubbleGroup, BubbleContent, BubbleReactions { side: top | bottom; align: start | end }
 *
 * The text of a message. Use inside Message, or on its own.
 */

export function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="bubble-group" className={cn("flex min-w-0 flex-col gap-2", className)} {...props} />;
}

export type BubbleVariant = "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive";

const variants: Record<BubbleVariant, string> = {
  default: "*:data-[slot=bubble-content]:bg-action-primary-bg *:data-[slot=bubble-content]:text-text-on-primary",
  secondary: "*:data-[slot=bubble-content]:border-border-input *:data-[slot=bubble-content]:bg-action-secondary-bg *:data-[slot=bubble-content]:text-text-default",
  muted: "*:data-[slot=bubble-content]:bg-surface-subtle *:data-[slot=bubble-content]:text-text-default",
  tinted: "*:data-[slot=bubble-content]:border-border-status-info *:data-[slot=bubble-content]:bg-status-info-bg *:data-[slot=bubble-content]:text-text-default",
  outline: "*:data-[slot=bubble-content]:border-border-default *:data-[slot=bubble-content]:bg-surface-default *:data-[slot=bubble-content]:text-text-default",
  ghost: "max-w-full *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 *:data-[slot=bubble-content]:text-text-default",
  destructive: "*:data-[slot=bubble-content]:border-border-status-error *:data-[slot=bubble-content]:bg-status-error-bg *:data-[slot=bubble-content]:text-text-error",
};

export type BubbleProps = React.ComponentProps<"div"> & {
  /** Defaults to default. */
  variant?: BubbleVariant;
  /** Defaults to start. */
  align?: "start" | "end";
};

export function Bubble({ variant = "default", align = "start", className, ...props }: BubbleProps) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 data-[align=end]:self-end group-data-[align=end]/message:self-end",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function BubbleContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-content"
      className={cn(
        "w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-body leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end",
        className,
      )}
      {...props}
    />
  );
}

export type BubbleReactionsProps = React.ComponentProps<"div"> & {
  /** Defaults to end. */
  align?: "start" | "end";
  /** Defaults to bottom. */
  side?: "top" | "bottom";
};

export function BubbleReactions({ side = "bottom", align = "end", className, ...props }: BubbleReactionsProps) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(
        "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-border-default bg-surface-subtle px-1.5 py-0.5 text-sm text-text-default",
        side === "top" ? "top-0 -translate-y-3/4" : "bottom-0 translate-y-3/4",
        align === "start" ? "start-3" : "end-3",
        className,
      )}
      {...props}
    />
  );
}
