# Changesets

Every pull request that changes `@graftwork/tokens` or `@graftwork/ui` needs a changeset. Run `pnpm changeset`, choose the bump and write one or two sentences in British English for the changelog.

The two packages are released together at the same version.

| Change | Bump |
| --- | --- |
| Remove or rename a token, component or prop; or a behaviour change apps must adapt to | Major |
| Add something, change a token value, or deprecate something | Minor |
| Fix with no API change | Patch |

Deprecate before removing. A major changeset must include a migration note.

Merging to `main` updates the "Version Packages" pull request. Merging that pull request releases: it publishes to npm, creates tags and GitHub releases, and deploys Storybook. Only David merges it.
