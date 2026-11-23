import * as React from "react";
import { cn } from "../lib/utils.js";
import { Button, type ButtonProps } from "./button.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * A file in a message or composer. Say the state in AttachmentDescription
 * ("Uploading, 40%", "Upload failed"), so colour is never the only cue.
 */

const sizes = {
  md: "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
  sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
  xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
} as const;

export type AttachmentProps = React.ComponentProps<"div"> & {
  /** Defaults to done. */
  state?: "idle" | "uploading" | "processing" | "error" | "done";
  /** Defaults to md. */
  size?: keyof typeof sizes;
  /** Defaults to horizontal. */
  orientation?: "horizontal" | "vertical";
};

export function Attachment({ className, state = "done", size = "md", orientation = "horizontal", ...props }: AttachmentProps) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(
        "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border border-border-default bg-surface-raised text-text-default transition-colors",
        "has-[>button]:hover:bg-action-ghost-bg-hover data-[state=error]:border-border-status-error data-[state=idle]:border-dashed",
        sizes[size],
        orientation === "horizontal" ? "min-w-40 items-center" : "w-24 flex-col has-data-[slot=attachment-content]:w-30",
        className,
      )}
      {...props}
    />
  );
}

export type AttachmentMediaProps = React.ComponentProps<"div"> & {
  /** Defaults to icon. */
  variant?: "icon" | "image";
};

export function AttachmentMedia({ className, variant = "icon", ...props }: AttachmentMediaProps) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-subtle text-text-default",
        "group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md",
        "group-data-[state=error]/attachment:bg-status-error-bg group-data-[state=error]/attachment:text-text-error",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
        variant === "image" && "*:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn("max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1", className)}
      {...props}
    />
  );
}

export function AttachmentTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="attachment-title" className={cn("block max-w-full min-w-0 truncate font-medium", className)} {...props} />;
}

export function AttachmentDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn("mt-0.5 block max-w-full min-w-0 truncate text-xs text-text-secondary group-data-[state=error]/attachment:text-text-error", className)}
      {...props}
    />
  );
}

export function AttachmentActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        className,
      )}
      {...props}
    />
  );
}

/** A small icon button. Needs an aria-label that names the file, like "Remove report.pdf". */
export function AttachmentAction({ className, variant = "ghost", size = "sm", ...props }: ButtonProps) {
  return <Button data-slot="attachment-action" variant={variant} size={size} className={cn("size-6 px-0", className)} {...props} />;
}

/** Makes the whole attachment clickable. Needs an aria-label, like "Open report.pdf". */
export function AttachmentTrigger({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return <button type={type} data-slot="attachment-trigger" className={cn("focus-ring absolute inset-0 z-10 cursor-pointer rounded-[inherit]", className)} {...props} />;
}

/** A row of attachments that scrolls sideways when it runs out of room. */
export function AttachmentGroup({ className, children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 list-none snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto overscroll-x-contain p-1 [scrollbar-width:thin]",
        className,
      )}
      {...props}
    >
      {React.Children.toArray(children).map((child, index) => (
        <li key={React.isValidElement(child) && child.key != null ? child.key : index} className="flex-none snap-start">
          {child}
        </li>
      ))}
    </ul>
  );
}
