"use client";

import { RadarIcon } from "lucide-react";
import * as React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart.js";
import {
  type ChartBaseProps,
  ChartFrame,
  type ChartSeries,
  type ChartView,
  chartConfig,
  defaultFormatValue,
  seriesColour,
} from "./chart-frame.js";

/*
 * Figma contract: RadarChart { view: chart | table, variant: filled | lines, points: none | dots, grid: polygon | circle | none }
 *
 * Each row is an axis (3 to 8); each series is a polygon (up to 4).
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows the same data in a keyboard-navigable table
 * - the chart itself is focusable (Recharts' accessibility layer): arrow keys move
 *   the tooltip from axis to axis
 * - each polygon's outline is the mark, at 3:1 against the card surface in every
 *   theme. A 2px gap in the surface colour runs along each side of it, so it never
 *   touches another polygon's fill. Fills are decorative.
 * - the grid lines meet 3:1 against the surface, because a radar has no value axis
 *   and the grid is how values are read. No 3:1 grey is far enough from every series
 *   grey, so the grid is a 1px dashed line and every series a solid 2px one: they
 *   differ by shape, not only by colour
 *   and the grid is how values are read
 * - axis labels are text-secondary on the surface, and the radius leaves room for
 *   the widest one on each side, down to 320px. More than 8 axes can't be labelled
 *   legibly at 320px, so the table shows instead, with a note
 * - there's no animation
 */

export type RadarChartSeries = ChartSeries;

export type RadarChartView = ChartView;

/** filled shades each polygon; lines draws outlines only. */
export type RadarChartVariant = "filled" | "lines";

/** dots marks each value on its axis. */
export type RadarChartPoints = "none" | "dots";

/** The shape of the grid, or none. */
export type RadarChartGrid = "polygon" | "circle" | "none";

export type RadarChartProps = ChartBaseProps & {
  /** Filled polygons or outlines only. Defaults to filled. */
  variant?: RadarChartVariant;
  /** Marks on each value. Defaults to none. */
  points?: RadarChartPoints;
  /** Grid shape. Defaults to polygon. */
  grid?: RadarChartGrid;
};

const MIN_AXES = 3;
const MAX_AXES = 8;
const FILL_OPACITY = 0.3;
const SURFACE = "var(--gw-color-surface-raised)";
const GAP_WIDTH = 6;
/** chart.axis: 3:1 against the surface, because the grid is how a radar is read. */
const GRID = "var(--gw-color-chart-axis)";
/** Dashed, so the grid never reads as a series, whose lines are solid. */
const GRID_DASH = "3 3";
const HEIGHT = 288;

/** Rough width of a 12px label. */
const textWidth = (text: string) => text.length * 7;

function RadarSwatch({ colour, filled }: { colour: string; filled: boolean }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0">
      <polygon
        points="8,2 14,7 12,14 4,14 2,7"
        fill={filled ? colour : "none"}
        fillOpacity={FILL_OPACITY}
        stroke={colour}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The chart's width, so the radius can leave room for axis labels. A callback ref,
 * so it follows the chart when it remounts after the table view.
 */
function useWidth<T extends HTMLElement>() {
  const [width, setWidth] = React.useState(0);
  const ref = React.useCallback((element: T | null) => {
    if (!element) return;
    setWidth(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      // A detached element reports 0; keep the last real width.
      if (entry && entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

export function RadarChart({
  formatValue = defaultFormatValue,
  variant = "filled",
  points = "none",
  grid = "polygon",
  ...props
}: RadarChartProps) {
  const { data, categoryKey, series } = props;
  if (data.length < MIN_AXES) {
    throw new Error(`RadarChart needs at least ${MIN_AXES} rows, one per axis.`);
  }
  const tooMany = data.length > MAX_AXES;
  const [ref, width] = useWidth<HTMLDivElement>();
  const widest = Math.max(...data.map((row) => textWidth(String(row[categoryKey]))));
  const radius = Math.max(40, Math.min(HEIGHT / 2 - 28, width / 2 - widest - 16));
  const filled = variant === "filled";

  return (
    <ChartFrame
      {...props}
      name="RadarChart"
      formatValue={formatValue}
      chartIcon={RadarIcon}
      tableOnly={
        tooMany
          ? `There are ${data.length} categories, more than the ${MAX_AXES} axes this chart can label, so they're shown as a table.`
          : undefined
      }
      renderSwatch={(i) => <RadarSwatch colour={seriesColour(i)} filled={filled} />}
      renderChart={({ titleId, summaryId }) => (
        <div ref={ref} className="w-full min-w-0">
          <ChartContainer
            config={chartConfig(series)}
            className="focus-ring-within aspect-auto h-72 w-full min-w-0 rounded-md [&_.recharts-polar-angle-axis-tick_text]:fill-text-secondary"
          >
            <RechartsRadarChart
              data={[...data]}
              accessibilityLayer
              aria-labelledby={titleId}
              aria-describedby={summaryId}
              outerRadius={radius}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <ChartTooltip isAnimationActive={false} cursor={false} content={<ChartTooltipContent />} />
              {grid === "none" ? null : <PolarGrid className="radar-grid" gridType={grid} stroke={GRID} strokeDasharray={GRID_DASH} />}
              <PolarAngleAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
              {/*
                Three passes, as in AreaChart: the fills, then a gap in the surface colour
                along each outline, then the outlines. Each outline touches only the gap.
              */}
              {filled
                ? series.map((s, i) => (
                    <Radar
                      key={`fill-${s.key}`}
                      className="radar-fill"
                      dataKey={s.key}
                      name={s.label}
                      fill={seriesColour(i)}
                      fillOpacity={FILL_OPACITY}
                      stroke="none"
                      isAnimationActive={false}
                    />
                  ))
                : null}
              {series.length > 1 || filled
                ? series.map((s) => (
                    <Radar
                      key={`gap-${s.key}`}
                      className="radar-gap"
                      dataKey={s.key}
                      fill="none"
                      stroke={SURFACE}
                      strokeWidth={GAP_WIDTH}
                      strokeLinejoin="round"
                      tooltipType="none"
                      isAnimationActive={false}
                    />
                  ))
                : null}
              {series.map((s, i) => (
                <Radar
                  key={`line-${s.key}`}
                  className="radar-line"
                  dataKey={s.key}
                  {...(filled ? { tooltipType: "none" as const } : { name: s.label })}
                  fill="none"
                  stroke={seriesColour(i)}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  dot={points === "dots" ? { r: 3, fill: seriesColour(i), stroke: SURFACE, strokeWidth: 2 } : false}
                  isAnimationActive={false}
                />
              ))}
            </RechartsRadarChart>
          </ChartContainer>
        </div>
      )}
    />
  );
}
