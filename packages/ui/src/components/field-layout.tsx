import { CircleAlertIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/utils.js";
import { Separator } from "./separator.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * For laying out a custom form. Input, Select and the other form controls
 * already include a label, description and error, so they don't need Field.
 */

export function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset data-slot="field-set" className={cn("flex min-w-0 flex-col gap-4 border-0 p-0", className)} {...props} />;
}

export type FieldLegendProps = React.ComponentProps<"legend"> & {
  /** Legend is larger, for a section. Label matches a field label. Defaults to legend. */
  variant?: "legend" | "label";
};

export function FieldLegend({ className, variant = "legend", ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn("mb-1.5 font-medium text-text-default", variant === "legend" ? "text-md" : "text-sm", className)}
      {...props}
    />
  );
}

export function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("@container/field-group flex w-full flex-col gap-5", className)} {...props} />;
}

const orientations = {
  vertical: "flex-col",
  horizontal: "flex-row items-center has-[>[data-slot=field-content]]:items-start",
  responsive: "flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:has-[>[data-slot=field-content]]:items-start",
} as const;

export type FieldProps = React.ComponentProps<"div"> & {
  /** Responsive stacks until its FieldGroup is wide enough. Defaults to vertical. */
  orientation?: keyof typeof orientations;
};

export function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn("group/field flex w-full gap-2", orientations[orientation], className)}
      {...props}
    />
  );
}

export function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn("flex min-w-0 flex-1 flex-col gap-0.5 leading-snug", className)} {...props} />;
}

/** A field heading that isn't tied to one control. Use FieldLabel when it names an input. */
export function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn("flex w-fit items-center gap-2 text-sm font-medium text-text-default", className)}
      {...props}
    />
  );
}

export function FieldSeparator({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="field-separator" className={cn("relative h-5 text-sm", className)} {...props}>
      <Separator className="absolute inset-x-0 top-1/2" />
      {children ? <span className="relative mx-auto block w-fit bg-surface-raised px-2 text-text-secondary">{children}</span> : null}
    </div>
  );
}

export type FieldErrorProps = React.ComponentProps<"div"> & {
  /** Validation errors, as returned by most form libraries. Duplicates are removed. */
  errors?: ReadonlyArray<{ message?: string } | undefined>;
};

/** An error with an icon, so colour is never the only cue. Renders nothing when there's no error. */
export function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const messages = [...new Set((errors ?? []).flatMap((error) => (error?.message ? [error.message] : [])))];
  if (!children && messages.length === 0) return null;
  return (
    <div role="alert" data-slot="field-error" className={cn("flex items-start gap-1 text-sm text-text-error", className)} {...props}>
      <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children ??
        (messages.length === 1 ? (
          <span>{messages[0]}</span>
        ) : (
          <ul className="ms-4 flex list-disc flex-col gap-1">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ))}
    </div>
  );
}
