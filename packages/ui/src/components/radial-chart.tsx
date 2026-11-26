"use client";

import { ChartPieIcon } from "lucide-react";
import {
  Cell,
  LabelList,
  type LabelProps,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  useChartHeight,
  useChartWidth,
} from "recharts";
import { ChartContainer, ChartTooltip } from "./chart.js";
import {
  type ChartBaseProps,
  ChartFrame,
  type ChartSeries,
  type ChartView,
  chartConfig,
  defaultFormatValue,
  SERIES_COLOURS,
  seriesColour,
  tooltipContent,
  withFormattedCategories,
} from "./chart-frame.js";

/*
 * Figma contract: RadialChart { view: chart | table, shape: full | half, labels: none | names, totalLabel, max }
 *
 * With one series, each row is a ring. With two or more series and one row, the
 * series are stacked into one ring.
 *
 * Accessibility:
 * - a written summary is required and always visible
 * - "View as table" shows each ring's label and value
 * - the chart itself is focusable (Recharts' accessibility layer): arrow keys move
 *   the tooltip from ring to ring
 * - the legend names every ring. At most four rings, one per series colour. With
 *   more rows, the chart can't be drawn, so the table shows instead, with a note
 * - every ring meets 3:1 against the card surface in every theme. Rings never
 *   touch; stacked segments are separated by a 2px gap in the surface colour.
 *   There's no background track: where a ring ends against one, it would fall below 3:1
 * - names sit on the surface beside where each ring starts, never on a fill
 * - there's no animation
 */

export type RadialChartSeries = ChartSeries;

export type RadialChartView = ChartView;

/** full is a ring (three quarters of one, for several rings, to leave room for names); half is a semicircle. */
export type RadialChartShape = "full" | "half";

/** names labels each ring with its category, beside where it starts. */
export type RadialChartLabels = "none" | "names";

export type RadialChartProps = ChartBaseProps & {
  /** A ring or a semicircle. Defaults to full. */
  shape?: RadialChartShape;
  /** Labels beside each ring. The legend always names them. Defaults to none. */
  labels?: RadialChartLabels;
  /** Shows the total in the middle, above this text. */
  totalLabel?: string;
  /** The value of a complete ring. Defaults to the largest value, or for a stacked ring, the total. */
  max?: number;
};

const SURFACE = "var(--gw-color-surface-raised)";
const MAX_RINGS = SERIES_COLOURS.length;

type Row = Record<string, string | number>;

const numberAt = (row: Row | undefined, key: string) => (typeof row?.[key] === "number" ? (row[key] as number) : 0);

function RingSwatch({ colour }: { colour: string }) {
  return (
    <svg aria-hidden width="16" height="16" className="shrink-0">
      <circle cx="8" cy="8" r="5.5" fill="none" stroke={colour} strokeWidth="3" />
    </svg>
  );
}

/** The total in the middle of the chart. */
function Total({ total, label, half }: { total: string; label: string; half: boolean }) {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const cx = width / 2;
  const cy = height * (half ? 0.75 : 0.5);
  return (
    <text className="radial-total" x={cx} y={cy} textAnchor="middle">
      <tspan x={cx} y={half ? cy - 20 : cy} className="fill-text-default text-2xl font-semibold">
        {total}
      </tspan>
      <tspan x={cx} y={half ? cy : cy + 20} className="fill-text-secondary text-xs">
        {label}
      </tspan>
    </text>
  );
}

