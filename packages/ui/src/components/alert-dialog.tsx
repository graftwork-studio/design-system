"use client";

import type * as React from "react";
import type { DialogTriggerProps } from "react-aria-components";
import {
  Dialog,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogTitleProps,
} from "./dialog.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: AlertDialog, AlertDialogContent { size: sm | md | lg }, AlertDialogHeader,
 *                 AlertDialogTitle, AlertDialogDescription, AlertDialogFooter
 *
 * For a decision the user must make, like confirming a deletion. It uses
 * role="alertdialog", can't be dismissed by clicking outside, and has no close
 * button: the footer's buttons are the only way out (Escape still cancels).
 * Put a Button with slot="close" in the footer for Cancel.
 */

export function AlertDialog(props: DialogTriggerProps) {
  return <Dialog {...props} />;
}

export type AlertDialogContentProps = Omit<DialogContentProps, "role" | "showCloseButton" | "isDismissable">;

export function AlertDialogContent({ size = "sm", ...props }: AlertDialogContentProps) {
  return <DialogContent role="alertdialog" size={size} showCloseButton={false} isDismissable={false} {...props} />;
}

export function AlertDialogHeader(props: React.ComponentProps<typeof DialogHeader>) {
  return <DialogHeader data-slot="alert-dialog-header" className="pe-0" {...props} />;
}

export function AlertDialogTitle(props: DialogTitleProps) {
  return <DialogTitle data-slot="alert-dialog-title" {...props} />;
}

export function AlertDialogDescription(props: React.ComponentProps<typeof DialogDescription>) {
  return <DialogDescription data-slot="alert-dialog-description" {...props} />;
}

export function AlertDialogFooter(props: React.ComponentProps<typeof DialogFooter>) {
  return <DialogFooter data-slot="alert-dialog-footer" {...props} />;
}
