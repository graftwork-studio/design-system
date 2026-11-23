"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Calendar as CalendarPrimitive,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  type CalendarProps as CalendarPrimitiveProps,
  type DateValue,
  RangeCalendar as RangeCalendarPrimitive,
  type RangeCalendarProps as RangeCalendarPrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Arrow keys move between days, Page Up and Page Down change month, and Enter
 * selects. Today is bold and underlined, so colour is never the only cue. Pass
 * dates from @internationalized/date, for example parseDate("2026-03-15").
 */

const cellBase = [
  "relative flex size-7 cursor-pointer items-center justify-center rounded-md text-sm text-text-default outline-none select-none",
  "hover:bg-action-ghost-bg-hover data-today:font-semibold data-today:underline data-today:underline-offset-2",
  "data-focus-visible:z-10 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-solid data-focus-visible:outline-focus-ring",
  "data-outside-month:text-text-secondary data-unavailable:line-through",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
].join(" ");

const selectedSingle = "data-selected:bg-action-primary-bg data-selected:text-text-on-primary data-selected:hover:bg-action-primary-bg-hover";

const selectedRange = [
  "data-selected:rounded-none data-selected:bg-action-secondary-bg-hover data-selected:text-text-default",
  "data-selection-start:rounded-s-md data-selection-start:bg-action-primary-bg data-selection-start:text-text-on-primary data-selection-start:hover:bg-action-primary-bg-hover",
  "data-selection-end:rounded-e-md data-selection-end:bg-action-primary-bg data-selection-end:text-text-on-primary data-selection-end:hover:bg-action-primary-bg-hover",
].join(" ");

function CalendarBody({ numberOfMonths, isRange }: { numberOfMonths: number; isRange: boolean }) {
  return (
    <div className="relative flex flex-col gap-4 md:flex-row">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between">
        <Button slot="previous" variant="ghost" size="sm" className="w-7 px-0">
          <ChevronLeftIcon aria-hidden className="rtl:rotate-180" />
        </Button>
        <Button slot="next" variant="ghost" size="sm" className="w-7 px-0">
          <ChevronRightIcon aria-hidden className="rtl:rotate-180" />
        </Button>
      </div>
      {Array.from({ length: numberOfMonths }, (_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex h-7 items-center justify-center px-7">
            <CalendarHeading offset={{ months: index }} className="text-sm font-medium text-text-default" />
          </div>
          <CalendarGrid offset={{ months: index }} className="border-collapse">
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell className="size-7 text-xs font-normal text-text-secondary">{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => <CalendarCell date={date} className={cn(cellBase, isRange ? selectedRange : selectedSingle)} />}
            </CalendarGridBody>
          </CalendarGrid>
        </div>
      ))}
    </div>
  );
}

export type CalendarProps<T extends DateValue> = Omit<CalendarPrimitiveProps<T>, "className" | "style" | "children" | "visibleDuration"> & {
  /** How many months to show side by side. Defaults to 1. */
  numberOfMonths?: number;
  className?: string;
};

export function Calendar<T extends DateValue>({ numberOfMonths = 1, className, ...props }: CalendarProps<T>) {
  return (
    <CalendarPrimitive
      data-slot="calendar"
      visibleDuration={{ months: numberOfMonths }}
      className={cn("w-fit p-2 text-text-default", className)}
      {...(props as CalendarPrimitiveProps<T>)}
    >
      <CalendarBody numberOfMonths={numberOfMonths} isRange={false} />
    </CalendarPrimitive>
  );
}

export type RangeCalendarProps<T extends DateValue> = Omit<RangeCalendarPrimitiveProps<T>, "className" | "style" | "children" | "visibleDuration"> & {
  /** How many months to show side by side. Defaults to 1. */
  numberOfMonths?: number;
  className?: string;
};

export function RangeCalendar<T extends DateValue>({ numberOfMonths = 1, className, ...props }: RangeCalendarProps<T>) {
  return (
    <RangeCalendarPrimitive
      data-slot="range-calendar"
      visibleDuration={{ months: numberOfMonths }}
      className={cn("w-fit p-2 text-text-default", className)}
      {...(props as RangeCalendarPrimitiveProps<T>)}
    >
      <CalendarBody numberOfMonths={numberOfMonths} isRange />
    </RangeCalendarPrimitive>
  );
}
