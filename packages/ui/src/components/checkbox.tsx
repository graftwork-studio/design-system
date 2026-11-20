"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import type * as React from "react";
import {
  Checkbox as CheckboxPrimitive,
  CheckboxGroup as CheckboxGroupPrimitive,
  type CheckboxGroupProps as CheckboxGroupPrimitiveProps,
  type CheckboxProps as CheckboxPrimitiveProps,
  composeRenderProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldErrorText, FieldLabel } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Checkbox { label (children); isSelected; isIndeterminate; isInvalid; isDisabled }
 *                 CheckboxGroup { label; description; errorMessage; isInvalid; isDisabled; isRequired }
 */

/** The row a checkbox, radio or switch sits in. The whole row is the label, so the hit area is the full row. */
export const selectionRow = [
  "group/selection hit-area flex cursor-pointer items-center gap-2 text-body text-text-default",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
].join(" ");

/** The box or circle itself. Focus is shown on the indicator, which is what the keyboard user is operating. */
export const selectionIndicator = [
  "flex shrink-0 items-center justify-center border border-border-input bg-surface-default text-text-on-primary",
  "transition-colors duration-(--gw-motion-duration-fast)",
  "group-data-focus-visible/selection:focus-ring-drawn group-data-invalid/selection:border-border-input-invalid",
].join(" ");

export type CheckboxProps = Omit<CheckboxPrimitiveProps, "className" | "style" | "children"> & {
  /** Visible label. */
  children: React.ReactNode;
  className?: string;
};

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive data-slot="checkbox" className={cn(selectionRow, className)} {...props}>
      {composeRenderProps(children, (label, { isSelected, isIndeterminate }) => (
        <>
          <span
            data-slot="checkbox-indicator"
            className={cn(
              selectionIndicator,
              "size-4 rounded-sm",
              "group-data-selected/selection:border-action-primary-bg group-data-selected/selection:bg-action-primary-bg",
              "group-data-indeterminate/selection:border-action-primary-bg group-data-indeterminate/selection:bg-action-primary-bg",
            )}
          >
            {isIndeterminate ? (
              <MinusIcon aria-hidden className="size-3.5" strokeWidth={3} />
            ) : isSelected ? (
              <CheckIcon aria-hidden className="size-3.5" strokeWidth={3} />
            ) : null}
          </span>
          <span>{label}</span>
        </>
      ))}
    </CheckboxPrimitive>
  );
}

export type CheckboxGroupProps = Omit<CheckboxGroupPrimitiveProps, "className" | "style" | "children"> & {
  /** Visible label for the group. */
  label: string;
  description?: string;
  errorMessage?: string;
  className?: string;
  /** Checkbox elements. */
  children: React.ReactNode;
};

export function CheckboxGroup({ label, description, errorMessage, className, children, ...props }: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive data-slot="checkbox-group" className={cn("flex flex-col gap-2", className)} {...props}>
      <FieldLabel elementType="span">
        {label}
        {props.isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <div className="flex flex-col gap-3">{children}</div>
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </CheckboxGroupPrimitive>
  );
}
