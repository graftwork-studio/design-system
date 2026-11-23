import { DatePicker } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: { controls: { disable: true } },
} as Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "DatePicker")?.render()}</>,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole("group", { name: "Start date" });
    await userEvent.click(within(group).getByRole("button"));
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};
