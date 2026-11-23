import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * One turn in a conversation. Put the sender's name in MessageHeader, or in
 * visually hidden text: alignment alone doesn't tell a screen reader who spoke.
 */

export function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-group" className={cn("flex min-w-0 flex-col gap-2", className)} {...props} />;
}

export type MessageProps = React.ComponentProps<"div"> & {
  /** End puts it on the opposite side, usually for the current user. Defaults to start. */
  align?: "start" | "end";
};

export function Message({ className, align = "start", ...props }: MessageProps) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn("group/message relative flex w-full min-w-0 gap-2 text-body data-[align=end]:flex-row-reverse", className)}
      {...props}
    />
  );
}

export function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-avatar" className={cn("flex w-fit shrink-0 items-start justify-center overflow-hidden rounded-full", className)} {...props} />;
}

export function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn("flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:items-end", className)}
      {...props}
    />
  );
}

const meta = "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-text-secondary group-has-data-[variant=ghost]/message:px-0";

export function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-header" className={cn(meta, className)} {...props} />;
}

export function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-footer" className={cn(meta, "group-data-[align=end]/message:justify-end", className)} {...props} />;
}
