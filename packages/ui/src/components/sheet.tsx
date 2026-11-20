"use client";

import { XIcon } from "lucide-react";
import type * as React from "react";
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
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  modalOverlay,
  useDialogDescription,
} from "./dialog.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Sheet, SheetContent { side: right | left | top | bottom; showCloseButton }, SheetHeader,
 *                 SheetTitle, SheetDescription, SheetBody, SheetFooter
 *
 * A dialog that slides in from the edge of the screen, for longer tasks like
 * filters or editing a record. Same structure and focus handling as Dialog.
 */

export function Sheet(props: DialogTriggerProps) {
  return <Dialog {...props} />;
}

export type SheetSide = "right" | "left" | "top" | "bottom";

const sides: Record<SheetSide, string> = {
  right: "inset-y-0 right-0 h-full w-full max-w-md border-l data-entering:translate-x-full data-exiting:translate-x-full",
  left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-entering:-translate-x-full data-exiting:-translate-x-full",
  top: "inset-x-0 top-0 max-h-[80dvh] w-full border-b data-entering:-translate-y-full data-exiting:-translate-y-full",
  bottom: "inset-x-0 bottom-0 max-h-[80dvh] w-full border-t data-entering:translate-y-full data-exiting:translate-y-full",
};

export type SheetContentProps = Omit<ModalOverlayProps, "className" | "style" | "children"> & {
  /** Which edge it slides in from. Defaults to right. */
  side?: SheetSide;
  /** Show a close button in the corner. Defaults to true. */
  showCloseButton?: boolean;
  className?: string;
  children: DialogPrimitiveProps["children"];
};

export function SheetContent({
  side = "right",
  showCloseButton = true,
  className,
  children,
  isDismissable = true,
  ...props
}: SheetContentProps) {
  const description = useDialogDescription();
  return (
    <ModalOverlay
      data-slot="sheet-overlay"
      isDismissable={isDismissable}
      className={cn(modalOverlay, "block p-0")}
      {...props}
    >
      <Modal
        data-slot="sheet"
        data-side={side}
        className={cn(
          "fixed overflow-y-auto border-border-default bg-surface-overlay text-body text-text-default shadow-lg",
          // Slides under normal motion; under reduced motion the global rule leaves only the overlay's fade.
          "transition-transform duration-(--gw-motion-duration-normal) motion-reduce:transition-none",
          sides[side],
        )}
      >
        <DialogPrimitive
          data-slot="sheet-dialog"
          aria-describedby={description.descriptionId}
          className={cn("focus-ring relative flex min-h-full flex-col gap-4 p-6", className)}>
          {(renderProps) => (
            <description.Provider value={description.setDescriptionId}>
              {typeof children === "function" ? children(renderProps) : children}
              {showCloseButton ? (
                <ButtonPrimitive
                  slot="close"
                  aria-label="Close"
                  data-slot="sheet-close"
                  className="focus-ring hit-area absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-md text-icon-default hover:bg-action-ghost-bg-hover"
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

export const SheetHeader = DialogHeader;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
export const SheetBody = DialogBody;

/** Sits at the bottom of the sheet. */
export function SheetFooter({ className, ...props }: React.ComponentProps<typeof DialogFooter>) {
  return <DialogFooter className={cn("mt-auto", className)} {...props} />;
}
