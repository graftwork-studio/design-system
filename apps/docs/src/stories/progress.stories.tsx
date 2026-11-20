import { Progress } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: { label: "Uploading report.csv", value: 60, className: "max-w-sm" },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("progressbar", { name: "Uploading report.csv" });
    await expect(bar).toHaveAttribute("aria-valuenow", "60");
    await expect(within(canvasElement).getByText("60%")).toBeVisible();
  },
};

export const Indeterminate: Story = { args: { isIndeterminate: true, label: "Preparing export" } };
export const Complete: Story = { args: { value: 100, label: "Upload complete" } };
