"use client";

import { XIcon } from "lucide-react";
import * as React from "react";
import {
  Button as ButtonPrimitive,
  Dialog as DialogPrimitive,
  type DialogProps as DialogPrimitiveProps,
  type DialogTriggerProps,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle, modalOverlay, useDialogDescription } from "./dialog.js";

/*
 * Adapted from shadcn/ui's Drawer. Copyright (c) 2023 shadcn. MIT licence.
 * Built on React Aria, because shadcn's version needs Base UI.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * A panel from the edge of the screen that can be dragged closed, mostly for
 * phones. Dragging is optional: the close button and Escape always work too.
 */

export function Drawer(props: DialogTriggerProps) {
  return <Dialog {...props} />;
}

export type DrawerSide = "bottom" | "top" | "left" | "right";

const sides: Record<DrawerSide, string> = {
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-xl border-t data-entering:translate-y-full data-exiting:translate-y-full",
  top: "inset-x-0 top-0 max-h-[85dvh] w-full rounded-b-xl border-b data-entering:-translate-y-full data-exiting:-translate-y-full",
  left: "inset-y-0 left-0 h-full w-3/4 rounded-e-xl border-e sm:max-w-sm data-entering:-translate-x-full data-exiting:-translate-x-full",
  right: "inset-y-0 right-0 h-full w-3/4 rounded-s-xl border-s sm:max-w-sm data-entering:translate-x-full data-exiting:translate-x-full",
};

// Which way counts as closing, as a sign on the drag axis.
const closing: Record<DrawerSide, { axis: "x" | "y"; sign: 1 | -1 }> = {
  bottom: { axis: "y", sign: 1 },
  top: { axis: "y", sign: -1 },
  left: { axis: "x", sign: -1 },
  right: { axis: "x", sign: 1 },
};

const CLOSE_FRACTION = 0.3;

export type DrawerContentProps = Omit<ModalOverlayProps, "className" | "style" | "children"> & {
  /** Which edge it comes from. Defaults to bottom. */
  side?: DrawerSide;
  /** Show a close button in the corner. Defaults to true. */
  showCloseButton?: boolean;
  className?: string;
  children: DialogPrimitiveProps["children"];
};

export function DrawerContent({ side = "bottom", showCloseButton = true, className, children, isDismissable = true, ...props }: DrawerContentProps) {
  const description = useDialogDescription();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const start = React.useRef<number | null>(null);
  const [distance, setDistance] = React.useState(0);
  const { axis, sign } = closing[side];

  const position = (event: React.PointerEvent) => (axis === "y" ? event.clientY : event.clientX);
  const transform = distance > 0 ? (axis === "y" ? `translateY(${sign * distance}px)` : `translateX(${sign * distance}px)`) : undefined;

  return (
    <ModalOverlay data-slot="drawer-overlay" isDismissable={isDismissable} className={cn(modalOverlay, "block p-0")} {...props}>
      <Modal
        ref={panelRef}
        data-slot="drawer"
        data-side={side}
        style={{ transform }}
        className={cn(
          "fixed overflow-y-auto border-border-default bg-surface-overlay text-body text-text-default shadow-lg",
          distance === 0 && "transition-transform duration-(--gw-motion-duration-normal) motion-reduce:transition-none",
          sides[side],
        )}
      >
        <DialogPrimitive
          data-slot="drawer-dialog"
          aria-describedby={description.descriptionId}
          className={cn("focus-ring relative flex min-h-full flex-col gap-4 p-4", className)}
        >
          {(renderProps) => (
            <description.Provider value={description.setDescriptionId}>
              {/* Pointer-only: Escape and the close button are the keyboard and screen reader routes. */}
              <div
                aria-hidden
                data-slot="drawer-handle"
                className={cn(
                  "flex shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing",
                  axis === "y" ? "-mt-2 h-6 w-full" : "absolute inset-y-0 w-6",
                  side === "left" && "end-0",
                  side === "right" && "start-0",
                  side === "top" && "order-last -mt-2 -mb-2",
                )}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  start.current = position(event);
                }}
                onPointerMove={(event) => {
                  if (start.current !== null) setDistance(Math.max(0, (position(event) - start.current) * sign));
                }}
                onPointerUp={() => {
                  const size = axis === "y" ? panelRef.current?.offsetHeight : panelRef.current?.offsetWidth;
                  const shouldClose = distance > (size ?? 0) * CLOSE_FRACTION;
                  start.current = null;
                  setDistance(0);
                  if (shouldClose) renderProps.close();
                }}
                onPointerCancel={() => {
                  start.current = null;
                  setDistance(0);
                }}
              >
                <span className={cn("rounded-full bg-border-input", axis === "y" ? "h-1 w-10" : "h-10 w-1")} />
              </div>
              {typeof children === "function" ? children(renderProps) : children}
              {showCloseButton ? (
                <ButtonPrimitive
                  slot="close"
                  aria-label="Close"
                  data-slot="drawer-close"
                  className="focus-ring hit-area absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-md text-icon-default hover:bg-action-ghost-bg-hover"
                >
                  <XIcon aria-hidden className="size-4" />
                </ButtonPrimitive>
              ) : null}
            </description.Provider>
          )}
        </DialogPrimitive>
      </Modal>
    </ModalOverlay>
  );
}

export const DrawerHeader = DialogHeader;
export const DrawerTitle = DialogTitle;
export const DrawerDescription = DialogDescription;
export const DrawerBody = DialogBody;

/** Sits at the bottom of the drawer. */
export function DrawerFooter({ className, ...props }: React.ComponentProps<typeof DialogFooter>) {
  return <DialogFooter className={cn("mt-auto", className)} {...props} />;
}
