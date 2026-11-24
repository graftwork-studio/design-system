import { AreaChart } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const series = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

const meta = {
  title: "Components/AreaChart",
  component: AreaChart,
  args: {
    title: "Visitors by device, January to June",
    summary: "Total visitors peaked at 505 in February. Desktop led every month except April, when mobile reached 190.",
    data,
    categoryKey: "month",
    series,
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A written summary is always visible.
    await expect(canvas.getByText(/Total visitors peaked at 505/)).toBeVisible();
    // One fill and one line per series, with a surface-coloured gap between each line and the fill above it.
    await expect(canvasElement.querySelectorAll(".area-fill")).toHaveLength(series.length);
    await expect(canvasElement.querySelectorAll(".area-line")).toHaveLength(series.length);
    const gaps = [...canvasElement.querySelectorAll(".area-gap .recharts-area-curve")];
    await expect(gaps).toHaveLength(series.length);
    for (const gap of gaps) {
      await expect(gap.getAttribute("stroke")).toBe("var(--gw-color-surface-raised)");
      await expect(Number(gap.getAttribute("stroke-width"))).toBeGreaterThanOrEqual(6);
    }

    // The toggle comes first, then the chart, which is labelled by the title and summary.
    const toggle = canvas.getByRole("button", { name: "View as table" });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.tab();
    const surface = canvas.getByRole("application", { name: "Visitors by device, January to June" });
    await expect(surface).toHaveFocus();
    await expect(surface).toHaveAccessibleDescription(/Total visitors peaked at 505/);
    await expectFocusRing(canvasElement.querySelector("[data-slot=chart]") as Element);

    // The table shows the same data as the chart.
    await userEvent.click(toggle);
    const table = await canvas.findByRole("grid", { name: "Visitors by device, January to June" });
    const rows = within(table).getAllByRole("row").slice(1);
    await expect(rows).toHaveLength(data.length);
    for (const [index, row] of data.entries()) {
      const cells = [...(rows[index] as HTMLElement).querySelectorAll("[role=rowheader], [role=gridcell]")];
      await expect(cells.map((cell) => cell.textContent)).toEqual([
        row.month,
        row.desktop.toLocaleString(),
        row.mobile.toLocaleString(),
      ]);
    }
    await expect(canvas.getByRole("button", { name: "View as chart" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("application", { name: "Visitors by device, January to June" })).toBeVisible();
  },
};

export const SingleSeries: Story = {
  args: {
    series: [{ key: "desktop", label: "Desktop" }],
    summary: "Desktop visitors peaked at 305 in February and settled at about 210 a month.",
  },
};

export const Linear: Story = { args: { curve: "linear" } };

export const Step: Story = { args: { curve: "step" } };

export const Percent: Story = {
  args: {
    stacking: "percent",
    data: data.map((row) => ({ ...row, other: Math.round(row.desktop / 4) })),
    series: [...series, { key: "other", label: "Other" }],
    summary: "Desktop was the largest share every month except April. The table shows the visitor counts behind each share.",
  },
  play: async ({ canvasElement }) => {
    // The value axis shows shares of the total.
    const canvas = within(canvasElement);
    await expect(canvas.getByText("100%")).toBeVisible();
    await expect(canvas.getByText("50%")).toBeVisible();
  },
};

export const FourSeries: Story = {
  args: {
    data: data.map((row) => ({ ...row, tablet: Math.round(row.mobile / 2), other: Math.round(row.desktop / 5) })),
    series: [...series, { key: "tablet", label: "Tablet" }, { key: "other", label: "Other" }],
    summary: "Four series, one for each chart colour.",
  },
};

export const TableView: Story = { args: { defaultView: "table" } };
