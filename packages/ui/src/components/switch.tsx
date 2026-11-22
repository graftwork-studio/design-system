"use client";

import type * as React from "react";
import {
  composeRenderProps,
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { selectionRow } from "./checkbox.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Switch { label (children); isSelected; isDisabled }
 *
 * A switch turns something on or off straight away. For a choice that's saved
 * with a form, use a Checkbox.
 */

export type SwitchProps = Omit<SwitchPrimitiveProps, "className" | "style" | "children"> & {
  /** Visible label. */
  children: React.ReactNode;
  className?: string;
};

export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive data-slot="switch" className={cn(selectionRow, className)} {...props}>
      {composeRenderProps(children, (label) => (
        <>
          <span
            data-slot="switch-track"
            className={cn(
              "flex h-[18.4px] w-8 shrink-0 items-center rounded-full border border-border-input bg-surface-default",
              "transition-colors duration-(--gw-motion-duration-fast)",
              "group-data-selected/selection:border-action-primary-bg group-data-selected/selection:bg-action-primary-bg",
              "group-data-focus-visible/selection:focus-ring-drawn",
            )}
          >
            <span
              data-slot="switch-thumb"
              className={cn(
                "size-4 rounded-full bg-icon-default transition-transform duration-(--gw-motion-duration-fast)",
                "group-data-selected/selection:translate-x-[calc(100%-2px)] group-data-selected/selection:bg-text-on-primary",
              )}
            />
          </span>
          <span>{label}</span>
        </>
      ))}
    </SwitchPrimitive>
  );
}
