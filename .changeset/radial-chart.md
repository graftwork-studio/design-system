---
"@graftwork/ui": minor
---

New component: RadialChart. It has the same written summary and "View as table" toggle as the other charts, and its table lists each ring's label and value.

- With one series, each row is a ring. Several rings span three quarters of a circle, leaving room for `labels="names"` beside where each ring starts.
- With two or more series and one row, the series stack into one ring, separated by a 2px gap in the surface colour.
- `shape`: full or half (a semicircle).
- `totalLabel` shows the total in the middle. `max` sets the value of a complete ring, for progress towards a target.

It draws at most four rings, one per chart colour. With more rows, the chart can't be drawn, so the table shows instead, with a note saying why. There's no background track, because a ring ending against one would fall below 3:1. The chart is focusable, and the arrow keys move the tooltip from ring to ring.
