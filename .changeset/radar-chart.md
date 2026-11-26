---
"@graftwork/ui": minor
"@graftwork/tokens": minor
---

New component: RadarChart, and a new token, `color.chart.axis`.

RadarChart has the same written summary and "View as table" toggle as the other charts. Each row is an axis and each series a polygon.

- `variant`: filled (the default) or lines.
- `points`: none or dots.
- `grid`: polygon, circle or none.

Each polygon's outline meets 3:1 against the card, with a 2px gap in the surface colour where it crosses another polygon's fill. A radar has no value axis, so its grid is how values are read. The grid is drawn in the new `color.chart.axis` token, at 3:1 against the surface in every theme: 3.27:1 light, 3.56:1 dark and 4.74:1 high contrast. `color.chart.grid`, which the bar, line and area charts use, is unchanged.

A radar chart takes 3 to 8 axes. With more, the labels can't fit at 320px, so the table shows instead, with a note. The chart is focusable, and the arrow keys move the tooltip from axis to axis.
