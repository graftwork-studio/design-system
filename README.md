# Graftwork design system

Tokens and React components for Graftwork apps.

| Package | What it is |
| --- | --- |
| [`@graftwork/tokens`](packages/tokens) | Design tokens in DTCG format, built into CSS variables, a Tailwind v4 theme and JS constants |
| [`@graftwork/ui`](packages/ui) | React components built on shadcn/ui with React Aria, plus the stylesheet apps import |
| [`apps/docs`](apps/docs) | Storybook: the component docs, and where component tests run |

## Working on tokens

Tokens live in `packages/tokens/tokens` and this repo is the only place they're edited.

- `primitives/` holds the raw palette and scales. `color.tokens.json` is generated from the brand colour by `pnpm --filter @graftwork/tokens palette`; don't edit it by hand. `shadcn.tokens.json` holds shadcn/ui's neutral theme, which the light and dark themes use. Names ending `-aa` are the nearest colour to shadcn's that passes WCAG AA.
- `semantic/` holds the tokens apps use: `base.tokens.json` for everything theme-independent, and one colour file per theme (light, dark, high contrast).

Every semantic colour declares a contrast role in `$extensions."studio.graftwork"`, and every text token lists the backgrounds it sits on. The build runs the contrast validator first and fails if any pair falls below its threshold in any theme:

| Role | Minimum ratio |
| --- | --- |
| `text` | 4.5:1 |
| `large-text` | 3:1 |
| `non-text` | 3:1 |
| `background`, `decorative` | not checked |

**The focus ring** is checked against every surface rather than against the component it surrounds. It's 2px wide with a 2px offset, so a gap of surface colour always separates it from the component, and it only ever touches the surface. That's exactly what WCAG 2.4.13 measures. (No single colour can be 3:1 against both a white page and a dark filled button.) The validator fails if `color.focus.ring` leaves out any `color.surface.*` token.

**Chart series** must also stay distinguishable from each other, because a chart's series are told apart by colour alone (the table view is the alternative). The build checks every pair of `color.chart.series-*` tokens in every theme and fails if any pair's CIEDE2000 difference is below 10, both as the colours are and under simulated protanopia, deuteranopia and tritanopia (Machado 2009, severity 1.0, applied in linear RGB). The threshold and the simulation live in `packages/tokens/src/series.ts`.

```bash
pnpm install
pnpm --filter @graftwork/tokens build      # validates, then builds dist/
pnpm --filter @graftwork/tokens exec node scripts/validate-contrast.ts --verbose   # every pair, with its ratio or CIEDE2000 difference
```

## Checks

Every pull request runs these, and all of them are required:

| Check | What it covers |
| --- | --- |
| Tokens (contrast, tests, types) | The contrast and chart series validators, token build, unit tests |
| Lint and types | ESLint with `jsx-a11y`, Stylelint, our own rules for Tailwind classes, TypeScript |
| Component tests (interaction and axe) | Every story's play function (keyboard, states, focus), then axe |
| Visual snapshots and axe in every theme | Every story in light, dark and high contrast: axe, no sideways scrolling at 320px, and screenshots at 320, 768 and 1280px |

Lint bans removing an outline without a replacement ring, justified text, font sizes in px, and raw colours in class names.

```bash
pnpm lint                                # ESLint and Stylelint
node --test tooling/                     # proves the lint bans fire
pnpm --filter @graftwork/docs test       # story interaction tests and axe
pnpm --filter @graftwork/ui test        # every component is in the showcase
pnpm --filter @graftwork/docs dev        # Storybook on http://localhost:6006
pnpm test                                # all unit, showcase and story tests
```

### Adding a component

1. Add it to `packages/ui/src/components` and export it from `packages/ui/src/index.ts`.
2. Add a Storybook story.
3. Add a working example to `showcaseEntries` in `packages/ui/src/showcase/component-showcase.tsx`. CI fails until every exported component is used there.
4. Add its Figma properties to the naming contract in `apps/docs/src/introduction.mdx`, and to the Figma table in `CLAUDE.md` in `app-template` and `test-app`.
5. Add a changeset, and commit visual baselines for its stories.

**Charts** follow the same steps, plus:

