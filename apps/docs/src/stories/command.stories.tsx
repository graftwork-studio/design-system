import { Command } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/Command",
  component: Command,
  parameters: { controls: { disable: true } },
} as Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Command")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox"), "archive");
    await expect(canvas.getByRole("menuitem", { name: /Archive project/ })).toBeVisible();
    await expect(canvas.queryByRole("menuitem", { name: /New project/ })).toBeNull();
    await userEvent.clear(canvas.getByRole("searchbox"));
  },
};
