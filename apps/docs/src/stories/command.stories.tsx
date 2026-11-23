import { Command } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { clearField, typeInto } from "./test-helpers.js";

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
    await typeInto(canvas.getByRole("searchbox"), "archive");
    await expect(canvas.getByRole("menuitem", { name: /Archive project/ })).toBeVisible();
    await expect(canvas.queryByRole("menuitem", { name: /New project/ })).toBeNull();
    await clearField(canvas.getByRole("searchbox"));
  },
};
