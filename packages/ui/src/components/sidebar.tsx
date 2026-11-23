"use client";

import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import * as React from "react";
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Link as LinkPrimitive,
  type LinkProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Button, type ButtonProps } from "./button.js";
import { Input, type InputProps } from "./input.js";
import { Separator, type SeparatorProps } from "./separator.js";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet.js";
import { Skeleton } from "./skeleton.js";
import { Tooltip, TooltipContent } from "./tooltip.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: SidebarProvider { defaultOpen; open }, Sidebar { side: left | right; variant: sidebar | floating | inset;
 *                 collapsible: offcanvas | icon | none }, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup,
 *                 SidebarGroupLabel, SidebarGroupAction, SidebarGroupContent, SidebarMenu, SidebarMenuItem,
 *                 SidebarMenuButton { size: sm | md | lg; variant: default | outline; isActive }, SidebarMenuAction,
 *                 SidebarMenuBadge, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
 *                 SidebarInput, SidebarInset, SidebarRail, SidebarSeparator, SidebarTrigger
 *
 * Below the md breakpoint it opens as a Sheet. It doesn't store whether it's
 * open: pass open and onOpenChange to keep that in your app.
 */

const MOBILE_QUERY = "(max-width: 767.98px)";

function useIsMobile() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(MOBILE_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

export type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Ctrl or ⌘ plus this key toggles the sidebar, except while typing. False turns it off. Defaults to "b". */
  keyboardShortcut?: string | false;
};

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  keyboardShortcut = "b",
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((current) => !current);
    else setOpen(!open);
  }, [isMobile, open, setOpen]);

  React.useEffect(() => {
    if (!keyboardShortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === keyboardShortcut && (event.metaKey || event.ctrlKey) && !isEditable(event.target)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboardShortcut, toggleSidebar]);

  const value = React.useMemo<SidebarContextValue>(
    () => ({ state: open ? "expanded" : "collapsed", open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }),
    [open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem", ...style } as React.CSSProperties}
        className={cn("group/sidebar-wrapper relative flex min-h-svh w-full has-data-[variant=inset]:bg-surface-subtle", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export type SidebarProps = Omit<React.ComponentProps<"nav">, "aria-label"> & {
  /** Names the navigation landmark. Defaults to "Main". */
  "aria-label"?: string;
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  /** Offcanvas slides away, icon shrinks to icons, none always stays open. Defaults to offcanvas. */
  collapsible?: "offcanvas" | "icon" | "none";
  /** Fills the SidebarProvider instead of the viewport, for a sidebar inside part of a page. */
  contained?: boolean;
};

export function Sidebar({
  "aria-label": ariaLabel = "Main",
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  contained = false,
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <nav
        aria-label={ariaLabel}
        data-slot="sidebar"
        className={cn("flex h-full w-(--sidebar-width) shrink-0 flex-col bg-surface-subtle text-text-default", className)}
        {...props}
      >
        {children}
      </nav>
    );
  }

  if (isMobile) {
    return (
      <SheetContent
        isOpen={openMobile}
        onOpenChange={setOpenMobile}
        side={side}
        className="min-h-dvh gap-0 bg-surface-subtle p-0 pt-8 text-text-default"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Choose where to go.</SheetDescription>
        </SheetHeader>
        <nav aria-label={ariaLabel} data-slot="sidebar" data-mobile="true" className={cn("flex w-full flex-1 flex-col", className)} {...props}>
          {children}
        </nav>
      </SheetContent>
    );
  }

  const spaced = variant === "floating" || variant === "inset";
  return (
    <div
      className="group/sidebar peer/sidebar hidden shrink-0 text-text-default md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative h-full w-(--sidebar-width) bg-transparent transition-[width] duration-(--gw-motion-duration-normal) ease-linear motion-reduce:transition-none",
          "group-data-[collapsible=offcanvas]/sidebar:w-0",
          spaced
            ? "group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+1rem)]"
            : "group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon)",
        )}
      />
      <nav
        aria-label={ariaLabel}
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          contained ? "absolute inset-y-0 h-full" : "fixed inset-y-0 h-svh",
          "z-10 hidden w-(--sidebar-width) transition-[left,right,width] duration-(--gw-motion-duration-normal) ease-linear motion-reduce:transition-none md:flex",
          "data-[side=left]:left-0 data-[side=right]:right-0",
          "data-[side=left]:group-data-[collapsible=offcanvas]/sidebar:left-[calc(var(--sidebar-width)*-1)]",
          "data-[side=right]:group-data-[collapsible=offcanvas]/sidebar:right-[calc(var(--sidebar-width)*-1)]",
          // Off-screen links must not stay in the tab order.
          "group-data-[collapsible=offcanvas]/sidebar:invisible",
          spaced
            ? "p-2 group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+1rem+2px)]"
            : "border-border-default group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon) group-data-[side=left]/sidebar:border-r group-data-[side=right]/sidebar:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-slot="sidebar-inner"
          className="flex size-full flex-col bg-surface-subtle group-data-[variant=floating]/sidebar:rounded-lg group-data-[variant=floating]/sidebar:border group-data-[variant=floating]/sidebar:border-border-default group-data-[variant=floating]/sidebar:shadow-sm"
        >
          {children}
        </div>
      </nav>
    </div>
  );
}

export function SidebarTrigger({ className, onPress, ...props }: ButtonProps) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="sm"
      aria-label="Toggle sidebar"
      aria-expanded={isMobile ? openMobile : open}
      className={cn("w-7 px-0", className)}
      onPress={(event) => {
        onPress?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon aria-hidden className="rtl:rotate-180" />
    </Button>
  );
}

/** A thin strip on the sidebar's edge that toggles it with the mouse. Keyboard users have SidebarTrigger. */
export function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-hidden="true"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-col-resize transition-all ease-linear after:absolute after:inset-y-0 after:start-1/2 after:w-0.5 hover:after:bg-border-input sm:flex",
        "group-data-[side=left]/sidebar:-right-4 group-data-[side=right]/sidebar:left-0",
        className,
      )}
      {...props}
    />
  );
}

