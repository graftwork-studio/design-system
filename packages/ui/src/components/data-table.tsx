"use client";

import {
  type ColumnDef,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, GripVerticalIcon, SearchIcon, Settings2Icon } from "lucide-react";
import * as React from "react";
import { DropIndicator, type Key, type Selection, type SortDescriptor, useDragAndDrop } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu.js";
import { InputGroup } from "./input-group.js";
import { Pagination } from "./pagination.js";
import { Table, TableBody, TableCell, TableColumn, type TableDensity, TableHeader, TableRow } from "./table.js";

/*
 * Adapted from shadcn/ui's data table guide. Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * TanStack Table handles filtering, sorting and paging. React Aria handles the
 * keyboard grid, selection and row reordering (drag and drop, with keyboard
 * reordering and screen reader announcements). Columns are TanStack column
 * definitions.
 */

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

export type DataTableFeatures = typeof features;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each column has its own value type.
export type DataTableColumn<T extends RowData> = ColumnDef<DataTableFeatures, T, any>;

export type DataTableProps<T extends RowData> = {
  /** Names the table for screen readers. Required. */
  "aria-label": string;
  columns: DataTableColumn<T>[];
  data: T[];
  /** A stable, unique id for each row. */
  getRowId: (row: T) => string;
  /** The column the search box filters. Leave out to hide the search box. */
  filterColumn?: string;
  /** Visible label for the search box. Defaults to "Filter". */
  filterLabel?: string;
  /** Rows per page. Defaults to 10. */
  pageSize?: number;
  /** Multiple adds a checkbox to each row. Defaults to none. */
  selectionMode?: "none" | "multiple";
  /** Called with the selected row ids. */
  onSelectionChange?: (ids: string[]) => void;
  /** Show the menu for hiding columns. Defaults to true. */
  showColumnToggle?: boolean;
  /**
   * Turns on row reordering: adds a drag handle to each row. Called with every
   * row id in `data`, in the new order. Columns can't be sorted while this is
   * set, because a sorted table has no order of its own.
   */
  onReorder?: (ids: string[]) => void;
  /** Defaults to comfortable. */
  density?: TableDensity;
  /** Shown when no rows match. Defaults to "No results". */
  emptyMessage?: string;
  className?: string;
};

function columnLabel(header: unknown, id: string) {
  return typeof header === "string" ? header : id;
}

/** Moves `keys` before or after `target`, keeping their order from `ids`. */
export function reorderIds(ids: string[], keys: Set<Key>, target: Key, position: "before" | "after" | "on") {
  const moving = ids.filter((id) => keys.has(id));
  const rest = ids.filter((id) => !keys.has(id));
  const index = rest.indexOf(String(target));
  if (index === -1) return ids;
  rest.splice(position === "after" ? index + 1 : index, 0, ...moving);
  return rest;
}

