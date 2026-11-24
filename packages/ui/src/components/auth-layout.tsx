import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Graftwork's own component, promoted from the app template's log-in and sign-up blocks.
 *
 * Figma contract: AuthLayout { layout: centered | split; background: default | muted; size: sm | lg;
 *                              showBrand; showFooter; showAside }
 *
 *   <AuthLayout brand={<Logo />} footer={<p>By continuing, you agree to…</p>}>
 *     <Card>…the form…</Card>
 *   </AuthLayout>
 *
 * It is the page's <main> landmark unless mainElement is "div". The form inside needs its own h1.
 */

export type AuthLayoutProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Centred on the page, or a form column beside an aside panel from the lg breakpoint. Defaults to centered. */
  layout?: "centered" | "split";
  /** The page background. Muted sets a card off from the page. Defaults to default. */
  background?: "default" | "muted";
  /** How wide the form area can grow: sm (24rem) or lg (56rem, for a card with an image beside the form). Defaults to sm. */
  size?: "sm" | "lg";
  /** Your logo or app name, above the form (centered) or top left (split). */
  brand?: React.ReactNode;
  /** Text under the form, such as the terms and privacy links. */
  footer?: React.ReactNode;
  /** The second column in the split layout, usually an image. Hidden below the lg breakpoint. */
  aside?: React.ReactNode;
  /** Use "div" when the page already has a main landmark. Defaults to "main". */
  mainElement?: "main" | "div";
  children: React.ReactNode;
};

const widths = { sm: "max-w-sm", lg: "max-w-sm md:max-w-4xl" } as const;

export function AuthLayout({
  layout = "centered",
  background = "default",
  size = "sm",
  brand,
  footer,
  aside,
  mainElement: Main = "main",
  children,
  className,
  ...props
}: AuthLayoutProps) {
  const surface = background === "muted" ? "bg-surface-subtle" : "bg-surface-default";
  const footerNode = footer ? <div className="px-6 text-center text-sm text-text-secondary">{footer}</div> : null;

  if (layout === "split") {
    return (
      <Main data-slot="auth-layout" data-layout="split" className={cn("grid min-h-svh lg:grid-cols-2", surface, className)} {...props}>
        <div className="flex flex-col gap-4 p-6 md:p-10">
          {brand ? <div className="flex justify-center md:justify-start">{brand}</div> : null}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className={cn("w-full", size === "lg" ? widths.lg : "max-w-xs")}>{children}</div>
            {footerNode}
          </div>
        </div>
        <div data-slot="auth-layout-aside" className="hidden bg-surface-subtle lg:flex">
          {aside}
        </div>
      </Main>
    );
  }

  return (
    <Main
      data-slot="auth-layout"
      data-layout="centered"
      className={cn("flex min-h-svh flex-col items-center justify-center p-6 md:p-10", surface, className)}
      {...props}
    >
      <div className={cn("flex w-full flex-col gap-6", widths[size])}>
        {brand ? <div className="flex justify-center">{brand}</div> : null}
        {children}
        {footerNode}
      </div>
    </Main>
  );
}
