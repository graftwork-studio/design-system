import { Separator as SeparatorPrimitive, type SeparatorProps as SeparatorPrimitiveProps } from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Separator { orientation: horizontal | vertical }
 */

export type SeparatorProps = Omit<SeparatorPrimitiveProps, "className" | "style"> & { className?: string };

export function Separator({ orientation = "horizontal", className, ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 border-0 bg-border-default",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
}
