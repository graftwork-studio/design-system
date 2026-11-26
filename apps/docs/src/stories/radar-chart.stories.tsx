import { RadarChart } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const data = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const meta = {
  title: "Components/RadarChart",
  component: RadarChart,
  args: {
    title: "Desktop visitors, January to June",
    summary: "Desktop visitors peaked at 305 in February and fell to 73 in April.",
    data,
    categoryKey: "month",
    series: [{ key: "desktop", label: "Desktop" }],
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The table rows as text, then back to the chart so the snapshot shows it. */
async function tableRows(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "View as table" }));
  const table = await canvas.findByRole("grid");
  const rows = within(table)
    .getAllByRole("row")
    .slice(1)
    .map((row) => [...row.querySelectorAll("[role=rowheader], [role=gridcell]")].map((cell) => cell.textContent));
  await userEvent.click(canvas.getByRole("button", { name: "View as chart" }));
  return rows;
}

/** Axis labels stay inside the chart and don't overlap each other. */
async function expectAxisLabelsInside(canvasElement: HTMLElement) {
  const chart = (canvasElement.querySelector("[data-slot=chart]") as HTMLElement).getBoundingClientRect();
  const boxes = [...canvasElement.querySelectorAll(".recharts-polar-angle-axis-tick text")].map((t) => t.getBoundingClientRect());
  await expect(boxes).toHaveLength(data.length);
  for (const box of boxes) {
    await expect(box.left).toBeGreaterThanOrEqual(chart.left);
    await expect(box.right).toBeLessThanOrEqual(chart.right);
    await expect(box.top).toBeGreaterThanOrEqual(chart.top);
    await expect(box.bottom).toBeLessThanOrEqual(chart.bottom);
  }
  for (const [i, a] of boxes.entries()) {
    for (const b of boxes.slice(i + 1)) {
      await expect(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom).toBe(false);
    }
  }
}

export const Chart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Desktop visitors peaked at 305/)).toBeVisible();
    // A filled polygon, with its outline over a surface-coloured gap, on a grid.
    await expect(canvasElement.querySelectorAll("g.radar-fill")).toHaveLength(1);
    await expect(canvasElement.querySelectorAll("g.radar-line")).toHaveLength(1);
    const gap = canvasElement.querySelector(".radar-gap path.recharts-polygon") as SVGPathElement;
    await expect(gap.getAttribute("stroke")).toBe("var(--gw-color-surface-raised)");
    // The grid is drawn in chart.axis, which meets 3:1 against the surface.
    const gridLines = [...canvasElement.querySelectorAll(".recharts-polar-grid [stroke]")];
    await expect(gridLines.length).toBeGreaterThan(0);
    for (const line of gridLines) await expect(line.getAttribute("stroke")).toBe("var(--gw-color-chart-axis)");
    await expectAxisLabelsInside(canvasElement);

    // The toggle comes first, then the chart, which is labelled by the title and summary.
    const toggle = canvas.getByRole("button", { name: "View as table" });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.tab();
    const surface = canvas.getByRole("application", { name: "Desktop visitors, January to June" });
    await expect(surface).toHaveFocus();
    await expect(surface).toHaveAccessibleDescription(/Desktop visitors peaked at 305/);
    await expectFocusRing(canvasElement.querySelector("[data-slot=chart]") as Element);
    // Arrow keys move the tooltip from axis to axis.
    await userEvent.keyboard("{ArrowRight}");
    const tooltip = canvasElement.querySelector(".recharts-tooltip-wrapper") as HTMLElement;
    await expect(tooltip).toHaveTextContent(/305/);

    // The table shows the same data as the chart.
    await userEvent.click(toggle);
    const table = await canvas.findByRole("grid", { name: "Desktop visitors, January to June" });
    const rows = within(table).getAllByRole("row").slice(1);
    await expect(rows.map((row) => [...row.querySelectorAll("[role=rowheader], [role=gridcell]")].map((c) => c.textContent))).toEqual(
      data.map((row) => [row.month, String(row.desktop)]),
    );
    await expect(canvas.getByRole("button", { name: "View as chart" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("application", { name: "Desktop visitors, January to June" })).toBeVisible();
  },
};

export const Dots: Story = {
  args: { points: "dots" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".recharts-radar-dot")).toHaveLength(data.length);
  },
};

export const Multiple: Story = {
  args: {
    series: [
      { key: "desktop", label: "Desktop" },
      { key: "mobile", label: "Mobile" },
    ],
    title: "Visitors by device, January to June",
    summary: "Desktop led every month except April, when mobile reached 190.",
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll("g.radar-line")).toHaveLength(2);
    await expect(canvasElement.querySelectorAll("g.radar-gap")).toHaveLength(2);
    const gridWidth = () => (canvasElement.querySelector(".recharts-polar-grid") as SVGGElement).getBoundingClientRect().width;
    const before = gridWidth();
    await expect(await tableRows(canvasElement)).toEqual(data.map((row) => [row.month, String(row.desktop), String(row.mobile)]));
    // Back from the table, the chart is drawn at the same size.
    await expect(gridWidth()).toBeCloseTo(before, 0);
  },
};

export const Lines: Story = {
  args: {
    ...Multiple.args,
    variant: "lines",
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll("g.radar-fill")).toHaveLength(0);
    await expect(canvasElement.querySelectorAll("g.radar-line")).toHaveLength(2);
  },
};

export const CircleGrid: Story = {
  args: { grid: "circle" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".recharts-polar-grid-concentric-circle").length).toBeGreaterThan(0);
  },
};

export const NoGrid: Story = {
  args: { grid: "none" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector(".radar-grid")).toBeNull();
  },
};

const many = Array.from({ length: 10 }, (_, i) => ({ month: `Month ${i + 1}`, desktop: 100 + i * 10 }));

export const MoreThanEightAxes: Story = {
  args: {
    data: many,
    summary: "Desktop visitors rose steadily, from 100 to 190.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/more than the 8 axes this chart can label/)).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "View as chart" })).toBeNull();
  },
};

export const TableView: Story = { args: { defaultView: "table" } };
