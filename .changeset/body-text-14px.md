---
"@graftwork/tokens": minor
"@graftwork/ui": minor
---

Body text is now 14px (0.875rem at the browser default). A new `font.size.body` token (`--gw-font-size-body`, Tailwind `text-body`) is applied to `body`, and Card and Table use it for their content. The `html` root stays at `100%`, so rem still follows the user's font setting, and `font.size.md` stays at 1rem for inputs, Select and Button so iOS Safari doesn't zoom in on focus.
