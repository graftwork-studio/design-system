import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Alert { variant: info | success | warning | error; title; children (description); action }
 *
 * A message that's part of the page, like "Your trial ends in 3 days". Every
 * variant has its own icon, so colour is never the only cue. It isn't
 * announced on its own: for a message that appears after something the user
 * did, use a Toast, or set role="alert" (urgent) or role="status".
 */

export type AlertVariant = "info" | "success" | "warning" | "error";

const variants: Record<AlertVariant, { box: string; icon: React.ElementType; text: string }> = {
  info: { box: "border-border-status-info bg-status-info-bg", icon: InfoIcon, text: "text-text-info" },
  success: { box: "border-border-status-success bg-status-success-bg", icon: CircleCheckIcon, text: "text-text-success" },
  warning: { box: "border-border-status-warning bg-status-warning-bg", icon: TriangleAlertIcon, text: "text-text-warning" },
  error: { box: "border-border-status-error bg-status-error-bg", icon: CircleAlertIcon, text: "text-text-error" },
};

export type AlertProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Sets the colour and icon. Defaults to info. */
  variant?: AlertVariant;
  /** Short summary in bold. */
  title?: React.ReactNode;
  /** A Button or link shown at the end, e.g. "Upgrade". */
  action?: React.ReactNode;
};

export function Alert({ variant = "info", title, action, className, children, ...props }: AlertProps) {
  const { box, icon: Icon, text } = variants[variant];
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      className={cn("flex flex-wrap items-start gap-x-2 gap-y-2 rounded-lg border px-2.5 py-2 text-body", box, className)}
      {...props}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", text)} />
      <div className="flex min-w-0 flex-1 basis-48 flex-col gap-0.5">
        {title ? <p className={cn("font-medium", text)}>{title}</p> : null}
        {children ? <div className="text-text-default">{children}</div> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}
