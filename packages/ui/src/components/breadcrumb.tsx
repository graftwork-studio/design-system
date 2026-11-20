"use client";

import { ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import {
  Breadcrumb as BreadcrumbPrimitive,
  type BreadcrumbProps as BreadcrumbPrimitiveProps,
  Breadcrumbs,
  type BreadcrumbsProps,
  Link,
  type LinkProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Breadcrumb { aria-label }, BreadcrumbItem { href; children }
 *
 *   <Breadcrumb>
 *     <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *     <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
 *     <BreadcrumbItem>Atlas</BreadcrumbItem>
 *   </Breadcrumb>
 *
 * The last item is the current page: it's not a link and has aria-current="page".
 */

export type BreadcrumbProps<T extends object> = Omit<BreadcrumbsProps<T>, "className" | "style"> & {
  /** Names the navigation landmark. Defaults to "Breadcrumb". */
  "aria-label"?: string;
  className?: string;
};

export function Breadcrumb<T extends object>({ "aria-label": label = "Breadcrumb", className, ...props }: BreadcrumbProps<T>) {
  return (
    <nav aria-label={label} data-slot="breadcrumb">
      <Breadcrumbs className={cn("flex flex-wrap items-center gap-1 text-body text-text-secondary", className)} {...props} />
    </nav>
  );
}

export type BreadcrumbItemProps = Omit<BreadcrumbPrimitiveProps, "className" | "style" | "children"> & {
  /** Where the crumb links to. Leave it out on the current page. */
  href?: LinkProps["href"];
  children: React.ReactNode;
  className?: string;
};

export function BreadcrumbItem({ href, children, className, ...props }: BreadcrumbItemProps) {
  return (
    <BreadcrumbPrimitive data-slot="breadcrumb-item" className={cn("group/crumb flex items-center gap-1", className)} {...props}>
      <Link
        href={href}
        className={cn(
          "focus-ring rounded-sm py-1",
          "data-[current]:font-medium data-[current]:text-text-default data-[current]:no-underline",
          "not-data-[current]:text-text-link not-data-[current]:underline not-data-[current]:underline-offset-[0.15em]",
          "not-data-[current]:hover:decoration-2",
        )}
      >
        {children}
      </Link>
      <ChevronRightIcon aria-hidden className="size-4 text-icon-default group-last/crumb:hidden" />
    </BreadcrumbPrimitive>
  );
}
