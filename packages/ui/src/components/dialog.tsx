"use client";

import { XIcon } from "lucide-react";
import * as React from "react";
import {
  Button as ButtonPrimitive,
  Dialog as DialogPrimitive,
  type DialogProps as DialogPrimitiveProps,
  DialogTrigger,
  type DialogTriggerProps,
  Heading,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Dialog, DialogContent { size: sm | md | lg; showCloseButton }, DialogHeader,
 *                 DialogTitle, DialogDescription, DialogBody, DialogFooter
 *
 *   <Dialog>
 *     <Button>Rename</Button>
 *     <DialogContent>
 *       <DialogHeader><DialogTitle>Rename project</DialogTitle></DialogHeader>
 *       …
 *       <DialogFooter><Button slot="close" variant="secondary">Cancel</Button>…</DialogFooter>
 *     </DialogContent>
 *   </Dialog>
 *
 * Focus moves into the dialog, stays there, and returns to the trigger on close.
 */

/** Wraps the trigger (any Button) and the DialogContent. Control it with isOpen and onOpenChange. */
export function Dialog(props: DialogTriggerProps) {
  return <DialogTrigger {...props} />;
}

/** The dimmed layer behind a modal. Shared by Dialog, AlertDialog and Sheet. */
export const modalOverlay = cn(
  "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-center bg-overlay-scrim/60 p-4",
  "transition-opacity duration-(--gw-motion-duration-fade) data-entering:opacity-0 data-exiting:opacity-0",
);

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

export type DialogContentProps = Omit<ModalOverlayProps, "className" | "style" | "children"> & {
  /** Maximum width. Defaults to md. */
  size?: keyof typeof sizes;
  /** Show a close button in the corner. Defaults to true. */
  showCloseButton?: boolean;
  /** Use role="alertdialog". Set by AlertDialogContent. */
  role?: DialogPrimitiveProps["role"];
  className?: string;
  children: DialogPrimitiveProps["children"];
};

/*
 * React Aria names the dialog from its title but doesn't link a description, so
 * DialogDescription registers its id here and DialogContent sets aria-describedby.
 */
const DescriptionContext = React.createContext<((id: string | undefined) => void) | null>(null);

export function DialogContent({
  size = "md",
  showCloseButton = true,
  role,
  className,
  children,
  isDismissable = true,
  ...props
}: DialogContentProps) {
  const [descriptionId, setDescriptionId] = React.useState<string>();
  return (
    <ModalOverlay data-slot="dialog-overlay" isDismissable={isDismissable} className={modalOverlay} {...props}>
      <Modal
        data-slot="dialog-modal"
        className={cn(
          "w-full rounded-xl border border-border-default bg-surface-overlay text-body text-text-default shadow-lg",
          "max-h-[calc(100dvh-2rem)] overflow-y-auto",
          sizes[size],
        )}
      >
        <DialogPrimitive
          data-slot="dialog"
          role={role}
          aria-describedby={descriptionId}
          className={cn("focus-ring relative flex flex-col gap-4 p-4", className)}
        >
          {(renderProps) => (
            <DescriptionContext.Provider value={setDescriptionId}>
              {typeof children === "function" ? children(renderProps) : children}
              {showCloseButton ? (
                <ButtonPrimitive
                  slot="close"
                  aria-label="Close"
                  data-slot="dialog-close"
                  className="focus-ring hit-area absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-md text-icon-default hover:bg-action-ghost-bg-hover"
                >
                  <XIcon aria-hidden className="size-4" />
                </ButtonPrimitive>
              ) : null}
            </DescriptionContext.Provider>
          )}
        </DialogPrimitive>
      </Modal>
    </ModalOverlay>
  );
}

/** Lets DialogDescription register itself as the dialog's description. Used by Sheet too. */
export function useDialogDescription() {
  const [descriptionId, setDescriptionId] = React.useState<string>();
  return { descriptionId, Provider: DescriptionContext.Provider, setDescriptionId };
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1 pe-8", className)} {...props} />;
}

export type DialogTitleProps = Omit<React.ComponentProps<typeof Heading>, "slot">;

/** The dialog's accessible name. Every dialog needs one. */
export function DialogTitle({ className, level = 2, ...props }: DialogTitleProps) {
  return (
    <Heading
      slot="title"
      level={level}
      data-slot="dialog-title"
      className={cn("text-md leading-none font-medium text-text-default", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, id, ...props }: React.ComponentProps<"p">) {
  const generated = React.useId();
  const descriptionId = id ?? generated;
  const register = React.useContext(DescriptionContext);
  React.useLayoutEffect(() => {
    register?.(descriptionId);
    return () => register?.(undefined);
  }, [register, descriptionId]);
  return (
    <p data-slot="dialog-description" id={descriptionId} className={cn("text-sm text-text-secondary", className)} {...props} />
  );
}

export function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}
