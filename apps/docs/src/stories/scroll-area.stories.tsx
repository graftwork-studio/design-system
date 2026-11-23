import { ScrollArea } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const meta = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  parameters: { controls: { disable: true } },
} as Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "ScrollArea")?.render()}</>,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Release notes" });
    await userEvent.tab();
    await expect(region).toHaveFocus();
    await expectFocusRing(region);
  },
};
