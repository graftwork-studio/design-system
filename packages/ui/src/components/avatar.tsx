"use client";

import * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Avatar { name; src; size: sm | md | lg }
 *
 * A person's photo, or their initials when there's no photo or it fails to
 * load. The name is the accessible text. If the name is already written next
 * to the avatar, pass decorative so it isn't read twice.
 */

const sizes = { sm: "size-6 text-xs", md: "size-8 text-sm", lg: "size-10 text-sm" } as const;

export type AvatarProps = {
  /** The person's name. Used for the alt text and the initials. */
  name: string;
  /** Photo URL. Falls back to initials if missing or broken. */
  src?: string;
  /** Defaults to md. */
  size?: keyof typeof sizes;
  /** Hide from assistive tech because the name is shown alongside. */
  decorative?: boolean;
  className?: string;
};

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = "md", decorative = false, className }: AvatarProps) {
  // Remember which src failed, so a new src gets a fresh try.
  const [failedSrc, setFailedSrc] = React.useState<string>();
  const showImage = src && failedSrc !== src;
  return (
    <span
      data-slot="avatar"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-subtle font-medium text-text-default select-none",
        sizes[size],
        className,
      )}
    >
      {showImage ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailedSrc(src)} />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </span>
  );
}

export type AvatarGroupProps = React.ComponentProps<"div"> & {
  /** Avatars beyond this number are summarised as "+N". */
  max?: number;
};

/** Overlapping avatars, e.g. the people on a project. */
export function AvatarGroup({ max, className, children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const extra = items.length - shown.length;
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex items-center -space-x-2 [&>*]:ring-2 [&>*]:ring-surface-default", className)}
      {...props}
    >
      {shown}
      {extra > 0 ? (
        <span
          role="img"
          aria-label={`${extra} more`}
          className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-sm font-medium text-text-default"
        >
          <span aria-hidden>+{extra}</span>
        </span>
      ) : null}
    </div>
  );
}
