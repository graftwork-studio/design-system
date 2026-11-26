---
"@graftwork/ui": minor
---

Charts: shared options.

- `icon` on a series: a Lucide icon shown beside the series' swatch in the legend and beside its marker in the tooltip.
- `formatCategory` on every chart: formats category names on the axis and in labels, the legend, tooltips and the table.
- `tooltipIndicator` (dot, line or none) and `tooltipLabel` (category or none) on BarChart, LineChart and AreaChart.
- `tooltipTotal` on a stacked BarChart: adds a total row to the tooltip.
- Fix: tooltips now format values with `formatValue`, as the table and labels already did. With the default formatter, nothing changes.
