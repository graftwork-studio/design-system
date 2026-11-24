# @graftwork/ui

## 2.6.0

### Minor Changes

- [#75](https://github.com/graftwork-studio/design-system/pull/75) [`2c4b43d`](https://github.com/graftwork-studio/design-system/commit/2c4b43d784dd3fada8af6edced7a2d450436802f) Thanks [@david-kenny](https://github.com/david-kenny)! - Add `AreaChart`. Like `BarChart` and `LineChart`, it has a written summary and a "View as table" toggle showing the same data. Series are stacked. `stacking="percent"` shows each series' share of the total instead, and `curve` sets how points are joined (`smooth`, `linear` or `step`). The chart is focusable, and the arrow keys move its tooltip from point to point.

- [#73](https://github.com/graftwork-studio/design-system/pull/73) [`8a50870`](https://github.com/graftwork-studio/design-system/commit/8a50870a1f48b04a802e742b45386b7281a16745) Thanks [@david-kenny](https://github.com/david-kenny)! - Space the chart series colours further apart so every pair stays distinguishable, including under protanopia, deuteranopia and tritanopia. Light: `chart.series-2` to `[#707070](https://github.com/graftwork-studio/design-system/issues/707070)`, `-3` to `[#454545](https://github.com/graftwork-studio/design-system/issues/454545)`, `-4` to `[#171717](https://github.com/graftwork-studio/design-system/issues/171717)`. Dark: `chart.series-1` to `#e5e5e5`, `-2` to `#b9b9b9`, `-3` to `#8e8e8e`, `-4` to `[#646464](https://github.com/graftwork-studio/design-system/issues/646464)`. High contrast: `chart.series-4` to neutral `[#737373](https://github.com/graftwork-studio/design-system/issues/737373)`. Every series still meets 3:1 against the card surface. Charts look different; no code changes are needed.

- [#74](https://github.com/graftwork-studio/design-system/pull/74) [`c758102`](https://github.com/graftwork-studio/design-system/commit/c7581023f007f952227bc762dc133345254138fe) Thanks [@david-kenny](https://github.com/david-kenny)! - Add `LineChart`. Like `BarChart`, it has a written summary and a "View as table" toggle showing the same data. `curve` sets how points are joined (`smooth`, `linear` or `step`) and `points` adds a dot on each data point (`dots`) or a dot and its value (`values`). The chart is focusable, and the arrow keys move its tooltip from point to point. `BarChart` is unchanged.

### Patch Changes

- Updated dependencies [[`8a50870`](https://github.com/graftwork-studio/design-system/commit/8a50870a1f48b04a802e742b45386b7281a16745)]:
  - @graftwork/tokens@2.6.0

## 2.5.1

### Patch Changes

- [#70](https://github.com/graftwork-studio/design-system/pull/70) [`b9f1f9b`](https://github.com/graftwork-studio/design-system/commit/b9f1f9ba173acc13d935c3da80682e5431a3df76) Thanks [@david-kenny](https://github.com/david-kenny)! - AppShellHeader follows the rounded corners of the inset sidebar variant's main area, instead of covering them with its background.
- Updated dependencies []:
  - @graftwork/tokens@2.5.1

## 2.5.0

### Minor Changes

- [#67](https://github.com/graftwork-studio/design-system/pull/67) [`289b67b`](https://github.com/graftwork-studio/design-system/commit/289b67b41940438c69ad3336dd0fec98bd64ec11) Thanks [@david-kenny](https://github.com/david-kenny)! - Add AppShell (with AppShellHeader and AppShellContent) and AuthLayout, promoted from the app template's blocks. AppShell puts a Sidebar, a sticky header with the sidebar trigger, and the page's main area together. AuthLayout lays out log-in and sign-up pages: centred or split beside an image, on a default or muted background.

### Patch Changes

- Updated dependencies []:
  - @graftwork/tokens@2.5.0

## 2.4.1

### Patch Changes

- [#50](https://github.com/graftwork-studio/design-system/pull/50) [`b1eb7ab`](https://github.com/graftwork-studio/design-system/commit/b1eb7ab0c73bc258170bf20a5d2d07c1a08877a8) Thanks [@david-kenny](https://github.com/david-kenny)! - Keep ResizableHandle out of the tab order and accessibility tree until it has a value, which fixes an accessibility error in server-rendered pages.
- Updated dependencies []:
  - @graftwork/tokens@2.4.1

## 2.4.0

### Minor Changes

- [#48](https://github.com/graftwork-studio/design-system/pull/48) [`b2ebda5`](https://github.com/graftwork-studio/design-system/commit/b2ebda56963f16d2299931000f3db987ad9a2751) Thanks [@david-kenny](https://github.com/david-kenny)! - Add AspectRatio, Carousel, DirectionProvider, Drawer, HoverCard, InputOTP, Menubar, NavigationMenu, Resizable and Typography, completing shadcn/ui's component list.

### Patch Changes

- Updated dependencies []:
  - @graftwork/tokens@2.4.0

## 2.3.0

### Minor Changes

- [#43](https://github.com/graftwork-studio/design-system/pull/43) [`c607dae`](https://github.com/graftwork-studio/design-system/commit/c607daeef7a6fef6c596d3dc4750e06caa2877d6) Thanks [@david-kenny](https://github.com/david-kenny)! - Add Calendar, RangeCalendar, DatePicker, DateRangePicker, DataTable, ContextMenu and CodeBlock. DataTable uses TanStack Table, and date components use @internationalized/date.

### Patch Changes

- Updated dependencies []:
  - @graftwork/tokens@2.3.0

## 2.2.0

### Minor Changes

- [#39](https://github.com/graftwork-studio/design-system/pull/39) [`59aed63`](https://github.com/graftwork-studio/design-system/commit/59aed63552059b70cbe422050388e63513329d5a) Thanks [@david-kenny](https://github.com/david-kenny)! - Add 15 components from shadcn/ui: Field, ToggleGroup, ButtonGroup, NativeSelect, ScrollArea, Item, Sidebar, Command, Message, MessageScroller, Bubble, Attachment, Marker, Questionnaire and Trace.

### Patch Changes

- Updated dependencies []:
  - @graftwork/tokens@2.2.0

## 2.1.0

### Minor Changes

- [#37](https://github.com/graftwork-studio/design-system/pull/37) [`e6e623b`](https://github.com/graftwork-studio/design-system/commit/e6e623baaf62a497691c327dde681cda9de79992) Thanks [@david-kenny](https://github.com/david-kenny)! - Add `ComponentShowcase` at `@graftwork/ui/showcase`: a working example of every component, for example pages. New components appear on those pages with each package update, and CI fails if an exported component is missing from it.
  
  Token descriptions now match the WCAG AA contrast rule, the neutral icon colour and the 20px body line height. Token values are unchanged.

### Patch Changes

- Updated dependencies [[`e6e623b`](https://github.com/graftwork-studio/design-system/commit/e6e623baaf62a497691c327dde681cda9de79992)]:
  - @graftwork/tokens@2.1.0

## 2.0.2

### Patch Changes

- [#35](https://github.com/graftwork-studio/design-system/pull/35) [`0f7225d`](https://github.com/graftwork-studio/design-system/commit/0f7225dfcab8e863d1fb27767e887d6607890bc8) Thanks [@david-kenny](https://github.com/david-kenny)! - Make the info border neutral in the high-contrast theme. `color.border.status.info` is now `neutral.800` instead of a dark blue.
- Updated dependencies [[`0f7225d`](https://github.com/graftwork-studio/design-system/commit/0f7225dfcab8e863d1fb27767e887d6607890bc8)]:
  - @graftwork/tokens@2.0.2

## 2.0.1

### Patch Changes

- [#30](https://github.com/graftwork-studio/design-system/pull/30) [`884a202`](https://github.com/graftwork-studio/design-system/commit/884a202da27cced7f70b1ffce9a1395a778120a6) Thanks [@david-kenny](https://github.com/david-kenny)! - Fix the info border, which stayed blue in 2.0.0. `color.border.status.info` now uses shadcn's neutral border in the light and dark themes, matching the other info colours.
- Updated dependencies [[`884a202`](https://github.com/graftwork-studio/design-system/commit/884a202da27cced7f70b1ffce9a1395a778120a6)]:
  - @graftwork/tokens@2.0.1

## 2.0.0

### Major Changes

- [#28](https://github.com/graftwork-studio/design-system/pull/28) [`7c8adc9`](https://github.com/graftwork-studio/design-system/commit/7c8adc9d67615a568144d50a82b0405daf8cb2f0) Thanks [@david-kenny](https://github.com/david-kenny)! - Align the design system with shadcn/ui (aria-nova, neutral theme), and move the accessibility baseline from selected AAA rules to WCAG 2.2 AA.
  
  **Sizes.** Buttons and toggles are 28 / 32 / 36px. Inputs, Select, Combobox, Tabs and Pagination are 32px. Checkboxes and radios are 16px, menu rows 28px, and cards, dialogs and sheets have 16px padding. The minimum target is 24 × 24px (was 44 × 44px).
  
  **Colours.** Light and dark use shadcn's neutral theme with a near-black (light) or near-white (dark) primary. Links use the text colour, and info states are neutral. Eight values that fail AA use the nearest passing colour (`-aa` tokens). The high-contrast theme is unchanged.
  
  **Type and radius.** Each text size has shadcn's line height, so 14px text sits on a 20px line. Buttons are 12.8 / 14 / 14px. Card and dialog titles are 16px medium. Badge, Kbd and Tooltip are 12px. Radius is 6 / 8 / 10 / 14px.
  
  **Migration.**
  
  - If your axe checks include `wcag2aaa`, remove it: text contrast is now 4.5:1, so the AAA 7:1 check will fail.
  - Check layouts that relied on the old control heights or the 44px target size.
  - Replace any use of the blue primary as a brand signal: `action.primary`, `focus.ring`, `icon.brand`, `text.link` and `chart.series-1` are no longer blue in light and dark.

### Minor Changes

- [#27](https://github.com/graftwork-studio/design-system/pull/27) [`413923e`](https://github.com/graftwork-studio/design-system/commit/413923e64863413c549af834f5e07e39a74a6547) Thanks [@david-kenny](https://github.com/david-kenny)! - Modals dim the page in the dark theme. `color.overlay.scrim` is now black in the dark theme (it was the page's own near-black, so the page background didn't change), and dark `color.surface.overlay` is a step lighter (`neutral.850`, was `neutral.900`) so dialogs, sheets, popovers, menus and toasts sit above the dimmed page. Light and high-contrast are unchanged.

### Patch Changes

- Updated dependencies [[`413923e`](https://github.com/graftwork-studio/design-system/commit/413923e64863413c549af834f5e07e39a74a6547), [`7c8adc9`](https://github.com/graftwork-studio/design-system/commit/7c8adc9d67615a568144d50a82b0405daf8cb2f0)]:
  - @graftwork/tokens@2.0.0

## 1.3.0

### Minor Changes

- [#25](https://github.com/graftwork-studio/design-system/pull/25) [`33b8015`](https://github.com/graftwork-studio/design-system/commit/33b80153bfad7861453ded91710a7d8d542ae477) Thanks [@david-kenny](https://github.com/david-kenny)! - Controls now use the 14px body size by default.
  
  - Button and Toggle text is 12px at `sm`, 14px at `md` and 16px at `lg` (was 14, 16 and 18).
  - Input, Textarea, InputGroup and Combobox are 14px from the `md` breakpoint (768px) up, and 16px below it so iPhone Safari doesn't zoom in when they're tapped.
  - The Select trigger, Select and Combobox options, DropdownMenu items, Accordion triggers and Tabs are 14px everywhere.
  - Pagination links keep 14px text at the small button height.

### Patch Changes

- Updated dependencies [[`33b8015`](https://github.com/graftwork-studio/design-system/commit/33b80153bfad7861453ded91710a7d8d542ae477)]:
  - @graftwork/tokens@1.3.0

## 1.2.0

### Minor Changes

- [#22](https://github.com/graftwork-studio/design-system/pull/22) [`0c0b6dc`](https://github.com/graftwork-studio/design-system/commit/0c0b6dcb927a3948d9565f30dbf34cf800010e3a) Thanks [@david-kenny](https://github.com/david-kenny)! - Body text is now 14px (0.875rem at the browser default). A new `font.size.body` token (`--gw-font-size-body`, Tailwind `text-body`) is applied to `body`, and Card and Table use it for their content. The `html` root stays at `100%`, so rem still follows the user's font setting, and `font.size.md` stays at 1rem for inputs, Select and Button so iOS Safari doesn't zoom in on focus.

- [#23](https://github.com/graftwork-studio/design-system/pull/23) [`cc952a7`](https://github.com/graftwork-studio/design-system/commit/cc952a705279e6ad295dde8f9c791132e1750c6f) Thanks [@david-kenny](https://github.com/david-kenny)! - Add 30 components from shadcn/ui, built on React Aria and styled with our tokens: Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Checkbox, Collapsible, Combobox, Dialog, DropdownMenu, Empty, InputGroup, Kbd, Label, Pagination, Popover, Progress, RadioGroup, Separator, Sheet, Skeleton, Slider, Spinner, Switch, Tabs, Textarea, Toast, Toggle and Tooltip.
  
  Toast uses React Aria's Toast (still marked unstable upstream) rather than Sonner: render `<Toaster />` once and call `toast({ title })`.
  
  Tokens: new `color.overlay.scrim` (Tailwind `bg-overlay-scrim/60`) for the layer behind modals. Stylesheet: new `focus-ring-drawn` utility, which draws the focus ring on a part that shows its parent's focus.

- [#22](https://github.com/graftwork-studio/design-system/pull/22) [`0c0b6dc`](https://github.com/graftwork-studio/design-system/commit/0c0b6dcb927a3948d9565f30dbf34cf800010e3a) Thanks [@david-kenny](https://github.com/david-kenny)! - Switch the sans font from Noto Sans to Geist. `font.family.sans` is now `"Geist Variable", Geist, system-ui, sans-serif`, and `@graftwork/ui` loads it from `@fontsource-variable/geist` in place of `@fontsource-variable/noto-sans`.

### Patch Changes

- Updated dependencies [[`0c0b6dc`](https://github.com/graftwork-studio/design-system/commit/0c0b6dcb927a3948d9565f30dbf34cf800010e3a), [`cc952a7`](https://github.com/graftwork-studio/design-system/commit/cc952a705279e6ad295dde8f9c791132e1750c6f), [`0c0b6dc`](https://github.com/graftwork-studio/design-system/commit/0c0b6dcb927a3948d9565f30dbf34cf800010e3a)]:
  - @graftwork/tokens@1.2.0

## 1.1.1

### Patch Changes

- [#13](https://github.com/graftwork-studio/design-system/pull/13) [`815cacb`](https://github.com/graftwork-studio/design-system/commit/815cacb1142ab69a18408db707cfd99831e645c8) Thanks [@david-kenny](https://github.com/david-kenny)! - Revert the brand colour to blue (`#2883de`) after the cascade test. The brand scale is back to exactly what it was in 1.0.1.
- Updated dependencies [[`815cacb`](https://github.com/graftwork-studio/design-system/commit/815cacb1142ab69a18408db707cfd99831e645c8)]:
  - @graftwork/tokens@1.1.1

## 1.1.0

### Minor Changes

- [#11](https://github.com/graftwork-studio/design-system/pull/11) [`9a0027d`](https://github.com/graftwork-studio/design-system/commit/9a0027dd8e526ade08587b8912227dd7b25e209e) Thanks [@david-kenny](https://github.com/david-kenny)! - Change the brand colour from blue (`#2883de`) to purple (`#8e3fd6`), regenerating the brand scale from it. This is a temporary change to test that a design-system release reaches apps through Renovate. A patch release will revert it.

### Patch Changes

- Updated dependencies [[`9a0027d`](https://github.com/graftwork-studio/design-system/commit/9a0027dd8e526ade08587b8912227dd7b25e209e)]:
  - @graftwork/tokens@1.1.0

## 1.0.1

### Patch Changes

- [#9](https://github.com/graftwork-studio/design-system/pull/9) [`4fd1bb0`](https://github.com/graftwork-studio/design-system/commit/4fd1bb0da29b1f95cb9a8a4eaeca8493d0d222dd) Thanks [@david-kenny](https://github.com/david-kenny)! - Remove the paragraph spacing after the last paragraph in a `prose` block, so it no longer leaves a large gap before whatever follows.
- Updated dependencies [[`4588dbd`](https://github.com/graftwork-studio/design-system/commit/4588dbdce6966be9492f593fe607394dd29daed0)]:
  - @graftwork/tokens@1.0.1

## 1.0.0

### Major Changes

- [#3](https://github.com/graftwork-studio/design-system/pull/3) [`c403dbd`](https://github.com/graftwork-studio/design-system/commit/c403dbd160b5ff037a4754a3265a4651df00547b) Thanks [@david-kenny](https://github.com/david-kenny)! - First release of the Graftwork design system.
  
  - `@graftwork/tokens`: design tokens in DTCG format for light, dark and high-contrast themes, built into CSS variables, a Tailwind v4 theme and JS constants. Every text and non-text colour pair is checked for contrast when the tokens build.
  - `@graftwork/ui`: Button, Input, Select, Card, Table, BarChart and ThemeToggle, built on shadcn/ui with React Aria, plus the stylesheet apps import.

### Patch Changes

- Updated dependencies [[`c403dbd`](https://github.com/graftwork-studio/design-system/commit/c403dbd160b5ff037a4754a3265a4651df00547b)]:
  - @graftwork/tokens@1.0.0
