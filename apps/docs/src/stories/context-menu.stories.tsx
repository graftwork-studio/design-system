import { ContextMenu } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: { controls: { disable: true } },
} as Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "ContextMenu")?.render()}</>,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: /Right-click/ });
    await userEvent.pointer({ keys: "[MouseRight]", target: trigger });
    const item = await screen.findByRole("menuitem", { name: /Open/ });
    await waitFor(() => expect(item).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};
