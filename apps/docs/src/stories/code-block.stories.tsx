import { CodeBlock } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  parameters: { controls: { disable: true } },
} as Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "CodeBlock")?.render()}</>,
  play: async ({ canvasElement }) => {
    const copy = within(canvasElement).getByRole("button", { name: "Copy code" });
    await userEvent.tab();
    await expect(copy).toHaveFocus();
    await userEvent.tab();
    const region = within(canvasElement).getByRole("region", { name: "save.tsx" });
    await expect(region).toHaveFocus();
    await expectFocusRing(region, { inset: true });
  },
};
