"use client";

import type * as React from "react";
import {
  Input as InputPrimitive,
  TextField,
  type TextFieldProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldErrorText, FieldLabel, fieldControl } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Input { label; description; placeholder; errorMessage; isInvalid; isDisabled; isRequired }
 */

export type InputProps = Omit<TextFieldProps, "className" | "style" | "children"> & {
  /** Visible label. Required: placeholders never replace labels. */
  label: string;
  /** Help text under the label, linked to the input. */
  description?: string;
  /** Shown as text under the input when isInvalid is true, and linked to it. */
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

export function Input({ label, description, errorMessage, placeholder, className, inputRef, ...props }: InputProps) {
  return (
    <TextField data-slot="input-field" className={cn("flex flex-col gap-2", className)} {...props}>
      <FieldLabel>
        {label}
        {props.isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <InputPrimitive
        ref={inputRef}
        data-slot="input"
        placeholder={placeholder}
        className={cn(fieldControl, "focus-ring placeholder:text-text-placeholder")}
      />
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </TextField>
  );
}
