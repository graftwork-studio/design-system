"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import {
  Button as ButtonPrimitive,
  ComboBox as ComboBoxPrimitive,
  type ComboBoxProps as ComboBoxPrimitiveProps,
  composeRenderProps,
  Group,
  Input as InputPrimitive,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  Popover,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { FieldDescription, FieldErrorText, FieldLabel, fieldControl } from "./field.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Combobox { label; description; placeholder; errorMessage; isInvalid; isDisabled; isRequired }
 *                 ComboboxItem { label }
 *
 * A Select you can type into to filter. Use Select when there are only a few options.
 */

export type ComboboxProps<T extends object> = Omit<ComboBoxPrimitiveProps<T>, "className" | "style" | "children"> & {
  /** Visible label. Required. */
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  /** Shown in the list when nothing matches what was typed. Defaults to "No results". */
  emptyMessage?: string;
  className?: string;
  /** ComboboxItem elements, or a render function when `items` is given. */
  children: React.ReactNode | ((item: T) => React.ReactNode);
};

export function Combobox<T extends object>({
  label,
  description,
  errorMessage,
  placeholder,
  emptyMessage = "No results",
  className,
  children,
  ...props
}: ComboboxProps<T>) {
  return (
    <ComboBoxPrimitive data-slot="combobox" className={cn("group/combobox flex flex-col gap-1", className)} {...props}>
      <FieldLabel>
        {label}
        {props.isRequired ? <span className="text-text-secondary"> (required)</span> : null}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <Group
        data-slot="combobox-control"
        isDisabled={props.isDisabled}
        className={cn(
          fieldControl,
          "focus-ring-within flex items-center gap-1 pe-0",
          "group-data-invalid/combobox:border-2 group-data-invalid/combobox:border-border-input-invalid",
          "group-data-disabled/combobox:cursor-not-allowed group-data-disabled/combobox:opacity-50",
        )}
      >
        <InputPrimitive
          data-slot="combobox-input"
          placeholder={placeholder}
          // eslint-disable-next-line graftwork/no-outline-removal -- the wrapping Group draws the ring (focus-ring-within).
          className="min-h-target-min min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed"
        />
        <ButtonPrimitive
          data-slot="combobox-trigger"
          className="focus-ring flex size-target-min shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-action-ghost-bg-hover data-disabled:cursor-not-allowed"
        >
          <ChevronDownIcon aria-hidden className="size-4 text-icon-default" />
        </ButtonPrimitive>
      </Group>
      <FieldErrorText>{errorMessage}</FieldErrorText>
      <Popover
        data-slot="combobox-popover"
        offset={4}
        className={cn(
          "w-(--trigger-width) min-w-40 overflow-auto rounded-md border border-border-default bg-surface-overlay shadow-md",
          "transition-opacity duration-(--gw-motion-duration-fade) data-entering:opacity-0 data-exiting:opacity-0",
        )}
      >
        <ListBox
          data-slot="combobox-list"
          renderEmptyState={() => <p className="px-3 py-2 text-sm text-text-secondary">{emptyMessage}</p>}
          className="focus-ring max-h-72 p-1"
        >
          {children}
        </ListBox>
      </Popover>
    </ComboBoxPrimitive>
  );
}

export type ComboboxItemProps = Omit<ListBoxItemProps, "className" | "style"> & { className?: string };

export function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <ListBoxItem
      data-slot="combobox-item"
      textValue={typeof children === "string" ? children : props.textValue}
      className={cn(
        "flex min-h-target-min cursor-pointer items-center justify-between gap-2 rounded-sm px-3 text-md text-text-default outline-none",
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
