"use client";

import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Panels people can resize by dragging, or with the arrow keys on a focused handle.
 */

export type ResizablePanelGroupProps = ResizablePrimitive.GroupProps;

export function ResizablePanelGroup({ className, ...props }: ResizablePanelGroupProps) {
  return <ResizablePrimitive.Group data-slot="resizable-panel-group" className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)} {...props} />;
}

export type ResizablePanelProps = ResizablePrimitive.PanelProps;

export function ResizablePanel(props: ResizablePanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

export type ResizableHandleProps = ResizablePrimitive.SeparatorProps & {
  /** Show a visible grip. */
  withHandle?: boolean;
};

export function ResizableHandle({ withHandle, className, "aria-label": ariaLabel = "Resize panels", ...props }: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      aria-label={ariaLabel}
      className={cn(
        "focus-ring relative flex w-px shrink-0 items-center justify-center bg-border-input",
        // A 24px target around the 1px line (WCAG 2.5.8).
        "after:absolute after:inset-y-0 after:left-1/2 after:w-6 after:-translate-x-1/2",
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-6 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle ? <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border-input" /> : null}
    </ResizablePrimitive.Separator>
  );
}
