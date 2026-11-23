"use client";

import { cva } from "class-variance-authority";
import * as React from "react";
import { Link as LinkPrimitive, type LinkProps } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Separator, type SeparatorProps } from "./separator.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Item { variant: default | outline | muted; size: md | sm | xs }, ItemGroup, ItemSeparator,
 *                 ItemMedia { variant: default | icon | image }, ItemContent, ItemTitle, ItemDescription,
 *                 ItemActions, ItemHeader, ItemFooter
 *
 * A row with media, a title, a description and actions. Pass href to make the
 * whole row a link. Don't put buttons inside a linked row.
 */

/** A list of items. Each child becomes a list item. */
export function ItemGroup({ className, children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="item-group" className={cn("flex w-full list-none flex-col gap-2 p-0", className)} {...props}>
      {React.Children.toArray(children).map((child, index) => (
        <li key={React.isValidElement(child) && child.key != null ? child.key : index}>{child}</li>
      ))}
    </ul>
  );
}

export function ItemSeparator({ className, ...props }: SeparatorProps) {
  return <Separator data-slot="item-separator" orientation="horizontal" className={cn("my-2", className)} {...props} />;
}

const itemVariants = cva("group/item flex w-full flex-wrap items-center rounded-lg border text-body text-text-default transition-colors", {
  variants: {
    variant: {
      default: "border-transparent",
      outline: "border-border-default",
      muted: "border-transparent bg-surface-subtle",
    },
    size: {
      md: "gap-2.5 px-3 py-2.5",
      sm: "gap-2.5 px-3 py-2",
      xs: "gap-2 px-2.5 py-1.5",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export type ItemProps = Omit<React.ComponentProps<"div">, "className"> & {
  /** Defaults to default. */
  variant?: "default" | "outline" | "muted";
  /** Defaults to md. */
  size?: "md" | "sm" | "xs";
  className?: string;
  /** Makes the whole row a link. */
  href?: string;
  target?: string;
  rel?: string;
};

export function Item({ className, variant = "default", size = "md", href, target, rel, ...props }: ItemProps) {
  const shared = { "data-slot": "item", "data-variant": variant, "data-size": size };
  if (href !== undefined) {
    return (
      <LinkPrimitive
        {...shared}
        href={href}
        target={target}
        rel={rel}
        className={cn(itemVariants({ variant, size }), "focus-ring cursor-pointer no-underline hover:bg-action-ghost-bg-hover", className)}
        {...(props as Omit<LinkProps, "className" | "href">)}
      />
    );
  }
  return <div {...shared} className={cn(itemVariants({ variant, size }), className)} {...props} />;
}

const mediaVariants = {
  default: "bg-transparent",
  icon: "text-icon-default [&_svg]:size-4",
  image: "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
} as const;

export type ItemMediaProps = React.ComponentProps<"div"> & { variant?: keyof typeof mediaVariants };

export function ItemMedia({ className, variant = "default", ...props }: ItemMediaProps) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start",
        mediaVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-content" className={cn("flex min-w-0 flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0", className)} {...props} />;
}

export function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-title" className={cn("line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium", className)} {...props} />;
}

export function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("line-clamp-2 text-sm font-normal text-text-secondary group-data-[size=xs]/item:text-xs", className)}
      {...props}
    />
  );
}

export function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex items-center gap-2", className)} {...props} />;
}

export function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-header" className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />;
}

export function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-footer" className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />;
}
