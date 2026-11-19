import { BarChart } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const data = [
  { month: "Jul", signups: 420, upgrades: 64 },
  { month: "Aug", signups: 510, upgrades: 71 },
  { month: "Sep", signups: 480, upgrades: 90 },
  { month: "Oct", signups: 620, upgrades: 104 },
];

const meta = {
  title: "Components/BarChart",
  component: BarChart,
  args: {
    title: "Sign-ups and upgrades",
    summary: "Sign-ups grew from 420 in July to 620 in October. Upgrades rose every month, reaching 104.",
    data,
    categoryKey: "month",
    series: [
      { key: "signups", label: "Sign-ups" },
      { key: "upgrades", label: "Upgrades" },
    ],
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A written summary is always visible.
    await expect(canvas.getByText(/Sign-ups grew from 420/)).toBeVisible();
    // Bars carry direct labels, so colour is never the only cue.
    await expect(canvasElement.querySelectorAll(".recharts-label-list").length).toBeGreaterThan(0);

    // Keyboard users reach the data through the table view.
    const toggle = canvas.getByRole("button", { name: "View as table" });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    const table = await canvas.findByRole("grid", { name: "Sign-ups and upgrades" });
    await expect(within(table).getByText("620")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "View as chart" })).toHaveFocus();
  },
};

export const SingleSeries: Story = {
  args: { series: [{ key: "signups", label: "Sign-ups" }], summary: "Sign-ups grew from 420 in July to 620 in October." },
};

export const TableView: Story = { args: { defaultView: "table" } };
