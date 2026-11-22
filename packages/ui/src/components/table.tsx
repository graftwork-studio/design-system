"use client";

import * as React from "react";
import {
  Cell as CellPrimitive,
  type CellProps,
  Column as ColumnPrimitive,
  type ColumnProps,
  Row as RowPrimitive,
  type RowProps,
  Table as TablePrimitive,
  TableBody as TableBodyPrimitive,
  type TableBodyProps,
  TableHeader as TableHeaderPrimitive,
  type TableHeaderProps,
  type TableProps as TablePrimitiveProps,
} from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: Table { density: comfortable | compact }
 *                 TableHeader, TableColumn, TableBody, TableRow, TableCell
 *
 * React Aria makes this a keyboard-navigable grid: arrow keys move between
 * cells. The wrapper scrolls horizontally on narrow screens, which WCAG 1.4.10
 * allows for data tables; the page itself never scrolls sideways.
 */

export type TableDensity = "comfortable" | "compact";

const DensityContext = React.createContext<TableDensity>("comfortable");

export type TableProps = Omit<TablePrimitiveProps, "className" | "style"> & {
  /** Row spacing. Compact rows are for dense data grids. Defaults to comfortable. */
  density?: TableDensity;
  className?: string;
};

export function Table({ className, density = "comfortable", ...props }: TableProps) {
  return (
    <DensityContext.Provider value={density}>
      <div data-slot="table-container" className="w-full overflow-x-auto rounded-lg border border-border-default">
        <TablePrimitive
          data-slot="table"
          data-density={density}
          className={cn("w-full border-collapse text-left text-body text-text-default", className)}
          {...props}
        />
      </div>
    </DensityContext.Provider>
  );
}

export function TableHeader<T extends object>({ className, ...props }: TableHeaderProps<T>) {
  return (
    <TableHeaderPrimitive
      data-slot="table-header"
      className={cn("border-b border-border-default bg-surface-subtle", className)}
      {...props}
    />
  );
}

function cellPadding(density: TableDensity) {
  return density === "compact" ? "px-2 py-1 text-sm" : "p-2";
}

export function TableColumn({ className, ...props }: Omit<ColumnProps, "className"> & { className?: string }) {
  const density = React.useContext(DensityContext);
  return (
    <ColumnPrimitive
      data-slot="table-column"
      className={cn(
        "text-sm font-medium outline-none whitespace-nowrap text-text-default",
        "data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring",
        cellPadding(density),
        className,
      )}
      {...props}
    />
  );
}

export function TableBody<T extends object>({ className, ...props }: TableBodyProps<T>) {
  return <TableBodyPrimitive data-slot="table-body" className={cn(className)} {...props} />;
}

export function TableRow<T extends object>({ className, ...props }: Omit<RowProps<T>, "className"> & { className?: string }) {
  return (
    <RowPrimitive
      data-slot="table-row"
      className={cn(
        "border-b border-border-default last:border-b-0 hover:bg-surface-subtle",
        "outline-none data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: Omit<CellProps, "className"> & { className?: string }) {
  const density = React.useContext(DensityContext);
  return (
    <CellPrimitive
      data-slot="table-cell"
      className={cn(
        "align-middle outline-none",
        "data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus-ring",
        cellPadding(density),
        className,
      )}
      {...props}
    />
  );
}
