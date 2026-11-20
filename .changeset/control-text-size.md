---
"@graftwork/ui": minor
"@graftwork/tokens": patch
---

Controls now use the 14px body size by default.

- Button and Toggle text is 12px at `sm`, 14px at `md` and 16px at `lg` (was 14, 16 and 18).
- Input, Textarea, InputGroup and Combobox are 14px from the `md` breakpoint (768px) up, and 16px below it so iPhone Safari doesn't zoom in when they're tapped.
- The Select trigger, Select and Combobox options, DropdownMenu items, Accordion triggers and Tabs are 14px everywhere.
- Pagination links keep 14px text at the small button height.
