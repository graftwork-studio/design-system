import type * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Empty { icon; title; description; action }
 *
 * What to show when there's nothing to show yet: say why, and what to do next.
 */

export type EmptyProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** A decorative icon. It's hidden from assistive tech. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Usually one Button. */
  action?: React.ReactNode;
  /** Heading level of the title. Defaults to 2. */
  level?: 2 | 3 | 4;
};

export function Empty({ icon, title, description, action, level = 2, className, ...props }: EmptyProps) {
  const Heading = `h${level}` as const;
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border-default px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full bg-surface-subtle text-icon-default [&_svg]:size-6"
        >
          {icon}
        </span>
      ) : null}
      <div className="flex max-w-sm flex-col gap-1">
        <Heading className="text-lg leading-heading font-semibold text-text-default">{title}</Heading>
        {description ? <p className="text-body text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
