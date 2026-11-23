"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldLabel } from "./field.js";
import { FieldError } from "./field-layout.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * A one-time passcode field. It's one real input, so typing, pasting and SMS
 * autofill all work, and screen readers hear a single field.
 */

const OtpFieldContext = React.createContext<{ isInvalid: boolean }>({ isInvalid: false });

export type InputOTPProps = {
  /** Visible label. Required. */
  label: string;
  description?: string;
  /** Shown when isInvalid is true. */
  errorMessage?: string;
  /** How many characters the code has. */
  maxLength: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called when every slot is filled. */
  onComplete?: (value: string) => void;
  /** A regular expression source for allowed characters. Defaults to digits. */
  pattern?: string;
  name?: string;
  id?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  /** InputOTPGroup, InputOTPSlot and InputOTPSeparator elements. */
  children: React.ReactNode;
};

export function InputOTP({
  label,
  description,
  errorMessage,
  maxLength,
  value,
  defaultValue,
  onChange,
  onComplete,
  pattern = "^[0-9]*$",
  name,
  id,
  isInvalid = false,
  isDisabled,
  isRequired,
  className,
  children,
}: InputOTPProps) {
  const generated = React.useId();
  const inputId = id ?? generated;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = isInvalid && errorMessage ? `${inputId}-error` : undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const context = React.useMemo(() => ({ isInvalid }), [isInvalid]);
  return (
    <div data-slot="input-otp-field" className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={inputId}>
        {label}
        {isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
      <OtpFieldContext.Provider value={context}>
        <OTPInput
          id={inputId}
          data-slot="input-otp"
          name={name}
          maxLength={maxLength}
          value={value ?? internal}
          onChange={(next: string) => {
            setInternal(next);
            onChange?.(next);
          }}
          onComplete={onComplete}
          pattern={pattern}
          inputMode="numeric"
          autoComplete="one-time-code"
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={isInvalid || undefined}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          spellCheck={false}
          containerClassName="flex w-fit items-center gap-2 has-disabled:opacity-50"
          className="disabled:cursor-not-allowed"
        >
          {children}
        </OTPInput>
      </OtpFieldContext.Provider>
      {errorId ? <FieldError id={errorId}>{errorMessage}</FieldError> : null}
    </div>
  );
}

export function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />;
}

export type InputOTPSlotProps = React.ComponentProps<"div"> & {
  /** This slot's position, starting at 0. */
  index: number;
};

export function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const { slots } = React.useContext(OTPInputContext);
  const { isInvalid } = React.useContext(OtpFieldContext);
  const { char, hasFakeCaret, isActive } = slots[index] ?? {};
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      data-invalid={isInvalid || undefined}
      className={cn(
        "relative flex size-8 items-center justify-center border-y border-e border-border-input bg-surface-default text-body text-text-default first:rounded-s-lg first:border-s last:rounded-e-lg",
        "data-invalid:border-border-input-invalid data-[active]:z-10 data-[active]:outline-2 data-[active]:outline-offset-2 data-[active]:outline-focus-ring data-[active]:outline-solid",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-px animate-pulse bg-text-default motion-reduce:animate-none" />
        </span>
      ) : null}
    </div>
  );
}

export function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" aria-hidden className={cn("flex items-center text-icon-default [&_svg]:size-4", className)} {...props}>
      <MinusIcon />
    </div>
  );
}
