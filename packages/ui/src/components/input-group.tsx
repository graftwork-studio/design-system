"use client";

import type * as React from "react";
import { Group, Input as InputPrimitive, TextField, type TextFieldProps } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldErrorText, FieldLabel, fieldControl } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: InputGroup { label; description; placeholder; errorMessage; startAddon; endAddon; isInvalid; isDisabled; isRequired }
 *
 * An Input with something attached inside its border: an icon, a unit such as
 * "kg" or "https://", or a small ghost Button. Decorative icons need aria-hidden;
 * text that matters to the value, like a currency, is announced with the label.
 */

export type InputGroupProps = Omit<TextFieldProps, "className" | "style" | "children"> & {
  /** Visible label. Required: placeholders never replace labels. */
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  /** Shown inside the border, before the text. */
  startAddon?: React.ReactNode;
  /** Shown inside the border, after the text. */
  endAddon?: React.ReactNode;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

const addon = "flex shrink-0 items-center gap-1 text-text-secondary [&_svg]:size-4 [&_svg]:text-icon-default";

export function InputGroup({
  label,
  description,
  errorMessage,
  placeholder,
  startAddon,
  endAddon,
  className,
  inputRef,
  ...props
}: InputGroupProps) {
  return (
    <TextField data-slot="input-group-field" className={cn("group/input-group flex flex-col gap-1", className)} {...props}>
      <FieldLabel>
        {label}
        {props.isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <Group
        data-slot="input-group"
        className={cn(
          fieldControl,
          "focus-ring-within flex items-center gap-2",
          "group-data-invalid/input-group:border-2 group-data-invalid/input-group:border-border-input-invalid",
          // Disabled fades the input and border, not the addons: axe can't tell an addon belongs to a
          // disabled control, so faded addon text would fail contrast.
          "data-disabled:opacity-100 group-data-disabled/input-group:cursor-not-allowed group-data-disabled/input-group:border-border-default",
        )}
      >
        {startAddon ? (
          <span data-slot="input-group-start" className={addon}>
            {startAddon}
          </span>
        ) : null}
        <InputPrimitive
          ref={inputRef}
          data-slot="input"
          placeholder={placeholder}
          // eslint-disable-next-line graftwork/no-outline-removal -- the wrapping Group draws the ring (focus-ring-within).
          className="min-h-target-min min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:opacity-50"
        />
        {endAddon ? (
          <span data-slot="input-group-end" className={cn(addon, "-me-2")}>
            {endAddon}
          </span>
        ) : null}
      </Group>
      <FieldErrorText>{errorMessage}</FieldErrorText>
    </TextField>
  );
}
