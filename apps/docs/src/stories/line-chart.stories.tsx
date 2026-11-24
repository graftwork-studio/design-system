import { LineChart } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const data = [
  { month: "Jan", visitors: 186, returning: 80 },
  { month: "Feb", visitors: 305, returning: 200 },
  { month: "Mar", visitors: 237, returning: 120 },
  { month: "Apr", visitors: 173, returning: 190 },
  { month: "May", visitors: 209, returning: 130 },
  { month: "Jun", visitors: 214, returning: 140 },
];

const series = [
  { key: "visitors", label: "Visitors" },
  { key: "returning", label: "Returning" },
];

const meta = {
  title: "Components/LineChart",
  component: LineChart,
  args: {
    title: "Visitors, January to June",
    summary: "Visitors peaked at 305 in February and settled at about 210 a month. Returning visitors were highest in February and April.",
    data,
    categoryKey: "month",
    series,
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A written summary is always visible.
    await expect(canvas.getByText(/Visitors peaked at 305/)).toBeVisible();
    // One line per series.
    await expect(canvasElement.querySelectorAll(".recharts-line-curve")).toHaveLength(series.length);

    // The toggle comes first, then the chart, which is labelled by the title and summary.
    const toggle = canvas.getByRole("button", { name: "View as table" });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.tab();
    const surface = canvas.getByRole("application", { name: "Visitors, January to June" });
    await expect(surface).toHaveFocus();
    await expect(surface).toHaveAccessibleDescription(/Visitors peaked at 305/);
    await expectFocusRing(canvasElement.querySelector("[data-slot=chart]") as Element);

    // The table shows the same data as the chart.
    await userEvent.click(toggle);
    const table = await canvas.findByRole("grid", { name: "Visitors, January to June" });
    const rows = within(table).getAllByRole("row").slice(1);
    await expect(rows).toHaveLength(data.length);
    for (const [index, row] of data.entries()) {
      const cells = [...(rows[index] as HTMLElement).querySelectorAll("[role=rowheader], [role=gridcell]")];
      await expect(cells.map((cell) => cell.textContent)).toEqual([
        row.month,
        row.visitors.toLocaleString(),
        row.returning.toLocaleString(),
      ]);
    }
    await expect(canvas.getByRole("button", { name: "View as chart" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("application", { name: "Visitors, January to June" })).toBeVisible();
  },
};

export const SingleSeries: Story = {
  args: {
    series: [{ key: "visitors", label: "Visitors" }],
    summary: "Visitors peaked at 305 in February and settled at about 210 a month.",
  },
};

export const Linear: Story = { args: { curve: "linear" } };

export const Step: Story = { args: { curve: "step" } };

export const Dots: Story = {
  args: { points: "dots" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".recharts-line-dot")).toHaveLength(data.length * series.length);
  },
};

export const Values: Story = {
  args: { points: "values", series: [{ key: "visitors", label: "Visitors" }] },
  play: async ({ canvasElement }) => {
    const labels = [...canvasElement.querySelectorAll(".recharts-label-list text")].map((label) => label.textContent);
    await expect(labels).toEqual(data.map((row) => row.visitors.toLocaleString()));
  },
};

export const FourSeries: Story = {
  args: {
    data: data.map((row) => ({ ...row, trials: Math.round(row.visitors / 3), upgrades: Math.round(row.returning / 4) })),
    series: [...series, { key: "trials", label: "Trials" }, { key: "upgrades", label: "Upgrades" }],
    summary: "Four series, one for each chart colour.",
  },
};

export const TableView: Story = { args: { defaultView: "table" } };
