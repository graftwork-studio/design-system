"use client";

import {
  Slider as SliderPrimitive,
  SliderFill,
  SliderOutput,
  type SliderProps as SliderPrimitiveProps,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldLabel } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Slider { label; description; showValue; minValue; maxValue; step; isDisabled }
 *
 * Pass a number for one thumb, or [start, end] for a range with two.
 */

export type SliderProps<T extends number | number[] = number> = Omit<
  SliderPrimitiveProps<T>,
  "className" | "style" | "children" | "orientation"
> & {
  /** Visible label. */
  label: string;
  description?: string;
  /** Show the current value next to the label. Defaults to true. */
  showValue?: boolean;
  /** Accessible names for the thumbs of a range, e.g. ["Minimum", "Maximum"]. */
  thumbLabels?: string[];
  className?: string;
};

export function Slider<T extends number | number[] = number>({
  label,
  description,
  showValue = true,
  thumbLabels,
  className,
  ...props
}: SliderProps<T>) {
  return (
    <SliderPrimitive data-slot="slider" className={cn("flex flex-col gap-1", className)} {...props}>
      <div className="flex items-baseline justify-between gap-4">
        <FieldLabel>{label}</FieldLabel>
        {showValue ? (
          <SliderOutput data-slot="slider-output" className="text-sm text-text-secondary tabular-nums" />
        ) : null}
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <SliderTrack data-slot="slider-track" className="group/track relative flex h-target-min w-full items-center">
        {({ state }) => (
          <>
            <span className="absolute inset-x-0 h-1.5 rounded-full bg-border-input" />
            {/* React Aria sizes the fill to the full track height, so the bar is drawn by ::before. */}
            <SliderFill
              data-slot="slider-fill"
              className="before:absolute before:inset-x-0 before:top-1/2 before:h-1.5 before:-translate-y-1/2 before:rounded-full before:bg-action-primary-bg"
            />
            {state.values.map((_, index) => (
              <SliderThumb
                key={index}
                index={index}
                aria-label={thumbLabels?.[index]}
                data-slot="slider-thumb"
                className={cn(
                  "hit-area top-1/2 size-5 cursor-grab rounded-full border-2 border-action-primary-bg bg-surface-default",
                  "data-dragging:cursor-grabbing data-focus-visible:focus-ring-drawn",
                  "group-data-disabled/track:cursor-not-allowed group-data-disabled/track:opacity-50",
                )}
              />
            ))}
          </>
        )}
      </SliderTrack>
    </SliderPrimitive>
  );
}
