# Graftwork design system

Tokens and React components for Graftwork apps.

| Package | What it is |
| --- | --- |
| [`@graftwork/tokens`](packages/tokens) | Design tokens in DTCG format, built into CSS variables, a Tailwind v4 theme and JS constants |
| [`@graftwork/ui`](packages/ui) | Components built on shadcn/ui with React Aria (coming in M2) |

## Working on tokens

Tokens live in `packages/tokens/tokens` and this repo is the only place they're edited.

- `primitives/` holds the raw palette and scales. The colour palette is generated from the brand colour by `pnpm --filter @graftwork/tokens palette`; don't edit it by hand.
- `semantic/` holds the tokens apps use: `base.tokens.json` for everything theme-independent, and one colour file per theme (light, dark, high contrast).

Every semantic colour declares a contrast role in `$extensions."studio.graftwork"`, and every text token lists the backgrounds it sits on. The build runs the contrast validator first and fails if any pair falls below its threshold in any theme:

| Role | Minimum ratio |
| --- | --- |
| `text` | 7:1 |
| `large-text` | 4.5:1 |
| `non-text` | 3:1 |
| `background`, `decorative` | not checked |

**The focus ring** is checked against every surface rather than against the component it surrounds. It's 2px wide with a 2px offset, so a gap of surface colour always separates it from the component, and it only ever touches the surface. That's exactly what WCAG 2.4.13 measures. (No single colour can be 3:1 against both a white page and a dark filled button.) The validator fails if `color.focus.ring` leaves out any `color.surface.*` token.

```bash
pnpm install
pnpm --filter @graftwork/tokens build      # validates, then builds dist/
pnpm --filter @graftwork/tokens exec node scripts/validate-contrast.ts --verbose   # every pair and its ratio
```
