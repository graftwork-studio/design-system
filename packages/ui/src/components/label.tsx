"use client";

import type * as React from "react";
import { Label as LabelPrimitive } from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Label { children }
 *
 * Input, Select, Textarea and the other fields already render their own label.
 * Use Label only to label something custom, with htmlFor or inside a React Aria field.
 */

export type LabelProps = React.ComponentProps<typeof LabelPrimitive>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive data-slot="label" className={cn("text-sm font-medium text-text-default", className)} {...props} />
  );
}
