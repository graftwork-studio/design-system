import { createCn } from "cn/config";

// Font sizes from @graftwork/tokens that aren't t-shirt sizes. Without this,
// cn reads `text-body` as a text colour and drops it next to `text-text-default`.
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: ["body"] }] } },
});
