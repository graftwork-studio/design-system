"use client";

import { ChartBarIcon, ChartColumnIcon } from "lucide-react";
import type * as React from "react";
import {
  Bar,
  type BarShapeProps,
  CartesianGrid,
  Cell,
  LabelList,
  type LabelProps,
  BarChart as RechartsBarChart,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart.js";
import {
  type ChartBaseProps,
  ChartFrame,
  type ChartSeries,
  type ChartView,
  chartConfig,
  defaultFormatValue,
  formatLabel,
  SERIES_COLOURS,
  seriesColour,
} from "./chart-frame.js";

/*
 * Figma contract: BarChart {
 *   view: chart | table, orientation: vertical | horizontal, stacking: none | stacked,
 *   labels: values | none | inside, colourBy: series | category, negatives: same | distinct,
 *   highlight
 * }
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows the same data in a keyboard-navigable table
 * - each series has its own pattern and every bar has a direct value label,
 *   so colour is never the only way to tell series apart
 * - every bar meets 3:1 against the card surface in every theme. Where bars touch,
 *   as stacked segments do, a 2px gap in the surface colour separates them
 * - labels drawn over a bar sit on a chip in the surface colour, so their text
 *   contrast is measured against the surface, never against a bar
 * - a highlighted bar gets a ring as well as its colour, and its table row says
 *   "(highlighted)"
 */

export type BarChartSeries = ChartSeries;

export type BarChartView = ChartView;

/** vertical draws columns rising from the category axis; horizontal draws bars from the left. */
export type BarChartOrientation = "vertical" | "horizontal";

/** stacked adds series on top of each other; none sets them side by side. */
export type BarChartStacking = "none" | "stacked";

/** values labels each bar with its value; inside puts the category name inside each bar (horizontal only). */
export type BarChartLabels = "values" | "none" | "inside";

/** category gives each bar its own colour (one series, up to four bars). */
export type BarChartColourBy = "series" | "category";

/** distinct gives negative values their own colour and pattern (one series). */
export type BarChartNegatives = "same" | "distinct";

export type BarChartProps = ChartBaseProps & {
  /** Which way bars run. Defaults to vertical. */
  orientation?: BarChartOrientation;
  /** How series combine. Defaults to none (side by side). */
  stacking?: BarChartStacking;
  /** What labels the bars carry. Defaults to values. */
  labels?: BarChartLabels;
  /** What each colour stands for. Defaults to series. */
  colourBy?: BarChartColourBy;
  /** Whether negative values get their own colour. Defaults to same. */
  negatives?: BarChartNegatives;
  /** A category value whose bars are highlighted with a ring. */
  highlight?: string;
};

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

const SURFACE = "var(--gw-color-surface-raised)";

/** Rough width of a 12px label, for deciding whether it fits inside a bar. */
const textWidth = (text: string) => text.length * 7;

/**
 * A label on a chip in the surface colour, so its contrast is measured against the
 * surface rather than the bar beneath it. x is the left edge, or the centre if centred.
 */
function LabelChip({
  x,
  y,
  text,
  centred = false,
  className,
}: {
  x: number;
  y: number;
  text: string;
  centred?: boolean;
  className: string;
}) {
  const width = textWidth(text) + 8;
  const left = centred ? x - width / 2 : x - 4;
  return (
    <g>
      <rect x={left} y={y - 9} width={width} height={18} rx={4} fill={SURFACE} />
      <text x={x} y={y} textAnchor={centred ? "middle" : "start"} dominantBaseline="central" className={className}>
        {text}
      </text>
    </g>
  );
}

/** The ring round a highlighted bar: 2px wide, 2px clear of the bar. */
const RING_OFFSET = 4;

function checkOptions(props: BarChartProps) {
  const { data, series, orientation = "vertical", labels = "values", colourBy = "series", negatives = "same" } = props;
  if (labels === "inside" && orientation !== "horizontal") {
    throw new Error('BarChart labels="inside" needs orientation="horizontal".');
  }
  if (colourBy === "category" && series.length !== 1) {
    throw new Error('BarChart colourBy="category" needs exactly one series.');
  }
  if (colourBy === "category" && data.length > SERIES_COLOURS.length) {
    throw new Error(`BarChart colourBy="category" supports up to ${SERIES_COLOURS.length} bars.`);
  }
  if (negatives === "distinct" && series.length !== 1) {
    throw new Error('BarChart negatives="distinct" needs exactly one series.');
  }
}

export function BarChart(allProps: BarChartProps) {
  checkOptions(allProps);
  const {
    formatValue = defaultFormatValue,
    orientation = "vertical",
    stacking = "none",
    labels = "values",
    colourBy = "series",
    negatives = "same",
    highlight,
    ...props
  } = allProps;
  const { data, categoryKey, series } = props;
  const patternId = (uid: string, index: number) => `${uid}-pattern-${index}`;
  const horizontal = orientation === "horizontal";
  const stacked = stacking === "stacked";
  const byCategory = colourBy === "category";
  const distinctNegatives = negatives === "distinct";
  const hasNegatives = data.some((row) => series.some((s) => typeof row[s.key] === "number" && (row[s.key] as number) < 0));

  /* Which colour and pattern each bar takes, when it isn't simply its series. */
  const barIndex = (row: Record<string, string | number>, rowIndex: number, seriesKey: string): number => {
    if (byCategory) return rowIndex;
    if (distinctNegatives && typeof row[seriesKey] === "number" && (row[seriesKey] as number) < 0) return 1;
    return 0;
  };
  const perBar = byCategory || distinctNegatives;

  const legend: ChartSeries[] | undefined = byCategory
    ? data.map((row) => ({ key: String(row[categoryKey]), label: String(row[categoryKey]) }))
    : distinctNegatives && hasNegatives
      ? [series[0] as ChartSeries, { key: `${series[0]?.key}-negative`, label: `${series[0]?.label}, negative` }]
      : undefined;
  const patternCount = legend ? legend.length : series.length;

  /* Rounded on the end away from the axis. In a stack, only the outermost segment. */
  const radius = (seriesIndex: number): [number, number, number, number] | number => {
    if (stacked && seriesIndex !== series.length - 1) return 0;
    return horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0];
  };

  const highlightShape = (seriesIndex: number) =>
    function HighlightShape(shape: BarShapeProps) {
      const { x = 0, y = 0, width = 0, height = 0, payload, index } = shape;
      const isHighlighted = String((payload as Record<string, unknown>)[categoryKey]) === highlight;
      const colour = seriesColour(perBar ? barIndex(data[index] ?? {}, index, series[seriesIndex]?.key ?? "") : seriesIndex);
      return (
        <g>
          <Rectangle {...shape} />
          {isHighlighted ? (
            <Rectangle
              className="bar-highlight"
              x={x - RING_OFFSET}
              y={Math.min(y, y + height) - RING_OFFSET}
              width={width + RING_OFFSET * 2}
              height={Math.abs(height) + RING_OFFSET * 2}
              radius={6}
              fill="none"
              stroke={colour}
              strokeWidth={2}
            />
          ) : null}
        </g>
      );
    };

  /* Category name inside the bar and the value at its end; both outside when the bar is too short. */
  const insideLabel = (seriesKey: string) =>
    function InsideLabel(label: LabelProps) {
      const x = Number(label.x ?? 0);
      const y = Number(label.y ?? 0);
      const width = Number(label.width ?? 0);
      const height = Number(label.height ?? 0);
      const row = data[Number(label.index ?? 0)] ?? {};
      const name = String(row[categoryKey] ?? "");
      const raw = row[seriesKey];
      const value = typeof raw === "number" ? formatValue(raw) : String(raw ?? "");
      const midY = y + height / 2;
      const fits = width >= textWidth(name) + 16;
      return (
        <g className="bar-inside-label">
          <LabelChip x={fits ? x + 8 : x + width + 8} y={midY} text={name} className="fill-text-default text-xs" />
          <text
            x={x + width + 8 + (fits ? 0 : textWidth(name) + 8)}
            y={midY}
            dominantBaseline="central"
            className="fill-text-secondary text-xs"
          >
            {value}
          </text>
        </g>
      );
    };

  /* A value in the middle of a stacked segment, left out when the segment is too small to hold it. */
  const centreLabel = (label: LabelProps) => {
    const x = Number(label.x ?? 0);
    const y = Number(label.y ?? 0);
    const width = Number(label.width ?? 0);
    const height = Number(label.height ?? 0);
    const text = formatLabel(formatValue)(label.value);
    if (Math.abs(height) < 22 || Math.abs(width) < textWidth(text) + 12) return null;
    return <LabelChip x={x + width / 2} y={y + height / 2} text={text} centred className="fill-text-default text-xs" />;
  };

  /* A value beyond the end of a negative bar, rather than on the zero line. */
  const negativeAwareLabel = (label: LabelProps) => {
    const x = Number(label.x ?? 0);
    const y = Number(label.y ?? 0);
    const width = Number(label.width ?? 0);
    const height = Number(label.height ?? 0);
    const text = formatLabel(formatValue)(label.value);
    const negative = typeof label.value === "number" && label.value < 0;
    if (horizontal) {
      const gap = 5 + (highlight !== undefined ? RING_OFFSET + 2 : 0);
      const end = negative ? Math.min(x, x + width) - gap : Math.max(x, x + width) + gap;
      return (
        <text x={end} y={y + height / 2} textAnchor={negative ? "end" : "start"} dominantBaseline="central" className="fill-text-secondary text-xs">
          {text}
        </text>
      );
    }
    const gap = 5 + (highlight !== undefined ? RING_OFFSET + 2 : 0);
    const end = negative ? Math.max(y, y + height) + gap : Math.min(y, y + height) - gap;
    return (
      <text x={x + width / 2} y={end} textAnchor="middle" dominantBaseline={negative ? "hanging" : "auto"} className="fill-text-secondary text-xs">
        {text}
      </text>
    );
  };

  const valueLabel = (seriesKey: string): React.ReactNode => {
    if (labels === "none") return null;
    if (labels === "inside") return <LabelList dataKey={seriesKey} content={insideLabel(seriesKey)} />;
    if (stacked) return <LabelList dataKey={seriesKey} content={centreLabel} />;
    /* Cells pass their fill to Recharts' own labels as an inline style, so per-bar colours draw their own. */
    if (horizontal || hasNegatives || perBar) return <LabelList dataKey={seriesKey} content={negativeAwareLabel} />;
    return (
      <LabelList
        dataKey={seriesKey}
        position="top"
        {...(highlight !== undefined ? { offset: 5 + RING_OFFSET + 2 } : {})}
        className="fill-text-secondary text-xs"
        formatter={formatLabel(formatValue)}
      />
    );
  };

  const margin = horizontal
    ? { top: 8, right: labels === "none" ? 16 : 48, left: hasNegatives ? 48 : 8, bottom: 8 }
    : { top: 24, right: 8, left: 8, ...(hasNegatives && labels !== "none" ? { bottom: 24 } : {}) };

  return (
    <ChartFrame
      {...props}
      name="BarChart"
      formatValue={formatValue}
      chartIcon={horizontal ? ChartBarIcon : ChartColumnIcon}
      legend={legend}
      highlight={highlight}
      renderSwatch={(i, { uid }) => <Swatch patternId={patternId(uid, i)} />}
      renderDefs={({ uid }) => (
        /* Pattern definitions, shared by the bars and the legend swatches. */
        <svg aria-hidden width="0" height="0" className="absolute">
          <defs>
            {SERIES_COLOURS.slice(0, Math.max(patternCount, distinctNegatives ? 2 : 0)).map((_, i) => (
              <SeriesPattern key={(legend ?? series)[i]?.key ?? i} id={patternId(uid, i)} index={i} colour={seriesColour(i)} />
            ))}
          </defs>
        </svg>
      )}
      renderChart={({ uid }) => (
        /* The table view carries the data for assistive technology and keyboard users. */
        <ChartContainer config={chartConfig(series)} aria-hidden className="aspect-auto h-72 w-full min-w-0">
          <RechartsBarChart
            data={[...data]}
            accessibilityLayer={false}
            margin={margin}
            {...(horizontal ? { layout: "vertical" as const } : {})}
          >
            {horizontal ? (
              <>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} tickFormatter={(v: number) => formatValue(v)} />
                <YAxis
                  type="category"
                  dataKey={categoryKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width="auto"
                  hide={labels === "inside"}
                />
              </>
            ) : (
              <>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => formatValue(v)} />
              </>
            )}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={`url(#${patternId(uid, i)})`}
                stroke={stacked ? SURFACE : seriesColour(i)}
                {...(stacked ? { stackId: "stack", strokeWidth: 2 } : {})}
                radius={radius(i)}
                {...(highlight !== undefined ? { shape: highlightShape(i) } : {})}
                isAnimationActive={false}
              >
                {perBar
                  ? data.map((row, rowIndex) => {
                      const index = barIndex(row, rowIndex, s.key);
                      return (
                        <Cell
                          key={`${String(row[categoryKey])}-${rowIndex}`}
                          fill={`url(#${patternId(uid, index)})`}
                          stroke={seriesColour(index)}
                        />
                      );
                    })
                  : null}
                {valueLabel(s.key)}
              </Bar>
            ))}
          </RechartsBarChart>
        </ChartContainer>
      )}
    />
  );
}
