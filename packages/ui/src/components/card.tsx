import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
 */

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border-default bg-surface-raised py-4 text-body text-text-default",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1 px-4", className)} {...props} />;
}

export type CardTitleProps = React.ComponentProps<"h2"> & {
  /** Heading level, so the card fits the page outline. Defaults to 2. */
  level?: 2 | 3 | 4;
};

export function CardTitle({ className, level = 2, ...props }: CardTitleProps) {
  const Heading = `h${level}` as const;
  return (
    <Heading
      data-slot="card-title"
      className={cn("text-md leading-heading font-medium text-text-default", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-sm text-text-secondary", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={cn("flex flex-wrap items-center gap-2 px-4", className)} {...props} />
  );
}
