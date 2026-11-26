---
"@graftwork/ui": minor
---

LineChart: `colourBy` (series or category) and two new `points` options.

- `colourBy="category"` gives each point its category's colour, with a ring in the surface colour and a legend by category. It takes one series of up to four points, with dots, values or names.
- `points="names"` labels each point with its category name.
- `points="icons"` draws the series icon at each point. Every series needs an `icon`.
