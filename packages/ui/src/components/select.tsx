"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  Popover,
  Select as SelectPrimitive,
  type SelectProps as SelectPrimitiveProps,
  SelectValue,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldErrorText, FieldLabel, fieldControl } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Select { label; description; placeholder; errorMessage; isInvalid; isDisabled; isRequired }
 *                 SelectItem { label }
 */

export type SelectProps<T extends object> = Omit<
  SelectPrimitiveProps<T, "single">,
  "className" | "style" | "children" | "selectionMode"
> & {
  /** Visible label. Required. */
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  /** SelectItem elements, or a render function when `items` is given. */
  children: React.ReactNode | ((item: T) => React.ReactNode);
  items?: Iterable<T>;
};

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  placeholder = "Choose an option",
  className,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <SelectPrimitive
      data-slot="select"
      placeholder={placeholder}
      className={cn("group/select flex flex-col gap-2", className)}
      {...props}
    >
      <FieldLabel>
        {label}
        {props.isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <ButtonPrimitive
        data-slot="select-trigger"
        className={cn(
          fieldControl,
          "focus-ring flex cursor-pointer items-center justify-between gap-1.5 ps-2.5 pe-2 text-left text-body",
          "hover:bg-action-secondary-bg-hover",
          "group-data-invalid/select:border-2 group-data-invalid/select:border-border-input-invalid",
        )}
      >
        <SelectValue className="truncate data-placeholder:text-text-placeholder" />
        <ChevronDownIcon aria-hidden className="size-4 shrink-0 text-icon-default" />
      </ButtonPrimitive>
      <FieldErrorText>{errorMessage}</FieldErrorText>
      <Popover
        data-slot="select-popover"
        offset={4}
        className={cn(
          "w-(--trigger-width) min-w-40 overflow-auto rounded-md border border-border-default bg-surface-overlay shadow-md",
          "transition-opacity duration-(--gw-motion-duration-fade) data-entering:opacity-0 data-exiting:opacity-0",
        )}
      >
        <ListBox data-slot="select-list" items={items} className="max-h-72 p-1 outline-none data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring">
          {children}
        </ListBox>
      </Popover>
    </SelectPrimitive>
  );
}

export type SelectItemProps = Omit<ListBoxItemProps, "className" | "style"> & { className?: string };

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <ListBoxItem
      data-slot="select-item"
      textValue={typeof children === "string" ? children : props.textValue}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-1.5 rounded-md py-1 ps-1.5 pe-2 text-body text-text-default outline-none",
        "data-focused:bg-action-ghost-bg-hover data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {composeRenderProps(children, (content, { isSelected }) => (
        <>
          <span className="truncate">{content}</span>
          {isSelected ? <CheckIcon aria-hidden className="size-4 shrink-0 text-icon-brand" /> : null}
        </>
      ))}
    </ListBoxItem>
  );
}
