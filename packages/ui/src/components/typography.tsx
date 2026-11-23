import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui's Typeset. Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Styles plain HTML inside it, such as rendered markdown or streamed chat.
 * Use it for content you don't control element by element.
 */

const variants = {
  default: "max-w-[80ch]",
  chat: "[--typeset-flow:1em] [--typeset-leading:1.6]",
  docs: "max-w-[80ch] [--typeset-flow:1.5em] [--typeset-size:1.0625em]",
} as const;

export type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  /** Chat is tighter, docs is roomier. Defaults to default. */
  variant?: keyof typeof variants;
  /** The wrapping element. Use "article" for a standalone page. Defaults to "div". */
  elementType?: "div" | "article" | "section";
};

export function Typography({ variant = "default", elementType: Element = "div", className, ...props }: TypographyProps) {
  return <Element data-slot="typography" data-variant={variant} className={cn("typeset min-w-0", variants[variant], className)} {...props} />;
}
