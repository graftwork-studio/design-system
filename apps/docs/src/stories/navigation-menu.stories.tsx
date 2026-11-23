import { NavigationMenu } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
  parameters: { controls: { disable: true } },
} as Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "NavigationMenu")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Products" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: /Analytics/ })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
