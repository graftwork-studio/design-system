"use client";

import type * as React from "react";
import { cn } from "../lib/utils.js";
import { Separator } from "./separator.js";
import { SidebarInset, SidebarProvider, type SidebarProviderProps, SidebarTrigger } from "./sidebar.js";

/*
 * Graftwork's own component, promoted from the app template's sidebar blocks.
 *
 * Figma contract: AppShell { variant: sidebar | floating | inset; state: expanded | collapsed;
 *                            showSidebarEnd } · AppShellHeader { showActions }
 *
 *   <AppShell sidebar={<Sidebar>…</Sidebar>}>
 *     <AppShellHeader actions={<Button>Share</Button>}>
 *       <Breadcrumb>…</Breadcrumb>
 *     </AppShellHeader>
 *     <AppShellContent>…</AppShellContent>
 *   </AppShell>
 *
 * The main area is the page's <main> landmark. The header is sticky, and the
 * scroll-padding tokens keep focused elements clear of it.
 */

export type AppShellProps = Omit<SidebarProviderProps, "children"> & {
  /** The main navigation: a <Sidebar>. Its variant and side are set on the Sidebar. */
  sidebar?: React.ReactNode;
  /** A second sidebar after the main area, such as a table of contents: a <Sidebar side="right">. */
  sidebarEnd?: React.ReactNode;
  /** Use "div" when the page already has a main landmark, for example inside a dialog. Defaults to "main". */
  mainElement?: "main" | "div";
  children: React.ReactNode;
};

export function AppShell({ sidebar, sidebarEnd, mainElement = "main", children, ...props }: AppShellProps) {
  return (
    <SidebarProvider {...props}>
      {sidebar}
      <SidebarInset elementType={mainElement}>{children}</SidebarInset>
      {sidebarEnd}
    </SidebarProvider>
  );
}

export type AppShellHeaderProps = Omit<React.ComponentProps<"header">, "children"> & {
  /** What the page is: usually a <Breadcrumb>, or a page title. */
  children?: React.ReactNode;
  /** Buttons and menus at the end of the header. */
  actions?: React.ReactNode;
  /** Show the button that opens and closes the sidebar. Defaults to true. */
  showTrigger?: boolean;
  /** Keep the header at the top while the page scrolls. Defaults to true. */
  sticky?: boolean;
};

export function AppShellHeader({ children, actions, showTrigger = true, sticky = true, className, ...props }: AppShellHeaderProps) {
  return (
    <header
      data-slot="app-shell-header"
      className={cn(
        "flex h-16 shrink-0 items-center gap-2 border-b border-border-default bg-surface-default px-4",
        sticky && "sticky top-0 z-10",
        className,
      )}
      {...props}
    >
      {showTrigger ? (
        <>
          <SidebarTrigger />
          <Separator orientation="vertical" className="me-2 h-4 self-center" />
        </>
      ) : null}
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AppShellContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-shell-content" className={cn("flex flex-1 flex-col gap-4 p-4", className)} {...props} />;
}
