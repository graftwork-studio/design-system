import { LineChart } from "@graftwork/ui";
import { GitCommitVerticalIcon, MonitorIcon, RepeatIcon } from "lucide-react";
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

/** Focuses the chart and moves to the second point, returning the tooltip. */
async function tooltipAtSecondPoint(canvasElement: HTMLElement) {
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");
  return canvasElement.querySelector(".recharts-tooltip-wrapper") as HTMLElement;
}

export const TooltipIndicatorLine: Story = {
  args: { tooltipIndicator: "line" },
  play: async ({ canvasElement }) => {
    const tooltip = await tooltipAtSecondPoint(canvasElement);
    await expect(tooltip).toHaveTextContent(/Feb/);
    // A thin bar beside each row, not a square.
    await expect(tooltip.querySelectorAll(".w-1")).toHaveLength(2);
  },
};

export const TooltipNoIndicator: Story = {
  args: { tooltipIndicator: "none" },
  play: async ({ canvasElement }) => {
    const tooltip = await tooltipAtSecondPoint(canvasElement);
    await expect(tooltip).toHaveTextContent(/Visitors\s*305/);
    await expect(tooltip.querySelectorAll("[class*='--color-bg']")).toHaveLength(0);
  },
};

export const TooltipNoLabel: Story = {
  args: { tooltipLabel: "none", tooltipIndicator: "none" },
  play: async ({ canvasElement }) => {
    const tooltip = await tooltipAtSecondPoint(canvasElement);
    await expect(tooltip).toHaveTextContent(/Visitors\s*305/);
    await expect(tooltip).not.toHaveTextContent(/Feb/);
  },
};

export const SeriesIcons: Story = {
  args: {
    series: [
      { key: "visitors", label: "Visitors", icon: MonitorIcon },
      { key: "returning", label: "Returning", icon: RepeatIcon },
    ],
  },
  play: async ({ canvasElement }) => {
    // Each legend entry keeps its swatch and adds the icon.
    const legend = canvasElement.querySelector("ul[aria-hidden]") as HTMLElement;
    for (const item of legend.querySelectorAll("li")) {
      await expect(item.querySelectorAll("svg")).toHaveLength(2);
    }
    // The tooltip shows the icon beside each row's marker.
    const tooltip = await tooltipAtSecondPoint(canvasElement);
    await expect(tooltip.querySelectorAll("svg.lucide")).toHaveLength(2);
    await expect(tooltip.querySelectorAll("[class*='--color-bg']")).toHaveLength(2);
  },
};

const months: Record<string, string> = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June" };

export const FormattedCategories: Story = {
  args: { formatCategory: (month) => `${months[month] ?? month} 2026`, formatValue: (value) => `${value} a day` },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Values and categories are formatted in the tooltip.
    const tooltip = await tooltipAtSecondPoint(canvasElement);
    await expect(tooltip).toHaveTextContent(/February 2026/);
    await expect(tooltip).toHaveTextContent(/305 a day/);
    // And in the table.
    await userEvent.click(canvas.getByRole("button", { name: "View as table" }));
    const table = await canvas.findByRole("grid");
    await expect(within(table).getByText("February 2026")).toBeVisible();
  },
};

const browsers = [
  { browser: "Browser A", visitors: 275 },
  { browser: "Browser B", visitors: 200 },
  { browser: "Browser C", visitors: 187 },
  { browser: "Other", visitors: 90 },
];

const browserArgs = {
  title: "Visitors by browser",
  summary: "Browser A brought the most visitors, 275, and other browsers the fewest, 90.",
  data: browsers,
  categoryKey: "browser",
  series: [{ key: "visitors", label: "Visitors" }],
};

export const DotsByCategory: Story = {
  args: { ...browserArgs, points: "dots", colourBy: "category" },
  play: async ({ canvasElement }) => {
    // One point per browser, each in its own colour with a surface ring.
    const dots = [...canvasElement.querySelectorAll(".line-category-dot")];
    await expect(dots.map((dot) => dot.getAttribute("fill"))).toEqual([1, 2, 3, 4].map((n) => `var(--gw-color-chart-series-${n})`));
    for (const dot of dots) await expect(dot.getAttribute("stroke")).toBe("var(--gw-color-surface-raised)");
    // The legend names the categories.
    const legend = canvasElement.querySelector("ul[aria-hidden]") as HTMLElement;
    await expect([...legend.querySelectorAll("li")].map((li) => li.textContent)).toEqual(browsers.map((row) => row.browser));
  },
};

export const Names: Story = {
  args: { ...browserArgs, points: "names", colourBy: "category", tooltipIndicator: "line", tooltipLabel: "none" },
  play: async ({ canvasElement }) => {
    // Each point is labelled with its category name.
    const labels = [...canvasElement.querySelectorAll(".recharts-label-list text")].map((text) => text.textContent);
    await expect(labels).toEqual(browsers.map((row) => row.browser));
  },
};

export const IconMarkers: Story = {
  args: { series: [{ key: "visitors", label: "Visitors", icon: GitCommitVerticalIcon }], points: "icons", tooltipLabel: "none" },
  play: async ({ canvasElement }) => {
    // The series icon marks every point, in the series colour over the surface.
    const icons = [...canvasElement.querySelectorAll(".line-icon")];
    await expect(icons).toHaveLength(data.length);
    await expect((icons[0] as HTMLElement).style.color).toBe("var(--gw-color-chart-series-1)");
  },
};
