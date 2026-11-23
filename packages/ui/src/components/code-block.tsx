"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { Button, type ButtonProps } from "./button.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Shows code, terminal output and diffs. There's no syntax highlighting built
 * in: pass highlighted spans as children if you need it.
 */

export type CodeBlockProps = React.ComponentProps<"div"> & {
  /** Destructive is for error output. Defaults to default. */
  variant?: "default" | "destructive";
  /** Defaults to md. */
  size?: "md" | "sm";
};

export function CodeBlock({ className, variant = "default", size = "md", ...props }: CodeBlockProps) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-surface-subtle text-sm data-[size=sm]:text-xs",
        variant === "destructive" ? "border-border-status-error text-text-error" : "border-border-input text-text-default",
        className,
      )}
      {...props}
    />
  );
}

export function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn("flex min-w-0 shrink-0 items-center gap-2 px-3 pt-2 text-text-secondary group-data-[size=sm]/code-block:px-2.5", className)}
      {...props}
    />
  );
}

export function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "flex min-w-0 items-center gap-1.5 truncate font-sans text-sm font-medium text-text-default group-data-[size=sm]/code-block:text-xs group-data-[variant=destructive]/code-block:text-text-error [&_svg]:size-3.5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function CodeBlockActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-1 [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-2 [[data-slot=code-block]>&]:top-2 [[data-slot=code-block]>&]:z-10", className)}
      {...props}
    />
  );
}

export type CodeBlockCopyButtonProps = Omit<ButtonProps, "children"> & {
  /** The text to copy. */
  value: string;
};

export function CodeBlockCopyButton({ value, variant = "ghost", size = "sm", className, onPress, ...props }: CodeBlockCopyButtonProps) {
  const [status, setStatus] = React.useState<"idle" | "copied" | "failed">("idle");

  React.useEffect(() => {
    if (status === "idle") return;
    const timeout = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copied={status === "copied" || undefined}
        variant={variant}
        size={size}
        aria-label="Copy code"
        className={cn("size-7 bg-surface-default px-0", className)}
        onPress={(event) => {
          onPress?.(event);
          navigator.clipboard.writeText(value).then(
            () => setStatus("copied"),
            () => setStatus("failed"),
          );
        }}
        {...props}
      >
        {status === "copied" ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
      </Button>
      <span aria-live="polite" className="sr-only">
        {status === "copied" ? "Copied" : status === "failed" ? "Couldn't copy" : ""}
      </span>
    </>
  );
}

export type CodeBlockContentProps = React.ComponentProps<"pre"> & {
  /** Wrap long lines instead of scrolling sideways. */
  wrap?: boolean;
  /** Show line numbers. */
  lineNumbers?: boolean;
  /** The first line number. Defaults to 1. */
  startLine?: number;
  /** Says what the code is, because the region is focusable. Defaults to "Code". */
  "aria-label"?: string;
};

export function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  "aria-label": ariaLabel = "Code",
  ...props
}: CodeBlockContentProps) {
  return (
    <pre
      role="region"
      aria-label={ariaLabel}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users need to scroll long lines (WCAG 2.1.1).
      tabIndex={0}
      dir="ltr"
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      style={{ counterReset: `line ${startLine - 1}`, ...style }}
      className={cn(
        "focus-ring min-h-0 min-w-0 overflow-auto rounded-[inherit] px-3 py-3 text-start font-mono leading-relaxed [scrollbar-color:var(--gw-color-border-input)_transparent] [scrollbar-width:thin]",
        "focus-visible:-outline-offset-2! group-has-data-[slot=code-block-header]/code-block:pt-2 group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:py-2.5",
        "data-wrap:wrap-break-word data-wrap:whitespace-pre-wrap",
        className,
      )}
      {...props}
    >
      <code data-slot="code-block-code" className="grid min-w-max content-start in-data-numbered:grid-cols-[auto_1fr] in-data-wrap:min-w-0">
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => <CodeBlockLine key={index}>{line}</CodeBlockLine>)
          : children}
      </code>
    </pre>
  );
}

const lineVariants = {
  default: "",
  added: "bg-status-success-bg after:content-['+']",
  removed: "bg-status-error-bg after:text-text-error after:content-['−']",
  highlighted: "bg-action-secondary-bg-hover",
} as const;

const lineLabels = { default: null, added: "Added: ", removed: "Removed: ", highlighted: null } as const;

export type CodeBlockLineProps = React.ComponentProps<"span"> & {
  /** Added and removed lines show + and −, so colour is never the only cue. Defaults to default. */
  variant?: keyof typeof lineVariants;
};

export function CodeBlockLine({ className, variant = "default", children, ...props }: CodeBlockLineProps) {
  const isEmpty = children === undefined || children === null || children === "";
  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(
        "relative -mx-3 block min-h-lh px-3 group-data-[size=sm]/code-block:-mx-2.5 group-data-[size=sm]/code-block:px-2.5",
        "after:absolute after:start-1 after:top-0 after:text-text-secondary after:select-none",
        "before:min-w-6 before:text-end before:text-text-secondary in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid in-data-numbered:gap-x-3 in-data-numbered:[counter-increment:line] in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none",
        lineVariants[variant],
        className,
      )}
      {...props}
    >
      <span data-slot="code-block-line-content" className="min-w-0">
        {lineLabels[variant] ? <span className="sr-only">{lineLabels[variant]}</span> : null}
        {isEmpty ? "\n" : children}
      </span>
    </span>
  );
}

export function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn("flex min-w-0 shrink-0 items-center gap-2 px-3 pb-2 text-xs text-text-secondary group-data-[size=sm]/code-block:px-2.5", className)}
      {...props}
    />
  );
}
