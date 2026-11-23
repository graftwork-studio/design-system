"use client";

import { CheckIcon, SearchIcon } from "lucide-react";
import * as React from "react";
import {
  Autocomplete,
  type AutocompleteProps,
  Collection,
  composeRenderProps,
  type DialogProps as DialogPrimitiveProps,
  Group,
  Header,
  Input as InputPrimitive,
  type InputProps as InputPrimitiveProps,
  Menu,
  MenuItem,
  type MenuItemProps,
  type MenuProps,
  MenuSection,
  type MenuSectionProps,
  SearchField,
  Separator,
  type SeparatorProps,
  useFilter,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { DialogContent, type DialogContentProps, DialogDescription, DialogHeader, DialogTitle } from "./dialog.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Command, CommandDialog { title; description }, CommandInput { placeholder }, CommandList,
 *                 CommandEmpty, CommandGroup { heading }, CommandItem { isDisabled; children }, CommandShortcut,
 *                 CommandSeparator
 *
 * A searchable list of actions. Focus stays in the search box while arrow keys
 * move through the results. Items with non-text children need a textValue.
 */

const InDialogContext = React.createContext(false);

export type CommandProps = Omit<AutocompleteProps, "children"> & { className?: string; children: React.ReactNode };

export function Command({ className, children, filter, ...props }: CommandProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  return (
    <div
      data-slot="command"
      className={cn("flex size-full flex-col overflow-hidden rounded-xl bg-surface-overlay p-1 text-text-default", className)}
    >
      <Autocomplete filter={filter ?? contains} {...props}>
        {children}
      </Autocomplete>
    </div>
  );
}

export type CommandDialogProps = Omit<DialogContentProps, "size" | "showCloseButton" | "role"> & {
  /** Names the dialog for screen readers. Defaults to "Command menu". */
  title?: string;
  description?: string;
};

/** Command in a modal. Put it inside a Dialog with a trigger, or control it with isOpen and onOpenChange. */
export function CommandDialog({
  title = "Command menu",
  description = "Search for a command to run.",
  className,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <DialogContent showCloseButton={false} className={cn("gap-0 p-0", className)} {...props}>
      {(renderProps: Parameters<Extract<DialogPrimitiveProps["children"], (...args: never[]) => unknown>>[0]) => (
        <InDialogContext.Provider value>
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {typeof children === "function" ? children(renderProps) : children}
        </InDialogContext.Provider>
      )}
    </DialogContent>
  );
}

export type CommandInputProps = Omit<InputPrimitiveProps, "className" | "style"> & { className?: string };

export function CommandInput({ className, placeholder = "Search", autoFocus, ...props }: CommandInputProps) {
  const inDialog = React.useContext(InDialogContext);
  return (
    // eslint-disable-next-line jsx-a11y/no-autofocus -- only inside a dialog, where focus must move to the search box.
    <SearchField aria-label={placeholder} autoFocus={autoFocus ?? inDialog} data-slot="command-input-wrapper" className="p-1">
      <Group className="focus-ring-within flex h-8 items-center gap-2 rounded-lg border border-border-input bg-surface-default px-2">
        <SearchIcon aria-hidden className="size-4 shrink-0 text-icon-default" />
        <InputPrimitive
          data-slot="command-input"
          placeholder={placeholder}
          // eslint-disable-next-line graftwork/no-outline-removal -- the wrapping Group draws the ring (focus-ring-within).
          className={cn(
            // 16px below the md breakpoint, so iOS Safari doesn't zoom in on focus.
            "h-full w-full min-w-0 bg-transparent text-md outline-none placeholder:text-text-placeholder md:text-body [&::-webkit-search-cancel-button]:hidden",
            className,
          )}
          {...props}
        />
      </Group>
    </SearchField>
  );
}

export type CommandListProps<T extends object> = Omit<MenuProps<T>, "className" | "style"> & { className?: string };

export function CommandList<T extends object>({ className, ...props }: CommandListProps<T>) {
  return (
    <Menu
      data-slot="command-list"
      // eslint-disable-next-line graftwork/no-outline-removal -- focus stays in the search box, and each item draws its own ring.
      className={cn("max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className)}
      {...props}
    />
  );
}

/** Pass to CommandList: renderEmptyState={() => <CommandEmpty>No results</CommandEmpty>}. */
export function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-empty" className={cn("py-6 text-center text-sm text-text-secondary", className)} {...props} />;
}

export type CommandGroupProps<T extends object> = Omit<MenuSectionProps<T>, "className" | "style"> & {
  heading?: string;
  className?: string;
};

export function CommandGroup<T extends object>({ className, children, items, heading, ...props }: CommandGroupProps<T>) {
  return (
    <MenuSection data-slot="command-group" className={cn("overflow-hidden p-1", className)} {...props}>
      {heading ? <Header className="px-2 py-1.5 text-xs font-medium text-text-secondary">{heading}</Header> : null}
      <Collection items={items}>{children}</Collection>
    </MenuSection>
  );
}

export function CommandSeparator({ className, ...props }: Omit<SeparatorProps, "className"> & { className?: string }) {
  return <Separator data-slot="command-separator" className={cn("-mx-1 h-px border-0 bg-border-default", className)} {...props} />;
}

export type CommandItemProps<T extends object> = Omit<MenuItemProps<T>, "className" | "style"> & { className?: string };

export function CommandItem<T extends object>({ className, children, textValue, ...props }: CommandItemProps<T>) {
  return (
    <MenuItem
      data-slot="command-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "group/command-item relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body text-text-default outline-none select-none",
        "data-focused:bg-action-ghost-bg-hover data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-icon-default",
        className,
      )}
      {...props}
    >
      {composeRenderProps(children, (content, { isSelected }) => (
        <>
          {content}
          {isSelected ? <CheckIcon aria-hidden className="ms-auto" /> : null}
        </>
      ))}
    </MenuItem>
  );
}

export function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="command-shortcut" className={cn("ms-auto text-xs tracking-widest text-text-secondary", className)} {...props} />;
}
