"use client";

import { ChartColumnIcon, TableIcon } from "lucide-react";
import * as React from "react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart.js";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "./table.js";

/*
 * Figma contract: BarChart { view: chart | table }
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows the same data in a keyboard-navigable table
 * - each series has its own pattern and every bar has a direct value label,
 *   so colour is never the only way to tell series apart
 */

export type BarChartSeries = {
  /** Key in each data row. */
  key: string;
  /** Human-readable name, used in the legend and table header. */
  label: string;
};

export type BarChartView = "chart" | "table";

export type BarChartProps = {
  /** Chart heading. */
  title: string;
  /** One or two sentences saying what the chart shows. Required. */
  summary: string;
  data: ReadonlyArray<Record<string, string | number>>;
  /** Key in each data row for the category axis. */
  categoryKey: string;
  /** Up to four series. */
  series: readonly BarChartSeries[];
  /** Formats values in labels, tooltips and the table. */
  formatValue?: (value: number) => string;
  /** Which view shows first. Defaults to chart. */
  defaultView?: BarChartView;
  /** Heading level for the title. Defaults to 2. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

const SERIES_COLOURS = [
  "var(--gw-color-chart-series-1)",
  "var(--gw-color-chart-series-2)",
  "var(--gw-color-chart-series-3)",
  "var(--gw-color-chart-series-4)",
] as const;

/** One pattern per series: solid, diagonal stripes, dots, cross-hatch. */
function SeriesPattern({ id, index, colour }: { id: string; index: number; colour: string }) {
  const mark = "var(--gw-color-surface-raised)";
  return (
    <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill={colour} />
      {index === 1 ? <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke={mark} strokeWidth="1.5" /> : null}
      {index === 2 ? <circle cx="4" cy="4" r="1.5" fill={mark} /> : null}
      {index === 3 ? <path d="M0,4 h8 M4,0 v8" stroke={mark} strokeWidth="1.5" /> : null}
    </pattern>
  );
}

function Swatch({ patternId }: { patternId: string }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0 rounded-sm">
      <rect width="16" height="16" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function BarChart({
  title,
  summary,
  data,
  categoryKey,
  series,
  formatValue = (value) => value.toLocaleString(),
  defaultView = "chart",
  headingLevel = 2,
  className,
}: BarChartProps) {
  const [view, setView] = React.useState<BarChartView>(defaultView);
  const uid = React.useId().replace(/:/g, "");
  if (series.length > SERIES_COLOURS.length) {
    throw new Error(`BarChart supports up to ${SERIES_COLOURS.length} series.`);
  }
  const Heading = `h${headingLevel}` as const;
  const titleId = `${uid}-title`;
  const summaryId = `${uid}-summary`;
  const regionId = `${uid}-region`;
  const patternId = (index: number) => `${uid}-pattern-${index}`;

  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [s.key, { label: s.label, color: SERIES_COLOURS[i] }]),
  );

  return (
    <figure
      data-slot="bar-chart"
      data-view={view}
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      className={cn("flex min-w-0 flex-col gap-3", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading id={titleId} className="text-lg leading-heading font-semibold text-text-default">
            {title}
          </Heading>
          <p id={summaryId} className="max-w-[80ch] text-sm text-text-secondary">
            {summary}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          aria-controls={regionId}
          onPress={() => setView(view === "chart" ? "table" : "chart")}
        >
          {view === "chart" ? <TableIcon aria-hidden /> : <ChartColumnIcon aria-hidden />}
          {view === "chart" ? "View as table" : "View as chart"}
        </Button>
      </div>

      {/* Pattern definitions, shared by the bars and the legend swatches. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          {series.map((s, i) => (
            <SeriesPattern key={s.key} id={patternId(i)} index={i} colour={SERIES_COLOURS[i] ?? SERIES_COLOURS[0]} />
          ))}
        </defs>
      </svg>

      <div id={regionId}>
        {view === "chart" ? (
          <div className="flex flex-col gap-3">
            <ul aria-hidden className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-default">
              {series.map((s, i) => (
                <li key={s.key} className="flex items-center gap-1">
                  <Swatch patternId={patternId(i)} />
                  {s.label}
                </li>
              ))}
            </ul>
            {/* The table view carries the data for assistive technology and keyboard users. */}
            <ChartContainer config={config} aria-hidden className="aspect-auto h-72 w-full min-w-0">
              <RechartsBarChart data={[...data]} accessibilityLayer={false} margin={{ top: 24, right: 8, left: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => formatValue(v)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                {series.map((s, i) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={`url(#${patternId(i)})`}
                    stroke={SERIES_COLOURS[i]}
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey={s.key}
                      position="top"
                      className="fill-text-secondary text-xs"
                      formatter={(v: unknown) => (typeof v === "number" ? formatValue(v) : String(v ?? ""))}
                    />
                  </Bar>
                ))}
              </RechartsBarChart>
            </ChartContainer>
          </div>
        ) : (
          <Table aria-labelledby={titleId}>
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
                  <TableCell>{String(row[categoryKey])}</TableCell>
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
        )}
      </div>
    </figure>
  );
}

/** "monthName" → "Month name" for the category column header. */
function labelFor(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
