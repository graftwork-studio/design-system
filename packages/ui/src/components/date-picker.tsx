"use client";

import { CalendarIcon } from "lucide-react";
import type * as React from "react";
import {
  Button as ButtonPrimitive,
  DateInput,
  DatePicker as DatePickerPrimitive,
  type DatePickerProps as DatePickerPrimitiveProps,
  DateRangePicker as DateRangePickerPrimitive,
  type DateRangePickerProps as DateRangePickerPrimitiveProps,
  DateSegment,
  type DateValue,
  Dialog,
  Group,
  Popover,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Calendar, RangeCalendar } from "./calendar.js";
import { FieldDescription, FieldErrorText, FieldLabel, fieldControl } from "./field.js";
import { floatingPanel } from "./popover.js";

/*
 * Adapted from shadcn/ui's date picker pattern. Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * The date can be typed one part at a time or chosen from the calendar, so it
 * works without a pointer. The format follows the user's locale.
 */

const control = cn(
  fieldControl,
  "focus-ring-within flex items-center gap-1 py-0 pe-0.5",
  "group-data-invalid/date:border-2 group-data-invalid/date:border-border-input-invalid",
  "group-data-disabled/date:cursor-not-allowed group-data-disabled/date:opacity-50",
);

const segment = [
  "inline-flex h-6 min-w-6 items-center justify-center rounded-sm px-0.5 tabular-nums outline-none data-placeholder:text-text-placeholder data-[type=literal]:min-w-0 data-[type=literal]:px-0 data-[type=literal]:text-text-secondary",
  "data-focused:bg-action-primary-bg data-focused:text-text-on-primary",
].join(" ");

const calendarButton =
  "focus-ring hit-area ms-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-icon-default hover:bg-action-ghost-bg-hover data-disabled:cursor-not-allowed";

function Segments({ slot }: { slot?: "start" | "end" }) {
  return (
    <DateInput slot={slot} className="flex items-center">
      {(part) => <DateSegment segment={part} className={segment} />}
    </DateInput>
  );
}

type FieldText = {
  /** Visible label. Required. */
  label: string;
  description?: string;
  errorMessage?: string;
  className?: string;
};

function FieldTop({ label, description, isRequired }: { label: string; description?: string; isRequired?: boolean }) {
  return (
    <>
      <FieldLabel>
        {label}
        {isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </>
  );
}

function CalendarPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover data-slot="date-picker-popover" placement="bottom start" offset={4} className={floatingPanel}>
      <Dialog className="focus-ring rounded-lg">{children}</Dialog>
    </Popover>
  );
}

export type DatePickerProps<T extends DateValue> = Omit<DatePickerPrimitiveProps<T>, "className" | "style" | "children"> & FieldText;

export function DatePicker<T extends DateValue>({ label, description, errorMessage, className, ...props }: DatePickerProps<T>) {
  return (
    <DatePickerPrimitive data-slot="date-picker" className={cn("group/date flex flex-col gap-2", className)} {...props}>
      <FieldTop label={label} description={description} isRequired={props.isRequired} />
      <Group data-slot="date-picker-control" className={control}>
        <Segments />
        <ButtonPrimitive className={calendarButton}>
          <CalendarIcon aria-hidden className="size-4" />
        </ButtonPrimitive>
      </Group>
      <FieldErrorText>{errorMessage}</FieldErrorText>
      <CalendarPopover>
        <Calendar />
      </CalendarPopover>
    </DatePickerPrimitive>
  );
}

export type DateRangePickerProps<T extends DateValue> = Omit<DateRangePickerPrimitiveProps<T>, "className" | "style" | "children"> & FieldText;

export function DateRangePicker<T extends DateValue>({ label, description, errorMessage, className, ...props }: DateRangePickerProps<T>) {
  return (
    <DateRangePickerPrimitive data-slot="date-range-picker" className={cn("group/date flex flex-col gap-2", className)} {...props}>
      <FieldTop label={label} description={description} isRequired={props.isRequired} />
      <Group data-slot="date-picker-control" className={cn(control, "h-auto min-h-8 flex-wrap")}>
        <Segments slot="start" />
        <span aria-hidden className="text-text-secondary">
          –
        </span>
        <Segments slot="end" />
        <ButtonPrimitive className={calendarButton}>
          <CalendarIcon aria-hidden className="size-4" />
        </ButtonPrimitive>
      </Group>
      <FieldErrorText>{errorMessage}</FieldErrorText>
      <CalendarPopover>
        <RangeCalendar />
      </CalendarPopover>
    </DateRangePickerPrimitive>
  );
}
