# Progress

| Milestone | Status | Evidence |
| --- | --- | --- |
| M0: Checks | Done | `gh` signed in with `workflow` scope, `graftwork-studio` listed; Node 26.13.1 LTS; pnpm 12.21.0; Figma Professional plan, Full seat |
| M1: Repo and tokens | Done | [PR #1](https://github.com/graftwork-studio/design-system/pull/1): workspace, DTCG tokens for three themes, Style Dictionary build, contrast validator (198 pairs pass; build exits 1 on a 4.74:1 text pair) |
| M2: Components | Done | [PR #2](https://github.com/graftwork-studio/design-system/pull/2): seven components, Storybook, lint, interaction tests, axe and visual snapshots in every theme; `main` protected with four required checks |
| M3: First release | Done | [PR #3](https://github.com/graftwork-studio/design-system/pull/3) set up Changesets and the release workflow; [Version Packages PR #4](https://github.com/graftwork-studio/design-system/pull/4) released [1.0.0](https://github.com/graftwork-studio/design-system/actions/runs/44744305611): [`@graftwork/tokens`](https://www.npmjs.com/package/@graftwork/tokens), [`@graftwork/ui`](https://www.npmjs.com/package/@graftwork/ui), [Storybook](https://graftwork-studio.github.io/design-system/). npm staged the token publish for 2FA approval, and 1.0.0 has no provenance; later releases use trusted publishing |