- Build on the internal `ChartFrame` in `packages/ui/src/components/chart-frame.tsx`. It gives every chart the heading, the required written summary, the "View as table" toggle, the legend and the table view, so they behave the same across charts. Don't export it.
- Turn on Recharts' `accessibilityLayer`, so the chart is focusable and its tooltip moves with the arrow keys. Name it with the title and describe it with the summary.
- Use the `chart.series-*` tokens through `seriesColour()`, never raw colours. The table view is the alternative to colour (see the Charts rules in `KICKOFF.md`), so series need no patterns, but their colours must stay distinguishable from each other in every theme, including under protanopia, deuteranopia and tritanopia. The build checks this for you: it fails if any two series are less than 10 apart in CIEDE2000 (see [Working on tokens](#working-on-tokens)).
- A grid that values are read from, where there's no value axis (as on RadarChart), uses `chart.axis` at 3:1 and is dashed. No 3:1 grey is far enough from every series grey to tell them apart by colour, so the dash does it.
- Every mark meets 3:1 against everything it touches. Where marks touch each other, as stacked areas do, separate them with a gap in the surface colour, as AreaChart does.
- Turn off animation (`isAnimationActive={false}`), on the tooltip too.

The example pages in `app-template` and `test-app` render `<ComponentShowcase />` from `@graftwork/ui/showcase`, so the new component appears on them when they update to the release.

### Visual snapshots

Snapshots are rendered on Linux in the Playwright container, so baselines come from CI rather than your machine. When a change alters how something looks:

1. Add the `update-snapshots` label to your pull request. This runs the **Update visual snapshots** workflow.
2. Download its `visual-snapshots` artifact and check the images.
3. Commit them to `apps/docs/tests/__screenshots__`, then remove the label.

The workflow only runs when the label is added. If you push a change that affects the images, remove the label and add it again.

### Storybook in an embedded preview

Stories also run in a browser pane that doesn't have window focus. `.storybook/emulate-window-focus.ts` sends the focus events the browser skips, and only automated runs measure the focus ring, so CI still checks it. Keep the Storybook tab visible: browsers pause animation in background tabs, which can stall a story that opens and closes an overlay.

## Dependency updates

Renovate opens pull requests for this repo's dependencies after a 3-day delay, using `renovate.json`. They never merge themselves, because they can change what we publish. React Aria and `@internationalized/date` update together. If a pull request changes a dependency of a published package, add a changeset before merging.

The [Dependency Dashboard](https://github.com/graftwork-studio/design-system/issues/57) issue lists every pending and open update. Merge Renovate pull requests one at a time. Each merge leaves the others behind `main`, so Renovate rebases them and their checks run again before they can merge.

Renovate only sees repositories it has been given. To add one, go to the organisation's **Settings → GitHub Apps → Renovate → Configure**, add it under **Repository access** and save. It currently covers `design-system`, `app-template` and `test-app`.

Apps use the shared presets in [`renovate/`](renovate) instead.

On an app's design-system pull request, a workflow commits refreshed visual snapshots as `github-actions[bot]`. The `app` preset lists that author in `gitIgnoredAuthors`, so Renovate still treats the branch as its own: it keeps rebasing it when `main` moves and updates it to newer releases, and the pull request can merge itself. Without that, Renovate counts the commit as a manual edit and leaves the pull request behind `main` for good. A rebase drops the snapshot commit, and the workflow adds it again.

## Releasing

Releases use [Changesets](https://changesets.dev). Both packages share one version.

1. Every pull request that changes a package adds a changeset (`pnpm changeset`). See [`.changeset/README.md`](.changeset/README.md) for what counts as major, minor or patch.
2. Merging to `main` opens or updates the **Version Packages** pull request. GitHub holds CI on pull requests opened by GitHub Actions until a run is approved, so the release workflow approves it. Its approval step waits up to three minutes for the held run. If it fails, or Version Packages shows no checks, re-run the **Release** workflow from the Actions tab: it updates the pull request again and approves the new run, without publishing anything.
3. Merging **Version Packages** releases. The workflow builds and packs (with no publishing rights), then publishes to npm with provenance, tags, creates GitHub releases and deploys Storybook to <https://graftwork-studio.github.io/design-system/>.

To publish docs-only changes without a release, run the **Deploy Storybook** workflow from the Actions tab. It builds `main` and deploys it to GitHub Pages, with no npm access.

After a release that changes tokens or components, update Figma:

1. Update the variables and Graftwork components in the [Graftwork Design System](https://www.figma.com/design/8dIiSHbXjX1qwjqlaKkyXA/Graftwork-Design-System) file. The repo is the source of truth.
2. In Figma, open **Assets**, then the library icon, and **Publish** the changes so other files receive them.
3. Check the blocks in [Graftwork Blocks](https://www.figma.com/design/prmltYKyND4F2ioUj2oqtb/Graftwork-Blocks) in all three modes, as described in "Keeping Figma in step" in `BLOCKS.md` in `app-template`. Republish that library if anything changed.

When you build a Figma component by cloning another:

- Check that its text layers are still linked to the component's text properties (`title`, `summary` and so on). Cloning a component set can drop the link, so instances can't change the text.
- Binding a colour variable to a fill resets that fill's opacity to 100%. For a see-through fill bound to a variable, such as AreaChart's 40% areas, set the opacity on the layer instead.

If **Publish to npm** fails, check what reached npm (`npm view @graftwork/ui versions`) and whether the release's tags exist before doing anything else. When neither package went out, as happened with 2.5.1 when GitHub briefly failed to issue the signing token for provenance, open the failed run and choose **Re-run failed jobs**. The build and pack step isn't repeated, so the same packages publish.

Only David merges **Version Packages**. Publishing uses npm trusted publishing (OIDC) from `release.yml` in the `npm` environment, so no npm token is stored.

The first release (1.0.0) couldn't use trusted publishing, because npm only allows it for packages that already exist. It was published with a temporary token instead. npm now stages any publish made with a token that bypasses two-factor authentication, so 1.0.0 waited for approval on npmjs.com and went out without a provenance attestation. Every later release goes straight out with provenance.
