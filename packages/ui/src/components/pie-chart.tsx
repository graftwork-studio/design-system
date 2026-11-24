"use client";

import { ChartPieIcon } from "lucide-react";
import { Cell, Pie, type PieLabelRenderProps, PieChart as RechartsPieChart, Sector, useChartHeight, useChartWidth } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart.js";
import {
  type ChartBaseProps,
  ChartFrame,
  type ChartSeries,
  type ChartView,
  chartConfig,
  defaultFormatValue,
  SERIES_COLOURS,
  seriesColour,
} from "./chart-frame.js";

/*
 * Figma contract: PieChart { view: chart | table, variant: pie | donut, labels: none | values | names, totalLabel, highlight }
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows every row of the data, with each slice's label and value
 * - the chart itself is focusable (Recharts' accessibility layer): arrow keys move
 *   the tooltip from slice to slice
 * - the legend names every slice. At most four slices, one per series colour: from
 *   the fifth row on, the rest are combined into "Other", and the table still lists them
 * - every slice meets 3:1 against the card surface in every theme. Neighbouring
 *   slices are separated by a 2px gap in the surface colour, because the series
 *   colours are not 3:1 against each other
 * - labels sit outside the slices, on the surface, never on a fill
 * - a highlighted slice is drawn larger, so the highlight is a shape as well as a
 *   colour, and its table row says "(highlighted)". There's no animation.
 */

export type PieChartSeries = ChartSeries;

export type PieChartView = ChartView;

/** donut leaves a hole in the middle, where totalLabel can show the total. */
export type PieChartVariant = "pie" | "donut";

/** values labels each slice with its value; names with its category. */
export type PieChartLabels = "none" | "values" | "names";

export type PieChartProps = ChartBaseProps & {
  /** Pie or donut. Defaults to pie. */
  variant?: PieChartVariant;
  /** Labels beside each slice. The legend always names them. Defaults to none. */
  labels?: PieChartLabels;
  /** On a donut, shows the total of the first series in the middle, above this text. */
  totalLabel?: string;
  /** A category value whose slice is drawn larger. */
  highlight?: string;
};

/** Slices beyond this are combined into "Other". */
const PIE_MAX_SLICES = SERIES_COLOURS.length;

const SURFACE = "var(--gw-color-surface-raised)";
const GAP_WIDTH = 2;
const HIGHLIGHT_GROWTH = 8;
const LABEL_OFFSET = 10;

/** Rough width of a 12px label. */
const textWidth = (text: string) => text.length * 7;

type Row = Record<string, string | number>;

/** The rows as slices: the first three, then the rest combined into "Other", when there are more than four. */
function pieSlices(data: readonly Row[], categoryKey: string, series: readonly ChartSeries[]): Row[] {
  if (data.length <= PIE_MAX_SLICES) return [...data];
  const kept = data.slice(0, PIE_MAX_SLICES - 1);
  const rest = data.slice(PIE_MAX_SLICES - 1);
  const other: Row = { [categoryKey]: `Other (${rest.length} categories)` };
  for (const s of series) {
    other[s.key] = rest.reduce((sum, row) => sum + (typeof row[s.key] === "number" ? (row[s.key] as number) : 0), 0);
  }
  return [...kept, other];
}

function PieSwatch({ colour }: { colour: string }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0">
      <circle cx="8" cy="8" r="7" fill={colour} />
    </svg>
  );
}

type RingsProps = {
  slices: Row[];
  categoryKey: string;
  series: readonly ChartSeries[];
  donut: boolean;
  labels: PieChartLabels;
  totalLabel?: string;
  highlight?: string;
  formatValue: (value: number) => string;
};

/**
 * The rings, sized to the chart so outside labels never clip: the radius leaves room
 * for the widest label on each side, down to 320px.
 */
