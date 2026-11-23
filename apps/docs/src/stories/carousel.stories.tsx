import { Carousel } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: { controls: { disable: true } },
} as Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Carousel")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previous = canvas.getByRole("button", { name: "Previous slide" });
    const next = canvas.getByRole("button", { name: "Next slide" });
    await waitFor(() => expect(next).toBeEnabled());
    await expect(previous).toBeDisabled();
    await userEvent.click(next);
    await waitFor(() => expect(previous).toBeEnabled());
    await userEvent.click(previous);
    await waitFor(() => expect(previous).toBeDisabled());
  },
};