export type SidebarInsetProps = React.HTMLAttributes<HTMLElement> & {
  /** Use "div" when the page already has a main landmark. Defaults to "main". */
  elementType?: "main" | "div";
};

export function SidebarInset({ className, elementType: Element = "main", ...props }: SidebarInsetProps) {
  return (
    <Element
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full min-w-0 flex-1 flex-col bg-surface-default",
        "md:peer-data-[variant=inset]/sidebar:m-2 md:peer-data-[variant=inset]/sidebar:ms-0 md:peer-data-[variant=inset]/sidebar:rounded-xl md:peer-data-[variant=inset]/sidebar:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarInput({ className, ...props }: InputProps) {
  return <Input data-slot="sidebar-input" className={cn("w-full", className)} {...props} />;
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
}

export function SidebarSeparator({ className, ...props }: SeparatorProps) {
  return <Separator data-slot="sidebar-separator" className={cn("mx-2 w-auto", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]/sidebar:overflow-hidden", className)}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />;
}

export type SidebarGroupLabelProps = React.HTMLAttributes<HTMLElement> & { elementType?: React.ElementType };

export function SidebarGroupLabel({ className, elementType: Element = "div", ...props }: SidebarGroupLabelProps) {
  return (
    <Element
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-text-secondary group-data-[collapsible=icon]/sidebar:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

const smallAction =
  "focus-ring absolute flex size-6 cursor-pointer items-center justify-center rounded-md p-0 text-text-default hover:bg-action-ghost-bg-hover group-data-[collapsible=icon]/sidebar:hidden [&>svg]:size-4 [&>svg]:shrink-0";

export type SidebarActionProps = Omit<ButtonPrimitiveProps, "className" | "style"> & { className?: string };

export function SidebarGroupAction({ className, ...props }: SidebarActionProps) {
  return <ButtonPrimitive data-slot="sidebar-group-action" className={cn(smallAction, "top-3 right-2", className)} {...props} />;
}

export function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-content" className={cn("w-full text-sm", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("flex w-full min-w-0 list-none flex-col gap-0 p-0", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={cn("group/menu-item relative", className)} {...props} />;
}

const menuButtonVariants = cva(
  [
    "focus-ring peer/menu-button flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-text-default no-underline",
    "transition-[width,height,padding] group-has-data-[slot=sidebar-menu-action]/menu-item:pe-8",
    "group-data-[collapsible=icon]/sidebar:size-8! group-data-[collapsible=icon]/sidebar:p-2!",
    "hover:bg-action-ghost-bg-hover data-pressed:bg-action-ghost-bg-hover data-[active=true]:bg-action-secondary-bg-hover data-[active=true]:font-medium",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  ],
  {
    variants: {
      variant: { default: "", outline: "border border-border-input bg-surface-default" },
      size: { sm: "h-7 text-xs", md: "h-8 text-body", lg: "h-12 text-body group-data-[collapsible=icon]/sidebar:p-0!" },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

type NavigationProps =
  | (Omit<LinkProps, "className" | "style" | "children"> & { href: string; children?: React.ReactNode })
  | (Omit<ButtonPrimitiveProps, "className" | "style" | "children"> & { href?: undefined; children?: React.ReactNode });

/** Renders a link with href, and a button without. isActive marks a link as the current page. */
function NavigationElement({
  isActive,
  className,
  ...props
}: NavigationProps & { isActive: boolean; className: string; "data-slot": string; "data-size": string }) {
  if (props.href !== undefined) {
    return <LinkPrimitive data-active={isActive} aria-current={isActive ? "page" : undefined} className={className} {...(props as LinkProps)} />;
  }
  return <ButtonPrimitive data-active={isActive} className={className} {...(props as ButtonPrimitiveProps)} />;
}

export type SidebarMenuButtonProps = NavigationProps & {
  isActive?: boolean;
  /** Defaults to default. */
  variant?: "default" | "outline";
  /** Defaults to md. */
  size?: "sm" | "md" | "lg";
  /** Shown when the sidebar is collapsed to icons. */
  tooltip?: string;
  className?: string;
};

export function SidebarMenuButton({ isActive = false, variant = "default", size = "md", tooltip, className, ...props }: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar();
  const element = (
    <NavigationElement
      data-slot="sidebar-menu-button"
      data-size={size}
      isActive={isActive}
      className={cn(menuButtonVariants({ variant, size }), className)}
      {...(props as NavigationProps)}
    />
  );
  if (!tooltip) return element;
  return (
    <Tooltip isDisabled={state !== "collapsed" || isMobile}>
      {element}
      <TooltipContent placement="right">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export type SidebarMenuActionProps = SidebarActionProps & {
  /** Only show it when the row is hovered or focused. */
  showOnHover?: boolean;
};

export function SidebarMenuAction({ className, showOnHover = false, ...props }: SidebarMenuActionProps) {
  return (
    <ButtonPrimitive
      data-slot="sidebar-menu-action"
      className={cn(
        smallAction,
        "top-1 right-1 peer-data-[size=lg]/menu-button:top-3 peer-data-[size=sm]/menu-button:top-0.5",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-pressed:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        "pointer-events-none absolute top-1.5 right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-text-default tabular-nums select-none group-data-[collapsible=icon]/sidebar:hidden peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1",
        className,
      )}
      {...props}
    />
  );
}

export type SidebarMenuSkeletonProps = React.ComponentProps<"div"> & {
  showIcon?: boolean;
  /** Width of the text placeholder. Defaults to 70%. */
  width?: string;
};

export function SidebarMenuSkeleton({ className, showIcon = false, width = "70%", ...props }: SidebarMenuSkeletonProps) {
  return (
    <div data-slot="sidebar-menu-skeleton" className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)} {...props}>
      {showIcon ? <Skeleton className="size-4 rounded-md" /> : null}
      <Skeleton className="h-4 flex-1" style={{ maxWidth: width }} />
    </div>
  );
}

export function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 list-none flex-col gap-1 border-s border-border-default px-2.5 py-0.5 group-data-[collapsible=icon]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-sub-item" className={cn("relative", className)} {...props} />;
}

export type SidebarMenuSubButtonProps = NavigationProps & {
  /** Defaults to md. */
  size?: "sm" | "md";
  isActive?: boolean;
  className?: string;
};

export function SidebarMenuSubButton({ size = "md", isActive = false, className, ...props }: SidebarMenuSubButtonProps) {
  return (
    <NavigationElement
      data-slot="sidebar-menu-sub-button"
      data-size={size}
      isActive={isActive}
      className={cn(
        "focus-ring flex h-7 w-full min-w-0 cursor-pointer items-center gap-2 overflow-hidden rounded-md px-2 text-text-default no-underline",
        "hover:bg-action-ghost-bg-hover data-[active=true]:bg-action-secondary-bg-hover data-[size=md]:text-sm data-[size=sm]:text-xs",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...(props as NavigationProps)}
    />
  );
}
