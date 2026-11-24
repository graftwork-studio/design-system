---
"@graftwork/ui": patch
---

`AreaChart` draws a 2px gap in the surface colour along each side of every area's line. In a stack, each line now touches only that gap, never the fill of the area above it, so it meets 3:1 there as well as against the card. No props change.
