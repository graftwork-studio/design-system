---
"@graftwork/ui": minor
---

New component: PieChart. It has the same written summary and "View as table" toggle as the other charts, and its table lists each slice's label and value.

- `variant`: pie or donut. On a donut, `totalLabel` shows the total in the middle.
- `labels`: none, values or names, drawn outside the slices. The legend always names every slice.
- `highlight` takes a category value and draws that slice larger. Its table row says "(highlighted)".
- Two series draw two rings.

A pie shows at most four slices, one per chart colour. With more rows, the fourth slice is "Other (n categories)" and the table still lists every row. A 2px gap in the surface colour separates neighbouring slices, so each one meets 3:1 against the card and against its neighbours. The chart is focusable, and the arrow keys move the tooltip from slice to slice.
