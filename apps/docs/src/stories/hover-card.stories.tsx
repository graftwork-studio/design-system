import { HoverCard } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/HoverCard",
  component: HoverCard,
  parameters: { controls: { disable: true } },
} as Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "HoverCard")?.render()}</>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Ana Silva" });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await waitFor(() => expect(screen.getByText("Design systems lead")).toBeVisible(), { timeout: 2000 });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Design systems lead")).toBeNull(), { timeout: 2000 });
  },
};
