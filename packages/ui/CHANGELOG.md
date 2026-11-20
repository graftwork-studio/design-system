# @graftwork/ui

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
