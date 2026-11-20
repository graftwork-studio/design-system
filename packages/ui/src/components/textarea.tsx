"use client";

import type * as React from "react";
import { TextArea as TextAreaPrimitive, TextField, type TextFieldProps } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldErrorText, FieldLabel, fieldControl } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Textarea { label; description; placeholder; errorMessage; rows; isInvalid; isDisabled; isRequired }
 */

export type TextareaProps = Omit<TextFieldProps, "className" | "style" | "children"> & {
  /** Visible label. Required: placeholders never replace labels. */
  label: string;
  /** Help text under the label, linked to the textarea. */
  description?: string;
  /** Shown as text under the textarea when isInvalid is true, and linked to it. */
  errorMessage?: string;
  placeholder?: string;
  /** Minimum visible lines. The textarea grows with its content. Defaults to 3. */
  rows?: number;
  className?: string;
  textareaRef?: React.Ref<HTMLTextAreaElement>;
};

export function Textarea({
  label,
  description,
  errorMessage,
  placeholder,
  rows = 3,
  className,
  textareaRef,
  ...props
}: TextareaProps) {
  return (
    <TextField data-slot="textarea-field" className={cn("flex flex-col gap-1", className)} {...props}>
      <FieldLabel>
        {label}
        {props.isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <TextAreaPrimitive
        ref={textareaRef}
        data-slot="textarea"
        rows={rows}
        placeholder={placeholder}
        className={cn(fieldControl, "focus-ring field-sizing-content py-2 leading-body placeholder:text-text-placeholder")}
      />
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </TextField>
  );
}
