"use client";

import { ChartAreaIcon } from "lucide-react";
import { Area, CartesianGrid, AreaChart as RechartsAreaChart, XAxis, YAxis } from "recharts";
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
  seriesColour,
  tooltipContent,
  valueAxisWidth,
  withFormattedCategories,
} from "./chart-frame.js";

/*
 * Figma contract: AreaChart { view: chart | table, curve: smooth | linear | step, stacking: stacked | percent, fill: flat | gradient, icons }
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows the same data in a keyboard-navigable table; it is the
 *   alternative to colour for telling series apart (WCAG 1.4.1, see KICKOFF.md "Charts")
 * - the chart itself is focusable (Recharts' accessibility layer): arrow keys move
 *   the tooltip from point to point
 * - the line along the top of each area is the mark, at 3:1 against the card surface
 *   in every theme. A 2px gap in the surface colour runs along each side of it, so
 *   in a stack it never touches the fill of the area above. Fills are decorative,
 *   flat or fading downwards, and never stronger than 40%.
 *   There's no animation.
 */

export type AreaChartSeries = ChartSeries;

export type AreaChartView = ChartView;

export type AreaChartCurve = ChartCurve;

/** stacked adds series on top of each other; percent shows each series' share of the total. */
export type AreaChartStacking = "stacked" | "percent";

/** flat fills each area evenly; gradient fades it towards the bottom. */
export type AreaChartFill = "flat" | "gradient";

export type AreaChartProps = ChartBaseProps &
  ChartTooltipProps & {
  /** How points are joined. Defaults to smooth. */
  curve?: AreaChartCurve;
  /** How series combine. Defaults to stacked. */
  stacking?: AreaChartStacking;
  /** How areas are filled. Defaults to flat. */
  fill?: AreaChartFill;
};

const FILL_OPACITY = 0.4;
/** Where a gradient fill ends, at the bottom of each area. */
const GRADIENT_END_OPACITY = 0.05;

/** The surface-coloured gap along each line: 2px either side of the 2px line. */
const GAP_COLOUR = "var(--gw-color-surface-raised)";
const GAP_WIDTH = 6;

/** A filled square with the series line along its top, for the legend. */
function AreaSwatch({ colour, gradientId }: { colour: string; gradientId?: string | undefined }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0">
      {gradientId ? (
        <rect x="1" y="3" width="14" height="12" fill={`url(#${gradientId})`} />
      ) : (
        <rect x="1" y="3" width="14" height="12" fill={colour} fillOpacity={FILL_OPACITY} />
      )}
      <line x1="1" y1="3" x2="15" y2="3" stroke={colour} strokeWidth="2" />
    </svg>
  );
}

const formatShare = (value: number) => `${Math.round(value * 100)}%`;

export function AreaChart(allProps: AreaChartProps) {
  const {
    formatValue = defaultFormatValue,
    curve = "smooth",
    stacking = "stacked",
    fill = "flat",
    tooltipIndicator,
    tooltipLabel,
    ...props
  } = withFormattedCategories(allProps);
  const { data, categoryKey, series } = props;
  const percent = stacking === "percent";
  const gradient = fill === "gradient";
  const gradientId = (uid: string, index: number) => `${uid}-gradient-${index}`;

  return (
    <ChartFrame
      {...props}
      name="AreaChart"
      formatValue={formatValue}
      chartIcon={ChartAreaIcon}
      renderSwatch={(i, { uid }) => <AreaSwatch colour={seriesColour(i)} gradientId={gradient ? gradientId(uid, i) : undefined} />}
      renderDefs={({ uid }) =>
        gradient ? (
          /* One fade per series, shared by the areas and the legend swatches. */
          <svg aria-hidden width="0" height="0" className="absolute">
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.key} id={gradientId(uid, i)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={seriesColour(i)} stopOpacity={FILL_OPACITY} />
                  <stop offset="100%" stopColor={seriesColour(i)} stopOpacity={GRADIENT_END_OPACITY} />
                </linearGradient>
              ))}
            </defs>
          </svg>
        ) : null
      }
      renderChart={({ uid, titleId, summaryId }) => (
        <ChartContainer config={chartConfig(series)} className="focus-ring-within aspect-auto h-72 w-full min-w-0 rounded-md">
          <RechartsAreaChart
            data={[...data]}
            accessibilityLayer
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            stackOffset={percent ? "expand" : "none"}
            margin={{ top: 8, right: 12, left: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={percent ? 48 : valueAxisWidth(formatValue)}
              tickFormatter={(v: number) => (percent ? formatShare(v) : formatValue(v))}
            />
            <ChartTooltip isAnimationActive={false} content={tooltipContent({ formatValue, indicator: tooltipIndicator, label: tooltipLabel })} />
            {/*
              Three passes, each its own stack so the geometry matches: the fills, then a
              gap in the surface colour along each top line, then the lines. Each line
              touches only the gap, where it meets 3:1, never the fill of the area above it.
            */}
            {series.map((s, i) => (
              <Area
                key={`fill-${s.key}`}
                className="area-fill"
                dataKey={s.key}
                name={s.label}
                type={CURVE_TYPES[curve]}
                stackId="fill"
                stroke="none"
                {...(gradient
                  ? { fill: `url(#${gradientId(uid, i)})` }
                  : { fill: seriesColour(i), fillOpacity: FILL_OPACITY })}
                activeDot={false}
                isAnimationActive={false}
              />
            ))}
            {series.map((s) => (
              <Area
                key={`gap-${s.key}`}
                className="area-gap"
                dataKey={s.key}
                type={CURVE_TYPES[curve]}
                stackId="gap"
                stroke={GAP_COLOUR}
                strokeWidth={GAP_WIDTH}
                strokeLinejoin="round"
                fill="none"
                tooltipType="none"
                activeDot={false}
                isAnimationActive={false}
              />
            ))}
            {series.map((s, i) => (
              <Area
                key={`line-${s.key}`}
                className="area-line"
                dataKey={s.key}
                type={CURVE_TYPES[curve]}
                stackId="line"
                stroke={seriesColour(i)}
                strokeWidth={2}
                strokeLinejoin="round"
                fill="none"
                tooltipType="none"
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            ))}
          </RechartsAreaChart>
        </ChartContainer>
      )}
    />
  );
}