function cellText(value: unknown, fallback: string) {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

export function DataTable<T extends RowData>({
  "aria-label": ariaLabel,
  columns,
  data,
  getRowId,
  filterColumn,
  filterLabel = "Filter",
  pageSize = 10,
  selectionMode = "none",
  onSelectionChange,
  showColumnToggle = true,
  onReorder,
  density = "comfortable",
  emptyMessage = "No results",
  className,
}: DataTableProps<T>) {
  const [selected, setSelected] = React.useState<Set<Key>>(new Set());

  const table = useTable({
    features,
    data,
    columns,
    getRowId,
    autoResetPageIndex: false,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });
  const { sorting, columnFilters, columnVisibility, pagination } = table.state;

  const filter = filterColumn ? table.getColumn(filterColumn) : undefined;
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(1, Math.ceil(filteredCount / pagination.pageSize));
  const page = Math.min(pagination.pageIndex + 1, pageCount);
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide());
  const sortDescriptor: SortDescriptor | undefined = sorting[0]
    ? { column: sorting[0].id, direction: sorting[0].desc ? "descending" : "ascending" }
    : undefined;

  const reorderable = Boolean(onReorder);
  const rowText = (id: Key) => {
    const row = table.getRowModel().rowsById[String(id)];
    return row ? cellText(row.getVisibleCells()[0]?.getValue(), row.id) : String(id);
  };
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": rowText(key) })),
    onReorder: (event) => {
      onReorder?.(reorderIds(data.map(getRowId), event.keys, event.target.key, event.target.dropPosition));
    },
    renderDropIndicator: (target) => (
      <DropIndicator
        target={target}
        className="data-drop-target:outline-2 data-drop-target:outline-solid data-drop-target:outline-focus-ring"
      />
    ),
  });

  const updateSelection = (keys: Selection) => {
    const next = keys === "all" ? new Set<Key>(table.getFilteredRowModel().rows.map((row) => row.id)) : new Set<Key>(keys);
    setSelected(next);
    onSelectionChange?.([...next].map(String));
  };

  return (
    <div data-slot="data-table" className={cn("flex min-w-0 flex-col gap-3", className)}>
      {filter || showColumnToggle ? (
        <div className="flex flex-wrap items-end justify-between gap-2">
          {filter ? (
            <InputGroup
              label={filterLabel}
              startAddon={<SearchIcon aria-hidden />}
              value={String(columnFilters.find((entry) => entry.id === filterColumn)?.value ?? "")}
              onChange={(value) => {
                filter.setFilterValue(value);
                table.setPageIndex(0);
              }}
              className="w-full max-w-xs"
            />
          ) : (
            <span />
          )}
          {showColumnToggle && hideable.length > 0 ? (
            <DropdownMenu>
              <Button variant="secondary">
                <Settings2Icon aria-hidden />
                Columns
              </Button>
              <DropdownMenuContent
                aria-label="Show or hide columns"
                placement="bottom end"
                selectionMode="multiple"
                selectedKeys={hideable.filter((column) => columnVisibility[column.id] !== false).map((column) => column.id)}
                onSelectionChange={(keys) =>
                  table.setColumnVisibility(Object.fromEntries(hideable.map((column) => [column.id, keys === "all" || keys.has(column.id)])))
                }
              >
                {hideable.map((column) => (
                  <DropdownMenuItem key={column.id} id={column.id}>
                    {columnLabel(column.columnDef.header, column.id)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      ) : null}
      <Table
        aria-label={ariaLabel}
        density={density}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) => {
          table.setSorting([{ id: String(descriptor.column), desc: descriptor.direction === "descending" }]);
          table.setPageIndex(0);
        }}
        selectionMode={selectionMode}
        selectionBehavior="toggle"
        selectedKeys={selected}
        onSelectionChange={updateSelection}
        dragAndDropHooks={reorderable ? dragAndDropHooks : undefined}
      >
        <TableHeader>
          {reorderable ? (
            <TableColumn id="__drag" className="w-8">
              <span className="sr-only">Reorder</span>
            </TableColumn>
          ) : null}
          {selectionMode === "multiple" ? (
            <TableColumn id="__select" className="w-8">
              <Checkbox slot="selection">{null}</Checkbox>
            </TableColumn>
          ) : null}
          {headers.map((header, index) => {
            const canSort = header.column.getCanSort() && !reorderable;
            return (
              <TableColumn
                key={header.id}
                id={header.column.id}
                isRowHeader={index === 0}
                allowsSorting={canSort}
                className={canSort ? "cursor-pointer hover:bg-action-ghost-bg-hover" : undefined}
              >
                {({ sortDirection }) => (
                  <span className="inline-flex items-center gap-1">
                    <table.FlexRender header={header} />
                    {canSort ? (
                      sortDirection === "ascending" ? (
                        <ArrowUpIcon aria-hidden className="size-3.5 text-icon-default" />
                      ) : sortDirection === "descending" ? (
                        <ArrowDownIcon aria-hidden className="size-3.5 text-icon-default" />
                      ) : (
                        <ChevronsUpDownIcon aria-hidden className="size-3.5 text-icon-default" />
                      )
                    ) : null}
                  </span>
                )}
              </TableColumn>
            );
          })}
        </TableHeader>
        <TableBody renderEmptyState={() => <p className="p-6 text-center text-sm text-text-secondary">{emptyMessage}</p>}>
          {rows.map((row) => (
            <TableRow key={row.id} id={row.id} textValue={reorderable ? rowText(row.id) : undefined}>
              {reorderable ? (
                <TableCell>
                  <Button slot="drag" variant="ghost" size="sm" className="size-7 cursor-grab px-0 text-icon-default">
                    <GripVerticalIcon aria-hidden />
                  </Button>
                </TableCell>
              ) : null}
              {selectionMode === "multiple" ? (
                <TableCell>
                  <Checkbox slot="selection">{null}</Checkbox>
                </TableCell>
              ) : null}
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm text-text-secondary">
          {selectionMode === "multiple" ? `${selected.size} of ${data.length} selected` : `${filteredCount} ${filteredCount === 1 ? "row" : "rows"}`}
        </p>
        {pageCount > 1 ? (
          <Pagination
            aria-label={`${ariaLabel} pages`}
            page={page}
            pageCount={pageCount}
            onPageChange={(next) => table.setPageIndex(next - 1)}
          />
        ) : null}
      </div>
    </div>
  );
}
