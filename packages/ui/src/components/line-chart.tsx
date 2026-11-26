"use client";

import { ChartLineIcon } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "./chart.js";
import {
  CURVE_TYPES,
  type ChartBaseProps,
  type ChartCurve,
  ChartFrame,
  type ChartSeries,
  type ChartTooltipProps,
  type ChartView,
  chartConfig,
  defaultFormatValue,
  formatLabel,
  SERIES_COLOURS,
  seriesColour,
  tooltipContent,
  valueAxisWidth,
  withFormattedCategories,
} from "./chart-frame.js";

/*
 * Figma contract: LineChart {
 *   view: chart | table, curve: smooth | linear | step, points: none | dots | values | names | icons,
 *   colourBy: series | category, icons
 * }
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows the same data in a keyboard-navigable table; it is the
 *   alternative to colour for telling series apart (WCAG 1.4.1, see KICKOFF.md "Charts")
 * - the chart itself is focusable (Recharts' accessibility layer): arrow keys move
 *   the tooltip from point to point
 * - lines meet 3:1 against the card surface in every theme; there's no animation
 * - with colourBy="category", each point takes its category's colour, with a ring in
 *   the surface colour so it stands apart from the line. The category axis already
 *   names every point, so colour is never the only cue.
 * - names and values above points have a halo in the surface colour, so they stay
 *   legible where they cross a line
 * - icon markers are drawn in the series colour over the surface colour, so the line
 *   doesn't show through them
 */

export type LineChartSeries = ChartSeries;

export type LineChartView = ChartView;

export type LineChartCurve = ChartCurve;

/**
 * dots marks each data point; values adds its value above it; names adds its category
 * name above it; icons draws the series icon at each point.
 */
export type LineChartPoints = "none" | "dots" | "values" | "names" | "icons";

/** category gives each point its own colour (one series, up to four points). */
export type LineChartColourBy = "series" | "category";

export type LineChartProps = ChartBaseProps &
  ChartTooltipProps & {
    /** How points are joined. Defaults to smooth. */
    curve?: LineChartCurve;
    /** Marks on each data point. Defaults to none. */
    points?: LineChartPoints;
    /** What each point's colour stands for. Defaults to series. */
    colourBy?: LineChartColourBy;
  };

const SURFACE = "var(--gw-color-surface-raised)";
const ICON_SIZE = 24;
/** Classes for labels above points: a halo in the surface colour keeps them legible where they cross a line. */
const POINT_LABEL = "fill-text-secondary stroke-surface-raised stroke-3 text-xs [paint-order:stroke]";

/** A short line in the series colour, for the legend. */
function LineSwatch({ colour }: { colour: string }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0">
      <line x1="1" y1="8" x2="15" y2="8" stroke={colour} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A point in the category colour, for the legend. */
function PointSwatch({ colour }: { colour: string }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0">
      <circle cx="8" cy="8" r="5" fill={colour} />
    </svg>
  );
}

function checkOptions({ data, series, points = "none", colourBy = "series" }: LineChartProps) {
  if (colourBy === "category") {
    if (series.length !== 1) throw new Error('LineChart colourBy="category" needs exactly one series.');
    if (data.length > SERIES_COLOURS.length) {
      throw new Error(`LineChart colourBy="category" supports up to ${SERIES_COLOURS.length} points.`);
    }
    if (points === "none" || points === "icons") {
      throw new Error('LineChart colourBy="category" needs points="dots", "values" or "names".');
    }
  }
  if (points === "icons" && series.some((s) => !s.icon)) {
    throw new Error('LineChart points="icons" needs an icon on every series.');
  }
}

type DotProps = { cx?: number | undefined; cy?: number | undefined; index?: number | undefined };

export function LineChart(allProps: LineChartProps) {
  checkOptions(allProps);
  const {
    formatValue = defaultFormatValue,
    curve = "smooth",
    points = "none",
    colourBy = "series",
    tooltipIndicator,
    tooltipLabel,
    ...props
  } = withFormattedCategories(allProps);
  const { data, categoryKey, series } = props;
  const byCategory = colourBy === "category";
  const labelled = points === "values" || points === "names";
  /* Half the widest name, at roughly 7px a character for 12px text. */
  const namePadding = Math.max(...data.map((row) => String(row[categoryKey]).length)) * 3.5 + 4;
  /* In category colours, each row carries its fill, so the tooltip marker matches its point. */
  const rows = byCategory ? data.map((row, i) => ({ ...row, fill: seriesColour(i) })) : [...data];
  const legend = byCategory ? data.map((row) => ({ key: String(row[categoryKey]), label: String(row[categoryKey]) })) : undefined;

  const dot = (seriesIndex: number) => {
    if (points === "none") return false;
    if (points === "icons") {
      const Icon = series[seriesIndex]?.icon;
      return function IconDot({ cx, cy, index }: DotProps) {
        if (cx == null || cy == null || !Icon) return <g key={index} />;
        return (
          <g
            key={index}
            className="line-icon"
            transform={`translate(${cx - ICON_SIZE / 2}, ${cy - ICON_SIZE / 2})`}
            style={{ color: seriesColour(seriesIndex) }}
          >
            <Icon aria-hidden className="fill-surface-raised" />
          </g>
        );
      };
    }
    if (byCategory) {
      return function CategoryDot({ cx, cy, index }: DotProps) {
        if (cx == null || cy == null) return <g key={index} />;
        return (
          <circle
            key={index}
            className="line-category-dot"
            cx={cx}
            cy={cy}
            r={5}
            fill={seriesColour(index ?? 0)}
            stroke={SURFACE}
            strokeWidth={2}
          />
        );
      };
    }
    return { r: 3, fill: seriesColour(seriesIndex), strokeWidth: 0 };
  };

  return (
    <ChartFrame
      {...props}
      name="LineChart"
      formatValue={formatValue}
      chartIcon={ChartLineIcon}
      legend={legend}
      renderSwatch={(i) => (byCategory ? <PointSwatch colour={seriesColour(i)} /> : <LineSwatch colour={seriesColour(i)} />)}
      renderChart={({ titleId, summaryId }) => (
        <ChartContainer config={chartConfig(series)} className="focus-ring-within aspect-auto h-72 w-full min-w-0 rounded-md">
          <RechartsLineChart
            data={rows}
            accessibilityLayer
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            margin={{ top: labelled ? 24 : points === "icons" ? 16 : 8, right: 12, left: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={categoryKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              /* Names are centred on their points, so the first and last need room to the side. */
              {...(points === "names" ? { padding: { left: namePadding, right: namePadding } } : {})}
            />
            <YAxis tickLine={false} axisLine={false} width={valueAxisWidth(formatValue)} tickFormatter={(v: number) => formatValue(v)} />
            <ChartTooltip isAnimationActive={false} content={tooltipContent({ formatValue, indicator: tooltipIndicator, label: tooltipLabel })} />
            {series.map((s, i) => (
              <Line
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type={CURVE_TYPES[curve]}
                stroke={seriesColour(i)}
                strokeWidth={2}
                dot={dot(i)}
                activeDot={points === "icons" ? false : { r: 5 }}
                isAnimationActive={false}
              >
                {points === "values" ? (
                  <LabelList dataKey={s.key} position="top" offset={10} className={POINT_LABEL} formatter={formatLabel(formatValue)} />
                ) : null}
                {points === "names" ? (
                  <LabelList dataKey={categoryKey} position="top" offset={12} className={POINT_LABEL} />
                ) : null}
              </Line>
            ))}
          </RechartsLineChart>
        </ChartContainer>
      )}
    />
  );
}
