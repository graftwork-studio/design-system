---
"@graftwork/ui": minor
"@graftwork/tokens": minor
---

Component sizes now match shadcn/ui (aria-nova), and the minimum target size is the WCAG 2.5.8 AA 24 × 24px (was the AAA 44 × 44px).

- Button and Toggle: 28 / 32 / 36px tall at `sm` / `md` / `lg`.
- Input, Select, Combobox, InputGroup, Tabs and Pagination: 32px tall. Textarea starts at 64px.
- Checkbox and radio: 16px. Switch: 32 × 18px. Slider: 4px track, 12px thumb.
- Menu items and list options: 28px rows. Accordion triggers: 40px. Table cells: 8px padding.
- Avatar: 24 / 32 / 40px. Badge: 20px. Kbd: 20px.
- Card, Dialog and Sheet: 16px padding. Popover: 10px. Alert, Tooltip and Empty use aria-nova's padding.
- Fields have 8px between label, description, control and error.
- Tokens: `target.min` is 24px. `hit-area` extends a target to at least 24 × 24px.

Typography (14px body and controls, 12 / 14 / 16px buttons) and corner radius are unchanged.
