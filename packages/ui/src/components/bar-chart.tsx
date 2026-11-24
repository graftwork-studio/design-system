"use client";

import { ChartColumnIcon } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart.js";
import {
  type ChartBaseProps,
  ChartFrame,
  type ChartSeries,
  type ChartView,
  chartConfig,
  defaultFormatValue,
  formatLabel,
  seriesColour,
} from "./chart-frame.js";

/*
 * Figma contract: BarChart { view: chart | table }
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows the same data in a keyboard-navigable table
 * - each series has its own pattern and every bar has a direct value label,
 *   so colour is never the only way to tell series apart
 */

export type BarChartSeries = ChartSeries;

export type BarChartView = ChartView;

export type BarChartProps = ChartBaseProps;

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

export function BarChart({ formatValue = defaultFormatValue, ...props }: BarChartProps) {
  const { data, categoryKey, series } = props;
  const patternId = (uid: string, index: number) => `${uid}-pattern-${index}`;

  return (
    <ChartFrame
      {...props}
      name="BarChart"
      formatValue={formatValue}
      chartIcon={ChartColumnIcon}
      renderSwatch={(i, { uid }) => <Swatch patternId={patternId(uid, i)} />}
      renderDefs={({ uid }) => (
        /* Pattern definitions, shared by the bars and the legend swatches. */
        <svg aria-hidden width="0" height="0" className="absolute">
          <defs>
            {series.map((s, i) => (
              <SeriesPattern key={s.key} id={patternId(uid, i)} index={i} colour={seriesColour(i)} />
            ))}
          </defs>
        </svg>
      )}
      renderChart={({ uid }) => (
        /* The table view carries the data for assistive technology and keyboard users. */
        <ChartContainer config={chartConfig(series)} aria-hidden className="aspect-auto h-72 w-full min-w-0">
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
                fill={`url(#${patternId(uid, i)})`}
                stroke={seriesColour(i)}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={s.key}
                  position="top"
                  className="fill-text-secondary text-xs"
                  formatter={formatLabel(formatValue)}
                />
              </Bar>
            ))}
          </RechartsBarChart>
        </ChartContainer>
      )}
    />
  );
}
