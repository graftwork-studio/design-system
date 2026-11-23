"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldLabel, fieldControl } from "./field.js";
import { FieldError } from "./field-layout.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: NativeSelect { label; description; errorMessage; size: sm | md; isInvalid; isDisabled; isRequired }
 *                 NativeSelectOption, NativeSelectOptGroup
 *
 * The browser's own select. Prefer it on phones and in plain forms. Use Select
 * when options need custom content.
 */

export type NativeSelectProps = Omit<React.ComponentProps<"select">, "size" | "disabled" | "required"> & {
  /** Visible label. Required. */
  label: string;
  description?: string;
  /** Shown when isInvalid is true. */
  errorMessage?: string;
  /** 28 or 32px tall. Defaults to md. */
  size?: "sm" | "md";
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
};

export function NativeSelect({
  label,
  description,
  errorMessage,
  size = "md",
  isInvalid,
  isDisabled,
  isRequired,
  className,
  id,
  children,
  ...props
}: NativeSelectProps) {
  const generated = React.useId();
  const selectId = id ?? generated;
  const descriptionId = description ? `${selectId}-description` : undefined;
  const errorId = isInvalid && errorMessage ? `${selectId}-error` : undefined;
  return (
    <div data-slot="native-select-field" className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={selectId}>
        {label}
        {isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
      <div className="relative">
        <select
          id={selectId}
          data-slot="native-select"
          data-size={size}
          data-invalid={isInvalid || undefined}
          data-disabled={isDisabled || undefined}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={isInvalid || undefined}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          className={cn(
            fieldControl,
            // Stays 16px below the md breakpoint: iOS Safari zooms into selects under 16px too.
            "focus-ring cursor-pointer appearance-none pe-8 hover:bg-action-secondary-bg-hover",
            size === "sm" && "h-7 rounded-md md:text-[0.8rem]",
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon aria-hidden className="pointer-events-none absolute end-2 top-1/2 size-4 -translate-y-1/2 text-icon-default" />
      </div>
      {errorId ? <FieldError id={errorId}>{errorMessage}</FieldError> : null}
    </div>
  );
}

export function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-surface-overlay text-text-default", className)} {...props} />;
}

export function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" className={cn("bg-surface-overlay text-text-default", className)} {...props} />;
}
