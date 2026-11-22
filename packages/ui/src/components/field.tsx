"use client";

import { CircleAlertIcon } from "lucide-react";
import type * as React from "react";
import { FieldError as FieldErrorPrimitive, Label as LabelPrimitive, Text } from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Shared parts for form fields. Labels are always visible. Errors are shown as
 * text, with an icon so colour is never the only cue, and React Aria links both
 * the description and the error to the field with aria-describedby.
 */

export function FieldLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive>) {
  return (
    <LabelPrimitive
      data-slot="field-label"
      className={cn("text-sm leading-snug font-medium text-text-default", className)}
      {...props}
    />
  );
}

export function FieldDescription({ className, ...props }: Omit<React.ComponentProps<typeof Text>, "slot">) {
  return (
    <Text
      slot="description"
      data-slot="field-description"
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  );
}

export function FieldErrorText({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <FieldErrorPrimitive
      data-slot="field-error"
      className={cn("flex items-start gap-1 text-sm text-text-error", className)}
    >
      {(validation) => (
        <>
          <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>{children ?? validation.validationErrors.join(" ")}</span>
        </>
      )}
    </FieldErrorPrimitive>
  );
}

export const fieldControl = [
  // 14px like body text, but 16px below the md breakpoint: iOS Safari zooms into
  // text fields under 16px. Select overrides this, as it isn't a text field.
  "w-full min-w-0 rounded-lg border border-border-input bg-surface-default px-2.5 py-1 text-md md:text-body text-text-default",
  "h-8 transition-colors duration-(--gw-motion-duration-fast)",
  "data-invalid:border-2 data-invalid:border-border-input-invalid",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
].join(" ");
