---
"@graftwork/ui": minor
---

DataTable: row reordering.

- `onReorder` turns on reordering. Each row gets a drag handle, and the table calls `onReorder` with every row id in the new order, so you reorder your `data` from it.
- Rows can be dragged with a pointer or moved with the keyboard: move onto the handle, press Enter, choose a position with the arrow keys, then press Enter to drop or Escape to cancel. React Aria announces each step to screen readers.
- Dragging a selected row moves every selected row with it. While the table is filtered, a row moves next to the row it's dropped beside, and hidden rows keep their places.
- Columns can't be sorted while `onReorder` is set, because a sorted table has no order of its own.
- Tables without `onReorder` don't change.
