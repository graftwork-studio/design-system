"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import { Link } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { buttonVariants } from "./button.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Pagination { page; pageCount; siblingCount }
 *
 * Links to numbered pages. Give it a way to build each page's URL (getHref),
 * or handle onPageChange for client-side paging. The current page is marked
 * with aria-current="page" and a filled style.
 */

export type PaginationProps = {
  /** The current page, starting at 1. */
  page: number;
  pageCount: number;
  /** URL for a page. With it, each page is a real link. */
  getHref?: (page: number) => string;
  /** Called when a page is chosen. */
  onPageChange?: (page: number) => void;
  /** Pages shown either side of the current one. Defaults to 1. */
  siblingCount?: number;
  /** Names the navigation landmark. Defaults to "Pagination". */
  "aria-label"?: string;
  className?: string;
};

type Item = number | "gap-start" | "gap-end";

export function pageItems(page: number, pageCount: number, siblingCount = 1): Item[] {
  const first = Math.max(2, page - siblingCount);
  const last = Math.min(pageCount - 1, page + siblingCount);
  const items: Item[] = [1];
  if (first > 2) items.push("gap-start");
  for (let p = first; p <= last; p++) items.push(p);
  if (last < pageCount - 1) items.push("gap-end");
  if (pageCount > 1) items.push(pageCount);
  return items;
}

export function Pagination({
  page,
  pageCount,
  getHref,
  onPageChange,
  siblingCount = 1,
  "aria-label": label = "Pagination",
  className,
}: PaginationProps) {
  const link = (target: number, content: React.ReactNode, extra: { label?: string; disabled?: boolean; current?: boolean } = {}) => (
    <Link
      href={getHref?.(target)}
      onPress={() => onPageChange?.(target)}
      isDisabled={extra.disabled}
      aria-label={extra.label}
      aria-current={extra.current ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: extra.current ? "primary" : "ghost", size: "md" }),
        "min-w-8 px-1.5 no-underline",
        !extra.current && "text-text-default",
      )}
    >
      {content}
    </Link>
  );
  return (
    <nav aria-label={label} data-slot="pagination" className={cn("flex", className)}>
      <ul className="flex flex-wrap items-center gap-0.5">
        <li>
          {link(page - 1, <><ChevronLeftIcon aria-hidden /><span className="max-sm:sr-only">Previous</span></>, {
            label: "Previous page",
            disabled: page <= 1,
          })}
        </li>
        {pageItems(page, pageCount, siblingCount).map((item) =>
          typeof item === "number" ? (
            <li key={item}>{link(item, item, { label: `Page ${item}`, current: item === page })}</li>
          ) : (
            <li key={item} aria-hidden className="flex min-w-8 justify-center text-text-secondary">
              …
            </li>
          ),
        )}
        <li>
          {link(page + 1, <><span className="max-sm:sr-only">Next</span><ChevronRightIcon aria-hidden /></>, {
            label: "Next page",
            disabled: page >= pageCount,
          })}
        </li>
      </ul>
    </nav>
  );
}
