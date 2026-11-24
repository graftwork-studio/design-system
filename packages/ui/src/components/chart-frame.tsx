"use client";

import { TableIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import type { ChartConfig } from "./chart.js";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "./table.js";

/*
 * Internal: the parts every Graftwork chart shares. Not exported from the package.
 *
 * - a heading and a written summary, always visible
 * - a "View as table" toggle, one action away, showing the same data as the chart
 * - a legend
 * - the table view
 */

export type ChartSeries = {
  /** Key in each data row. */
  key: string;
  /** Human-readable name, used in the legend and table header. */
  label: string;
};

export type ChartView = "chart" | "table";

/** The props every chart shares. */
export type ChartBaseProps = {
  /** Chart heading. */
  title: string;
  /** One or two sentences saying what the chart shows. Required. */
  summary: string;
  data: ReadonlyArray<Record<string, string | number>>;
  /** Key in each data row for the category axis. */
  categoryKey: string;
  /** Up to four series. */
  series: readonly ChartSeries[];
  /** Formats values in labels, tooltips and the table. */
  formatValue?: (value: number) => string;
  /** Which view shows first. Defaults to chart. */
  defaultView?: ChartView;
  /** Heading level for the title. Defaults to 2. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

export const SERIES_COLOURS = [
  "var(--gw-color-chart-series-1)",
  "var(--gw-color-chart-series-2)",
  "var(--gw-color-chart-series-3)",
  "var(--gw-color-chart-series-4)",
] as const;

/** smooth follows the data without overshooting it (Recharts' monotone curve). */
export type ChartCurve = "smooth" | "linear" | "step";

export const CURVE_TYPES = { smooth: "monotone", linear: "linear", step: "step" } as const satisfies Record<ChartCurve, string>;

export const defaultFormatValue = (value: number) => value.toLocaleString();

export function seriesColour(index: number): string {
  return SERIES_COLOURS[index] ?? SERIES_COLOURS[0];
}

export function chartConfig(series: readonly ChartSeries[]): ChartConfig {
  return Object.fromEntries(series.map((s, i) => [s.key, { label: s.label, color: seriesColour(i) }]));
}

export type ChartFrameIds = {
  /** Unique per chart, safe for SVG ids. */
  uid: string;
  titleId: string;
  summaryId: string;
};

type ChartFrameProps = Omit<ChartBaseProps, "formatValue"> & {
  /** Component name, for data-slot and errors, such as "BarChart". */
  name: string;
  formatValue: (value: number) => string;
  /** Icon on the "View as chart" button. */
  chartIcon: React.ComponentType<{ "aria-hidden"?: boolean }>;
  /** The legend key for one series. */
  renderSwatch: (index: number, ids: ChartFrameIds) => React.ReactNode;
  /** Anything rendered before the chart region, such as SVG definitions. */
  renderDefs?: (ids: ChartFrameIds) => React.ReactNode;
  /** The Recharts chart. */
  renderChart: (ids: ChartFrameIds) => React.ReactNode;
  /** Legend entries, when they aren't the series (such as one per category). */
  legend?: readonly ChartSeries[];
  /** A category value whose table row is marked "(highlighted)". */
  highlight?: string;
  /** When the data can't be charted: why. The table shows instead, with this note and no toggle. */
  tableOnly?: string;
};

export function ChartFrame({
  name,
  title,
  summary,
  data,
  categoryKey,
  series,
  formatValue,
  defaultView = "chart",
  headingLevel = 2,
  className,
  chartIcon: ChartIcon,
  renderSwatch,
  renderDefs,
  renderChart,
  legend = series,
  highlight,
  tableOnly,
}: ChartFrameProps) {
  const [chosenView, setView] = React.useState<ChartView>(defaultView);
  const view = tableOnly === undefined ? chosenView : "table";
  const uid = React.useId().replace(/:/g, "");
  if (series.length > SERIES_COLOURS.length) {
    throw new Error(`${name} supports up to ${SERIES_COLOURS.length} series.`);
  }
  const Heading = `h${headingLevel}` as const;
  const ids: ChartFrameIds = { uid, titleId: `${uid}-title`, summaryId: `${uid}-summary` };
  const regionId = `${uid}-region`;
  const slot = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  return (
    <figure
      data-slot={slot}
      data-view={view}
      aria-labelledby={ids.titleId}
      aria-describedby={ids.summaryId}
      className={cn("flex min-w-0 flex-col gap-3", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading id={ids.titleId} className="text-md leading-heading font-medium text-text-default">
            {title}
          </Heading>
          <p id={ids.summaryId} className="max-w-[80ch] text-sm text-text-secondary">
            {summary}
          </p>
        </div>
        {tableOnly === undefined ? (
          <Button
            variant="secondary"
            size="sm"
            aria-controls={regionId}
            onPress={() => setView(view === "chart" ? "table" : "chart")}
          >
            {view === "chart" ? <TableIcon aria-hidden /> : <ChartIcon aria-hidden />}
            {view === "chart" ? "View as table" : "View as chart"}
          </Button>
        ) : null}
      </div>

      {renderDefs?.(ids)}

      <div id={regionId}>
        {view === "chart" ? (
          <div className="flex flex-col gap-3">
            <ul aria-hidden className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-default">
              {legend.map((s, i) => (
                <li key={s.key} className="flex items-center gap-1">
                  {renderSwatch(i, ids)}
                  {s.label}
                </li>
              ))}
            </ul>
            {renderChart(ids)}
          </div>
        ) : (
          <>
            {tableOnly !== undefined ? <p className="mb-3 max-w-[80ch] text-sm text-text-secondary">{tableOnly}</p> : null}
            <Table aria-labelledby={ids.titleId}>
              <TableHeader>
                <TableColumn isRowHeader>{categoryKey === "" ? "Category" : labelFor(categoryKey)}</TableColumn>
                {series.map((s) => (
                  <TableColumn key={s.key} className="text-right">
                    {s.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={`${String(row[categoryKey])}-${rowIndex}`}>
                    <TableCell>
                      {String(row[categoryKey])}
                      {highlight !== undefined && String(row[categoryKey]) === highlight ? " (highlighted)" : null}
                    </TableCell>
                    {series.map((s) => {
                      const value = row[s.key];
                      return (
                        <TableCell key={s.key} className="text-right tabular-nums">
                          {typeof value === "number" ? formatValue(value) : String(value ?? "")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </figure>
  );
}

/** Formats a value label, which Recharts passes as unknown. */
export function formatLabel(formatValue: (value: number) => string) {
  return (value: unknown) => (typeof value === "number" ? formatValue(value) : String(value ?? ""));
}

/** "monthName" → "Month name" for the category column header. */
function labelFor(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
