"use client";

import { ProgressBar, type ProgressBarProps as ProgressBarPrimitiveProps } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldLabel } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Progress { label; value; showValue; isIndeterminate }
 *
 * How far through a task something is, e.g. an upload. Leave value out (or set
 * isIndeterminate) when you can't tell.
 */

export type ProgressProps = Omit<ProgressBarPrimitiveProps, "className" | "style" | "children"> & {
  /** Visible label. */
  label: string;
  /** Show the percentage next to the label. Defaults to true. */
  showValue?: boolean;
  className?: string;
};

export function Progress({ label, showValue = true, className, ...props }: ProgressProps) {
  return (
    <ProgressBar data-slot="progress" className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <div className="flex items-baseline justify-between gap-4">
            <FieldLabel>{label}</FieldLabel>
            {showValue && !isIndeterminate ? <span className="text-sm text-text-secondary tabular-nums">{valueText}</span> : null}
          </div>
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-surface-subtle outline outline-1 -outline-offset-1 outline-border-input">
            <div
              data-slot="progress-fill"
              className={cn(
                "absolute inset-y-0 start-0 rounded-full bg-action-primary-bg",
                isIndeterminate && "w-1/3 animate-pulse motion-reduce:animate-none",
              )}
              style={isIndeterminate ? undefined : { width: `${percentage ?? 0}%` }}
            />
          </div>
        </>
      )}
    </ProgressBar>
  );
}
