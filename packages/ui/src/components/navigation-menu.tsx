"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { Button as ButtonPrimitive, type ButtonProps, Link as LinkPrimitive, type LinkProps } from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui's Navigation Menu. Copyright (c) 2023 shadcn. MIT licence.
 * Built on React Aria, because shadcn's version needs Base UI.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Site navigation, using the disclosure pattern: a button shows a panel of
 * ordinary links. Tab moves through them, and Escape closes the panel and
 * returns focus to its button.
 */

type RootContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const RootContext = React.createContext<RootContextValue | null>(null);
const ItemContext = React.createContext<{ id: string; panelId: string; triggerRef: React.RefObject<HTMLButtonElement | null> } | null>(null);

function useRoot() {
  const context = React.useContext(RootContext);
  if (!context) throw new Error("NavigationMenu parts must be used within a NavigationMenu.");
  return context;
}

function useItem() {
  const context = React.useContext(ItemContext);
  if (!context) throw new Error("This part must be used within a NavigationMenuItem.");
  return context;
}

export type NavigationMenuProps = Omit<React.ComponentProps<"nav">, "aria-label"> & {
  /** Names the navigation landmark. Required. */
  "aria-label": string;
};

export function NavigationMenu({ className, children, ...props }: NavigationMenuProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLElement>(null);
  const value = React.useMemo(() => ({ openId, setOpenId }), [openId]);

  React.useEffect(() => {
    if (openId === null) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenId(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openId]);

  return (
    <RootContext.Provider value={value}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- closes the panel when focus leaves the menu. */}
      <nav
        ref={rootRef}
        data-slot="navigation-menu"
        className={cn("relative w-fit max-w-full", className)}
        onBlur={(event) => {
          // Close when keyboard focus leaves the whole menu.
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setOpenId(null);
        }}
        {...props}
      >
        {children}
      </nav>
    </RootContext.Provider>
  );
}

export function NavigationMenuList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="navigation-menu-list" className={cn("flex list-none flex-wrap items-center gap-1 p-0", className)} {...props} />;
}

export function NavigationMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  const id = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const value = React.useMemo(() => ({ id, panelId: `${id}-panel`, triggerRef }), [id]);
  return (
    <ItemContext.Provider value={value}>
      <li data-slot="navigation-menu-item" className={className} {...props} />
    </ItemContext.Provider>
  );
}

/** The look of a top-level item. Use it to style a link to match the triggers. */
export const navigationMenuTriggerStyle =
  "focus-ring inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg px-2.5 text-body font-medium text-text-default no-underline hover:bg-action-ghost-bg-hover data-[active=true]:bg-action-secondary-bg-hover data-disabled:cursor-not-allowed data-disabled:opacity-50";

export type NavigationMenuTriggerProps = Omit<ButtonProps, "className" | "style" | "children"> & {
  className?: string;
  children: React.ReactNode;
};

export function NavigationMenuTrigger({ className, children, onPress, ...props }: NavigationMenuTriggerProps) {
  const { openId, setOpenId } = useRoot();
  const { id, panelId, triggerRef } = useItem();
  const isOpen = openId === id;
  return (
    <ButtonPrimitive
      ref={triggerRef}
      data-slot="navigation-menu-trigger"
      data-active={isOpen}
      aria-expanded={isOpen}
      aria-controls={isOpen ? panelId : undefined}
      className={cn(navigationMenuTriggerStyle, "group/nav-trigger", className)}
      onPress={(event) => {
        onPress?.(event);
        setOpenId(isOpen ? null : id);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) setOpenId(null);
        else event.continuePropagation();
      }}
      {...props}
    >
      {children}
      <ChevronDownIcon aria-hidden className="size-3.5 transition-transform group-aria-expanded/nav-trigger:rotate-180 motion-reduce:transition-none" />
    </ButtonPrimitive>
  );
}

export function NavigationMenuContent({ className, onKeyDown, ...props }: React.ComponentProps<"div">) {
  const { openId, setOpenId } = useRoot();
  const { id, panelId, triggerRef } = useItem();
  if (openId !== id) return null;
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Escape from a link inside closes the panel.
    <div
      id={panelId}
      data-slot="navigation-menu-content"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpenId(null);
          triggerRef.current?.focus();
        }
      }}
      className={cn(
        "absolute start-0 top-full z-50 mt-1 w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-border-default bg-surface-overlay p-1 text-text-default shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export type NavigationMenuLinkProps = Omit<LinkProps, "className" | "style"> & {
  /** Marks this link as the current page. */
  isActive?: boolean;
  className?: string;
};

export function NavigationMenuLink({ isActive = false, className, ...props }: NavigationMenuLinkProps) {
  const root = React.useContext(RootContext);
  return (
    <LinkPrimitive
      data-slot="navigation-menu-link"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-ring flex cursor-pointer flex-col gap-0.5 rounded-md px-2 py-1.5 text-sm text-text-default no-underline hover:bg-action-ghost-bg-hover data-[active=true]:bg-action-secondary-bg-hover",
        className,
      )}
      onPress={() => root?.setOpenId(null)}
      {...props}
    />
  );
}
