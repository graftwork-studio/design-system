import { Calendar } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { controls: { disable: true } },
} as Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Calendar")?.render()}</>,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getAllByRole("grid")[0] as HTMLElement;
    const day = within(grid).getByRole("button", { name: /(March 20|20 March),? 2026/ });
    await userEvent.click(day);
    await expect(day).toHaveAttribute("aria-label", expect.stringContaining("selected"));
  },
};
