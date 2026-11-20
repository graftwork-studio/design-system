"use client";

import type * as React from "react";
import {
  composeRenderProps,
  Radio as RadioPrimitive,
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupProps as RadioGroupPrimitiveProps,
  type RadioProps as RadioPrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { selectionIndicator, selectionRow } from "./checkbox.js";
import { FieldDescription, FieldErrorText, FieldLabel } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: RadioGroup { label; description; errorMessage; orientation: vertical | horizontal; isInvalid; isDisabled; isRequired }
 *                 Radio { label (children); value; isDisabled }
 */

export type RadioGroupProps = Omit<RadioGroupPrimitiveProps, "className" | "style" | "children"> & {
  /** Visible label for the group. */
  label: string;
  description?: string;
  errorMessage?: string;
  className?: string;
  /** Radio elements. */
  children: React.ReactNode;
};

export function RadioGroup({
  label,
  description,
  errorMessage,
  className,
  children,
  orientation = "vertical",
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      orientation={orientation}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <FieldLabel elementType="span">
        {label}
        {props.isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <div className={cn("flex", orientation === "horizontal" ? "flex-row flex-wrap gap-x-6" : "flex-col")}>
        {children}
      </div>
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </RadioGroupPrimitive>
  );
}

export type RadioProps = Omit<RadioPrimitiveProps, "className" | "style" | "children"> & {
  /** Visible label. */
  children: React.ReactNode;
  className?: string;
};

export function Radio({ className, children, ...props }: RadioProps) {
  return (
    <RadioPrimitive data-slot="radio" className={cn(selectionRow, className)} {...props}>
      {composeRenderProps(children, (label, { isSelected }) => (
        <>
          <span
            data-slot="radio-indicator"
            className={cn(selectionIndicator, "size-5 rounded-full", "group-data-selected/selection:border-action-primary-bg")}
          >
            {isSelected ? <span className="size-2.5 rounded-full bg-action-primary-bg" /> : null}
          </span>
          <span>{label}</span>
        </>
      ))}
    </RadioPrimitive>
  );
}
