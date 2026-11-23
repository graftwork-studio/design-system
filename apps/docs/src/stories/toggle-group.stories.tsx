import { ToggleGroup } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  parameters: { controls: { disable: true } },
} as Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "ToggleGroup")?.render()}</>,
  play: async ({ canvasElement }) => {
    const italic = within(canvasElement).getByRole("button", { name: "Italic" });
    await expect(italic).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(italic);
    await expect(italic).toHaveAttribute("aria-pressed", "true");
  },
};
