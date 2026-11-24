"use client";

import { ChartLineIcon } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart.js";
import {
  CURVE_TYPES,
  type ChartBaseProps,
  type ChartCurve,
  ChartFrame,
  type ChartSeries,
  type ChartView,
  chartConfig,
  defaultFormatValue,
  formatLabel,
  seriesColour,
} from "./chart-frame.js";

/*
 * Figma contract: LineChart { view: chart | table, curve: smooth | linear | step, points: none | dots | values }
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows the same data in a keyboard-navigable table; it is the
 *   alternative to colour for telling series apart (WCAG 1.4.1, see KICKOFF.md "Charts")
 * - the chart itself is focusable (Recharts' accessibility layer): arrow keys move
 *   the tooltip from point to point
 * - lines meet 3:1 against the card surface in every theme; there's no animation
 */

export type LineChartSeries = ChartSeries;

export type LineChartView = ChartView;

export type LineChartCurve = ChartCurve;

/** dots marks each data point; values adds its value above it. */
export type LineChartPoints = "none" | "dots" | "values";

export type LineChartProps = ChartBaseProps & {
  /** How points are joined. Defaults to smooth. */
  curve?: LineChartCurve;
  /** Marks on each data point. Defaults to none. */
  points?: LineChartPoints;
};

/** A short line in the series colour, for the legend. */
function LineSwatch({ colour }: { colour: string }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0">
      <line x1="1" y1="8" x2="15" y2="8" stroke={colour} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LineChart({
  formatValue = defaultFormatValue,
  curve = "smooth",
  points = "none",
  ...props
}: LineChartProps) {
  const { data, categoryKey, series } = props;

  return (
    <ChartFrame
      {...props}
      name="LineChart"
      formatValue={formatValue}
      chartIcon={ChartLineIcon}
      renderSwatch={(i) => <LineSwatch colour={seriesColour(i)} />}
      renderChart={({ titleId, summaryId }) => (
        <ChartContainer config={chartConfig(series)} className="focus-ring-within aspect-auto h-72 w-full min-w-0 rounded-md">
          <RechartsLineChart
            data={[...data]}
            accessibilityLayer
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            margin={{ top: points === "values" ? 24 : 8, right: 12, left: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
            <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => formatValue(v)} />
            <ChartTooltip isAnimationActive={false} content={<ChartTooltipContent />} />
            {series.map((s, i) => (
              <Line
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type={CURVE_TYPES[curve]}
                stroke={seriesColour(i)}
                strokeWidth={2}
                dot={points === "none" ? false : { r: 3, fill: seriesColour(i), strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              >
                {points === "values" ? (
                  <LabelList
                    dataKey={s.key}
                    position="top"
                    offset={10}
                    /* A halo in the surface colour keeps labels legible where they cross a line. */
                    className="fill-text-secondary stroke-surface-raised stroke-3 text-xs [paint-order:stroke]"
                    formatter={formatLabel(formatValue)}
                  />
                ) : null}
              </Line>
            ))}
          </RechartsLineChart>
        </ChartContainer>
      )}
    />
  );
}
