# @graftwork/tokens

## 1.2.0

### Minor Changes

- [#22](https://github.com/graftwork-studio/design-system/pull/22) [`0c0b6dc`](https://github.com/graftwork-studio/design-system/commit/0c0b6dcb927a3948d9565f30dbf34cf800010e3a) Thanks [@david-kenny](https://github.com/david-kenny)! - Body text is now 14px (0.875rem at the browser default). A new `font.size.body` token (`--gw-font-size-body`, Tailwind `text-body`) is applied to `body`, and Card and Table use it for their content. The `html` root stays at `100%`, so rem still follows the user's font setting, and `font.size.md` stays at 1rem for inputs, Select and Button so iOS Safari doesn't zoom in on focus.

- [#23](https://github.com/graftwork-studio/design-system/pull/23) [`cc952a7`](https://github.com/graftwork-studio/design-system/commit/cc952a705279e6ad295dde8f9c791132e1750c6f) Thanks [@david-kenny](https://github.com/david-kenny)! - Add 30 components from shadcn/ui, built on React Aria and styled with our tokens: Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Checkbox, Collapsible, Combobox, Dialog, DropdownMenu, Empty, InputGroup, Kbd, Label, Pagination, Popover, Progress, RadioGroup, Separator, Sheet, Skeleton, Slider, Spinner, Switch, Tabs, Textarea, Toast, Toggle and Tooltip.
  
  Toast uses React Aria's Toast (still marked unstable upstream) rather than Sonner: render `<Toaster />` once and call `toast({ title })`.
  
  Tokens: new `color.overlay.scrim` (Tailwind `bg-overlay-scrim/60`) for the layer behind modals. Stylesheet: new `focus-ring-drawn` utility, which draws the focus ring on a part that shows its parent's focus.

- [#22](https://github.com/graftwork-studio/design-system/pull/22) [`0c0b6dc`](https://github.com/graftwork-studio/design-system/commit/0c0b6dcb927a3948d9565f30dbf34cf800010e3a) Thanks [@david-kenny](https://github.com/david-kenny)! - Switch the sans font from Noto Sans to Geist. `font.family.sans` is now `"Geist Variable", Geist, system-ui, sans-serif`, and `@graftwork/ui` loads it from `@fontsource-variable/geist` in place of `@fontsource-variable/noto-sans`.

## 1.1.1

### Patch Changes

- [#13](https://github.com/graftwork-studio/design-system/pull/13) [`815cacb`](https://github.com/graftwork-studio/design-system/commit/815cacb1142ab69a18408db707cfd99831e645c8) Thanks [@david-kenny](https://github.com/david-kenny)! - Revert the brand colour to blue (`#2883de`) after the cascade test. The brand scale is back to exactly what it was in 1.0.1.

## 1.1.0

### Minor Changes

- [#11](https://github.com/graftwork-studio/design-system/pull/11) [`9a0027d`](https://github.com/graftwork-studio/design-system/commit/9a0027dd8e526ade08587b8912227dd7b25e209e) Thanks [@david-kenny](https://github.com/david-kenny)! - Change the brand colour from blue (`#2883de`) to purple (`#8e3fd6`), regenerating the brand scale from it. This is a temporary change to test that a design-system release reaches apps through Renovate. A patch release will revert it.

## 1.0.1

### Patch Changes

- [#7](https://github.com/graftwork-studio/design-system/pull/7) [`4588dbd`](https://github.com/graftwork-studio/design-system/commit/4588dbdce6966be9492f593fe607394dd29daed0) Thanks [@david-kenny](https://github.com/david-kenny)! - Fix responsive classes such as `lg:grid-cols-2` breaking an app's CSS build. The Tailwind theme now writes breakpoints as literal values, because CSS variables don't work inside media queries.

## 1.0.0

### Major Changes

- [#3](https://github.com/graftwork-studio/design-system/pull/3) [`c403dbd`](https://github.com/graftwork-studio/design-system/commit/c403dbd160b5ff037a4754a3265a4651df00547b) Thanks [@david-kenny](https://github.com/david-kenny)! - First release of the Graftwork design system.
  
  - `@graftwork/tokens`: design tokens in DTCG format for light, dark and high-contrast themes, built into CSS variables, a Tailwind v4 theme and JS constants. Every text and non-text colour pair is checked for contrast when the tokens build.
  - `@graftwork/ui`: Button, Input, Select, Card, Table, BarChart and ThemeToggle, built on shadcn/ui with React Aria, plus the stylesheet apps import.