function PieRings({ slices, categoryKey, series, donut, labels, totalLabel, highlight, formatValue }: RingsProps) {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const outer = series[series.length - 1] as ChartSeries;
  const labelText = (row: Row) =>
    labels === "names" ? String(row[categoryKey]) : formatValue(typeof row[outer.key] === "number" ? (row[outer.key] as number) : 0);
  const widest = labels === "none" ? 0 : Math.max(...slices.map((row) => textWidth(labelText(row))));
  const growth = highlight !== undefined ? HIGHLIGHT_GROWTH : 0;
  const room = labels === "none" ? 4 : LABEL_OFFSET + 4;
  const radius = Math.max(
    40,
    Math.min(width / 2 - room - widest - growth, height / 2 - room - (labels === "none" ? 0 : 12) - growth),
  );

  /* Inner and outer radius of each ring, inside out. */
  const rings =
    series.length === 1
      ? [[donut ? radius * 0.6 : 0, radius]]
      : donut
        ? [
            [radius * 0.35, radius * 0.65],
            [radius * 0.7, radius],
          ]
        : [
            [0, radius * 0.62],
            [radius * 0.68, radius],
          ];

  const isHighlighted = (row: Row | undefined) => highlight !== undefined && row !== undefined && String(row[categoryKey]) === highlight;

  const renderLabel = (props: PieLabelRenderProps) => {
    const index = Number(props.index ?? 0);
    const row = slices[index];
    if (!row) return null;
    const angle = (-Number(props.midAngle ?? 0) * Math.PI) / 180;
    const r = Number(props.outerRadius ?? radius) + LABEL_OFFSET + (isHighlighted(row) ? growth : 0);
    const x = Number(props.cx ?? 0) + r * Math.cos(angle);
    const y = Number(props.cy ?? 0) + r * Math.sin(angle);
    const anchor = Math.abs(Math.cos(angle)) < 0.2 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
    return (
      <text
        key={`label-${index}`}
        className="pie-label fill-text-secondary text-xs"
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="central"
      >
        {labelText(row)}
      </text>
    );
  };

  const total = slices.reduce(
    (sum, row) => sum + (typeof row[series[0]?.key ?? ""] === "number" ? (row[series[0]?.key ?? ""] as number) : 0),
    0,
  );

  return (
    <>
      {series.map((s, ringIndex) => {
        const [innerRadius, outerRadius] = rings[ringIndex] as [number, number];
        const outermost = ringIndex === series.length - 1;
        return (
          <Pie
            key={s.key}
            className="pie-ring"
            data={slices}
            dataKey={s.key}
            nameKey={categoryKey}
            name={s.label}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            stroke={SURFACE}
            strokeWidth={GAP_WIDTH}
            rootTabIndex={-1}
            label={outermost && labels !== "none" ? renderLabel : false}
            labelLine={false}
            isAnimationActive={false}
            {...(highlight !== undefined && outermost
              ? {
                  shape: (sector: Parameters<typeof Sector>[0] & { index: number }) => (
                    <Sector
                      {...sector}
                      className={isHighlighted(slices[sector.index]) ? "pie-highlight" : undefined}
                      outerRadius={Number(sector.outerRadius ?? 0) + (isHighlighted(slices[sector.index]) ? growth : 0)}
                    />
                  ),
                }
              : {})}
          >
            {slices.map((row, i) => (
              <Cell key={`${String(row[categoryKey])}-${i}`} fill={seriesColour(i)} />
            ))}
          </Pie>
        );
      })}
      {donut && totalLabel !== undefined ? (
        <text className="pie-total" x={width / 2} y={height / 2} textAnchor="middle">
          <tspan x={width / 2} dy="-0.1em" className="fill-text-default text-2xl font-semibold">
            {formatValue(total)}
          </tspan>
          <tspan x={width / 2} dy="1.5em" className="fill-text-secondary text-xs">
            {totalLabel}
          </tspan>
        </text>
      ) : null}
    </>
  );
}

export function PieChart({
  formatValue = defaultFormatValue,
  variant = "pie",
  labels = "none",
  totalLabel,
  highlight,
  ...props
}: PieChartProps) {
  const { data, categoryKey, series } = props;
  if (series.length < 1 || series.length > 2) {
    throw new Error("PieChart takes one series, or two for two rings.");
  }
  if (totalLabel !== undefined && variant !== "donut") {
    throw new Error('PieChart totalLabel needs variant="donut".');
  }
  const slices = pieSlices(data, categoryKey, series);
  const legend = slices.map((row) => ({ key: String(row[categoryKey]), label: String(row[categoryKey]) }));

  return (
    <ChartFrame
      {...props}
      name="PieChart"
      formatValue={formatValue}
      chartIcon={ChartPieIcon}
      legend={legend}
      highlight={highlight}
      renderSwatch={(i) => <PieSwatch colour={seriesColour(i)} />}
      renderChart={({ titleId, summaryId }) => (
        <ChartContainer config={chartConfig(series)} className="focus-ring-within aspect-auto h-72 w-full min-w-0 rounded-md">
          <RechartsPieChart
            accessibilityLayer
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <ChartTooltip isAnimationActive={false} content={<ChartTooltipContent hideLabel nameKey={categoryKey} />} />
            <PieRings
              slices={slices}
              categoryKey={categoryKey}
              series={series}
              donut={variant === "donut"}
              labels={labels}
              totalLabel={totalLabel}
              highlight={highlight}
              formatValue={formatValue}
            />
          </RechartsPieChart>
        </ChartContainer>
      )}
    />
  );
}
