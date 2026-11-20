# @graftwork/tokens

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
