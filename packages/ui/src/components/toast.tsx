"use client";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import type * as React from "react";
import {
  Button as ButtonPrimitive,
  Text,
  UNSTABLE_Toast as ToastPrimitive,
  UNSTABLE_ToastContent as ToastContentPrimitive,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Built on React Aria's Toast rather than shadcn's Sonner, so it needs no extra
 * dependency or theme provider. React Aria still marks this API UNSTABLE_;
 * react-aria-components is pinned, so a change shows up as a failing update.
 *
 * Figma contract: Toast { variant: info | success | warning | error; title; description }
 *
 * Render <Toaster /> once, near the root of the app, then call
 * toast({ title: "Saved" }) from anywhere. Toasts are announced to screen
 * readers, sit in a landmark you can reach with F6, and pause while hovered or
 * focused. Errors stay until dismissed; the rest go after 8 seconds. Don't put
 * the only way to do something in a toast.
 */

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastContent = {
  title: string;
  description?: string;
  /** Sets the icon. Defaults to info. */
  variant?: ToastVariant;
};

/** The app-wide queue <Toaster /> shows. */
export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 3 });

/**
 * Shows a toast. Returns its key, for toastQueue.close(key).
 * timeout is in milliseconds; errors default to staying until dismissed.
 */
export function toast(content: ToastContent, options: { timeout?: number } = {}) {
  const timeout = options.timeout ?? (content.variant === "error" ? undefined : 8000);
  return toastQueue.add(content, { timeout });
}

const icons: Record<ToastVariant, { icon: React.ElementType; className: string }> = {
  info: { icon: InfoIcon, className: "text-text-info" },
  success: { icon: CircleCheckIcon, className: "text-text-success" },
  warning: { icon: TriangleAlertIcon, className: "text-text-warning" },
  error: { icon: CircleAlertIcon, className: "text-text-error" },
};

export type ToasterProps = {
  /** Names the landmark. Defaults to "Notifications". */
  "aria-label"?: string;
  className?: string;
};

export function Toaster({ "aria-label": label = "Notifications", className }: ToasterProps) {
  return (
    <ToastRegion
      queue={toastQueue}
      aria-label={label}
      data-slot="toaster"
      className={cn(
        "fixed end-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col-reverse gap-2 outline-none",
        "data-focus-visible:focus-ring-drawn rounded-lg",
        className,
      )}
    >
      {({ toast: item }) => {
        const variant = item.content.variant ?? "info";
        const { icon: Icon, className: iconClass } = icons[variant];
        return (
          <ToastPrimitive
            toast={item}
            data-slot="toast"
            data-variant={variant}
            className={cn(
              "flex items-start gap-3 rounded-md border border-border-default bg-surface-overlay p-4 text-body text-text-default shadow-lg outline-none",
              "data-focus-visible:focus-ring-drawn",
            )}
          >
            <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconClass)} />
            <ToastContentPrimitive className="flex min-w-0 flex-1 flex-col gap-1">
              <Text slot="title" className="font-semibold">
                {item.content.title}
              </Text>
              {item.content.description ? (
                <Text slot="description" className="text-text-secondary">
                  {item.content.description}
                </Text>
              ) : null}
            </ToastContentPrimitive>
            <ButtonPrimitive
              slot="close"
              aria-label="Dismiss"
              className="focus-ring hit-area -m-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-icon-default hover:bg-action-ghost-bg-hover"
            >
              <XIcon aria-hidden className="size-4" />
            </ButtonPrimitive>
          </ToastPrimitive>
        );
      }}
    </ToastRegion>
  );
}