export function RadialChart(allProps: RadialChartProps) {
  const {
    formatValue = defaultFormatValue,
    shape = "full",
    labels = "none",
    totalLabel,
    max,
    ...props
  } = withFormattedCategories(allProps);
  const { data, categoryKey, series } = props;
  const stacked = series.length > 1;
  if (stacked && data.length !== 1) {
    throw new Error("RadialChart stacks two or more series into one ring, so it needs exactly one row.");
  }
  if (stacked && labels === "names") {
    throw new Error('RadialChart labels="names" needs one series: the legend names stacked segments.');
  }
  const first = series[0] as ChartSeries;
  const tooMany = !stacked && data.length > MAX_RINGS;
  const half = shape === "half";
  const single = !stacked && data.length === 1;

  const total = stacked
    ? series.reduce((sum, s) => sum + numberAt(data[0], s.key), 0)
    : data.reduce((sum, row) => sum + numberAt(row, first.key), 0);
  const largest = stacked ? total : Math.max(0, ...data.map((row) => numberAt(row, first.key)));
  const scaleMax = max ?? largest;

  /* Several rings span three quarters of a circle, leaving the top left for their names. */
  const [startAngle, endAngle] = half ? [180, 0] : single || stacked ? [90, -270] : [90, -180];
  const [innerRadius, outerRadius] = single || stacked ? ["72%", "95%"] : ["30%", "95%"];

  const legend = stacked ? undefined : data.map((row) => ({ key: String(row[categoryKey]), label: String(row[categoryKey]) }));

  /* A ring's name, on the surface just before where it starts. */
  const nameLabel = (label: LabelProps) => {
    const box = label.viewBox as { cx?: number; cy?: number; innerRadius?: number; outerRadius?: number } | undefined;
    const row = data[Number(label.index ?? 0)];
    if (!box || !row) return null;
    const middle = ((box.innerRadius ?? 0) + (box.outerRadius ?? 0)) / 2;
    return (
      <text
        className="radial-label fill-text-secondary text-xs"
        x={(box.cx ?? 0) - 6}
        y={(box.cy ?? 0) - middle}
        textAnchor="end"
        dominantBaseline="central"
      >
        {String(row[categoryKey])}
      </text>
    );
  };

  return (
    <ChartFrame
      {...props}
      name="RadialChart"
      formatValue={formatValue}
      chartIcon={ChartPieIcon}
      legend={legend}
      tableOnly={
        tooMany
          ? `There are ${data.length} categories, more than the ${MAX_RINGS} rings this chart can draw, so they're shown as a table.`
          : undefined
      }
      renderSwatch={(i) => <RingSwatch colour={seriesColour(i)} />}
      renderChart={({ titleId, summaryId }) => (
        <ChartContainer config={stacked ? chartConfig(series) : chartConfig(legend ?? [])} className="focus-ring-within aspect-auto h-72 w-full min-w-0 rounded-md">
          <RechartsRadialBarChart
            data={[...data]}
            accessibilityLayer
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            cy={half ? "75%" : "50%"}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            barCategoryGap="20%"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <PolarAngleAxis type="number" domain={[0, scaleMax]} tick={false} axisLine={false} />
            <ChartTooltip
              isAnimationActive={false}
              cursor={false}
              content={tooltipContent({ formatValue, label: "none", ...(stacked ? {} : { nameKey: categoryKey }) })}
            />
            {stacked ? (
              series.map((s, i) => (
                <RadialBar
                  key={s.key}
                  className="radial-segment"
                  dataKey={s.key}
                  name={s.label}
                  stackId="stack"
                  fill={seriesColour(i)}
                  stroke={SURFACE}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              ))
            ) : (
              <RadialBar
                className="radial-ring"
                dataKey={first.key}
                name={first.label}
                cornerRadius={4}
                isAnimationActive={false}
              >
                {data.map((row, i) => (
                  <Cell key={`${String(row[categoryKey])}-${i}`} fill={seriesColour(i)} />
                ))}
                {labels === "names" ? <LabelList dataKey={categoryKey} content={nameLabel} /> : null}
              </RadialBar>
            )}
            {totalLabel !== undefined ? <Total total={formatValue(total)} label={totalLabel} half={half} /> : null}
          </RechartsRadialBarChart>
        </ChartContainer>
      )}
    />
  );
}
