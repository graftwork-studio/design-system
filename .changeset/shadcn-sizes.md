---
"@graftwork/ui": major
"@graftwork/tokens": major
---

Align the design system with shadcn/ui (aria-nova, neutral theme), and move the accessibility baseline from selected AAA rules to WCAG 2.2 AA.

**Sizes.** Buttons and toggles are 28 / 32 / 36px. Inputs, Select, Combobox, Tabs and Pagination are 32px. Checkboxes and radios are 16px, menu rows 28px, and cards, dialogs and sheets have 16px padding. The minimum target is 24 × 24px (was 44 × 44px).

**Colours.** Light and dark use shadcn's neutral theme with a near-black (light) or near-white (dark) primary. Links use the text colour, and info states are neutral. Eight values that fail AA use the nearest passing colour (`-aa` tokens). The high-contrast theme is unchanged.

**Type and radius.** Each text size has shadcn's line height, so 14px text sits on a 20px line. Buttons are 12.8 / 14 / 14px. Card and dialog titles are 16px medium. Badge, Kbd and Tooltip are 12px. Radius is 6 / 8 / 10 / 14px.

**Migration.**

- If your axe checks include `wcag2aaa`, remove it: text contrast is now 4.5:1, so the AAA 7:1 check will fail.
- Check layouts that relied on the old control heights or the 44px target size.
- Replace any use of the blue primary as a brand signal: `action.primary`, `focus.ring`, `icon.brand`, `text.link` and `chart.series-1` are no longer blue in light and dark.
