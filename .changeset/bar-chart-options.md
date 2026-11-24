---
"@graftwork/ui": minor
---

BarChart has six new options. Each one is off by default, so existing charts look and behave exactly as before.

- `orientation="horizontal"` draws bars from the left, with the categories down the side.
- `stacking="stacked"` stacks series in one bar per category. A 2px gap in the surface colour separates the segments, so each one meets 3:1 against its neighbours. Each segment's value sits in its middle when there's room.
- `labels="none"` hides the value labels. `labels="inside"` (horizontal only) puts each category name inside its bar and the value at the end.
- `colourBy="category"` gives each bar its own colour and pattern, for one series of up to four bars. The legend names the categories.
- `negatives="distinct"` gives negative values the second series colour and its striped pattern, for one series. The legend says which is which.
- `highlight` takes a category value and draws a ring round that bar. Its table row says "(highlighted)".

Labels drawn over a bar sit on a chip in the surface colour, so their contrast doesn't depend on the bar.
