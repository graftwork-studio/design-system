import { Menubar } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Menubar",
  component: Menubar,
  parameters: { controls: { disable: true } },
} as Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Menubar")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByRole("button", { name: "File" });
    await userEvent.tab();
    await expect(file).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}{Enter}");
    const menu = await screen.findByRole("menu", { name: "File" });
    await waitFor(() => expect(menu).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(file).toHaveFocus());
  },
};
