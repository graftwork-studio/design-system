---
"@graftwork/tokens": patch
---

Fix responsive classes such as `lg:grid-cols-2` breaking an app's CSS build. The Tailwind theme now writes breakpoints as literal values, because CSS variables don't work inside media queries.
