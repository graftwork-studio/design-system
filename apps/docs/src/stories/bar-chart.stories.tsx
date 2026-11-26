import { BarChart } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";

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

const browsers = [
  { browser: "Browser A", visitors: 275 },
  { browser: "Browser B", visitors: 200 },
  { browser: "Browser C", visitors: 187 },
  { browser: "Other", visitors: 90 },
];

const balance = [
  { month: "Jan", change: 186 },
  { month: "Feb", change: 205 },
  { month: "Mar", change: -207 },
  { month: "Apr", change: 173 },
  { month: "May", change: -209 },
  { month: "Jun", change: 214 },
];

/** The table rows as text, one array of cell texts per row. */
async function tableRows(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "View as table" }));
  const table = await canvas.findByRole("grid");
  const rows = within(table)
    .getAllByRole("row")
    .slice(1)
    .map((row) => [...row.querySelectorAll("[role=rowheader], [role=gridcell]")].map((cell) => cell.textContent));
  // Back to the chart, so the visual snapshot shows it.
  await userEvent.click(canvas.getByRole("button", { name: "View as chart" }));
  return rows;
}

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  play: async ({ canvasElement }) => {
    // Bars run from the left: each is wider than it is tall.
    const bar = canvasElement.querySelector(".recharts-bar-rectangle path") as SVGPathElement;
    const box = bar.getBBox();
    await expect(box.width).toBeGreaterThan(box.height);
    await expect(await tableRows(canvasElement)).toEqual(
      data.map((row) => [row.month, row.signups.toLocaleString(), row.upgrades.toLocaleString()]),
    );
  },
};

export const Stacked: Story = {
  args: {
    stacking: "stacked",
    summary: "Sign-ups and upgrades together grew from 484 in July to 724 in October.",
  },
  play: async ({ canvasElement }) => {
    // Stacked segments are separated by a 2px gap in the surface colour.
    const segments = [...canvasElement.querySelectorAll(".recharts-bar-rectangle path")];
    await expect(segments).toHaveLength(data.length * 2);
    for (const segment of segments) {
      await expect(segment.getAttribute("stroke")).toBe("var(--gw-color-surface-raised)");
      await expect(segment.getAttribute("stroke-width")).toBe("2");
    }
    // Each month's segments share one column.
    const xs = new Set(segments.map((s) => Math.round((s as SVGPathElement).getBBox().x)));
    await expect(xs.size).toBe(data.length);
  },
};

export const NoLabels: Story = {
  args: { labels: "none" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".recharts-label-list")).toHaveLength(0);
  },
};

export const InsideLabels: Story = {
  args: {
    orientation: "horizontal",
    labels: "inside",
    series: [{ key: "signups", label: "Sign-ups" }],
    summary: "Sign-ups grew from 420 in July to 620 in October.",
  },
  play: async ({ canvasElement }) => {
    // Category names move inside the bars, so the category axis is hidden.
    const labels = [...canvasElement.querySelectorAll(".bar-inside-label")];
    await expect(labels).toHaveLength(data.length);
    await expect(labels.map((l) => l.querySelector("text")?.textContent)).toEqual(data.map((row) => row.month));
    await expect(await tableRows(canvasElement)).toEqual(data.map((row) => [row.month, row.signups.toLocaleString()]));
  },
};

export const ColourByCategory: Story = {
  args: {
    title: "Visitors by browser",
    summary: "Browser A brought the most visitors, 275. Other browsers together brought 90.",
    data: browsers,
    categoryKey: "browser",
    series: [{ key: "visitors", label: "Visitors" }],
    colourBy: "category",
    orientation: "horizontal",
  },
  play: async ({ canvasElement }) => {
    // Each bar takes its own colour, and the legend names the categories.
    const bars = [...canvasElement.querySelectorAll(".recharts-bar-rectangle path")];
    await expect(new Set(bars.map((b) => b.getAttribute("stroke"))).size).toBe(browsers.length);
    // Value labels are text-coloured, not drawn in the bar's pattern.
    for (const label of canvasElement.querySelectorAll(".recharts-label-list text")) {
      await expect(getComputedStyle(label).fill).not.toMatch(/^url/);
    }
    const legend = canvasElement.querySelector("ul[aria-hidden]") as HTMLElement;
    await expect([...legend.querySelectorAll("li")].map((li) => li.textContent)).toEqual(browsers.map((b) => b.browser));
    await expect(await tableRows(canvasElement)).toEqual(browsers.map((b) => [b.browser, String(b.visitors)]));
  },
};

export const Negatives: Story = {
  args: {
    title: "Change in visitors",
    summary: "Visitors fell in March and May, by 207 and 209, and rose in the other four months.",
    data: balance,
    series: [{ key: "change", label: "Change" }],
    negatives: "distinct",
  },
  play: async ({ canvasElement }) => {
    // Negative bars take the second series colour and its striped pattern; positive bars the first.
    const bars = [...canvasElement.querySelectorAll(".recharts-bar-rectangle path")];
    await expect(bars.map((b) => b.getAttribute("stroke"))).toEqual(
      balance.map((row) => (row.change < 0 ? "var(--gw-color-chart-series-2)" : "var(--gw-color-chart-series-1)")),
    );
    const legend = canvasElement.querySelector("ul[aria-hidden]") as HTMLElement;
    await expect(legend.textContent).toContain("Change, negative");
    await expect(await tableRows(canvasElement)).toEqual(balance.map((row) => [row.month, row.change.toLocaleString()]));
  },
};

export const Highlight: Story = {
  args: {
    title: "Visitors by browser",
    summary: "Browser B, highlighted, brought 200 visitors, second only to Browser A.",
    data: browsers,
    categoryKey: "browser",
    series: [{ key: "visitors", label: "Visitors" }],
    colourBy: "category",
    highlight: "Browser B",
  },
  play: async ({ canvasElement }) => {
    // One ring, in the highlighted bar's colour, and the table says which row it is.
    const rings = canvasElement.querySelectorAll(".bar-highlight");
    await expect(rings).toHaveLength(1);
    await expect(rings[0]?.getAttribute("stroke")).toBe("var(--gw-color-chart-series-2)");
    const rows = await tableRows(canvasElement);
    await expect(rows[1]).toEqual(["Browser B (highlighted)", "200"]);
    await expect(rows.filter((row) => row[0]?.includes("(highlighted)"))).toHaveLength(1);
  },
};

export const TooltipTotal: Story = {
  args: {
    stacking: "stacked",
    tooltipTotal: true,
    tooltipIndicator: "line",
    summary: "Sign-ups and upgrades together grew from 484 in July to 724 in October.",
  },
  play: async ({ canvasElement }) => {
    // Hovering a column shows both values and their total.
    const segment = (canvasElement.querySelector(".recharts-bar-rectangle path") as Element).getBoundingClientRect();
    const wrapper = canvasElement.querySelector(".recharts-wrapper") as Element;
    await fireEvent.mouseMove(wrapper, { clientX: segment.x + segment.width / 2, clientY: segment.y + segment.height / 2 });
    const tooltip = canvasElement.querySelector(".recharts-tooltip-wrapper") as HTMLElement;
    await waitFor(() => expect(tooltip).toHaveTextContent(/Sign-ups\s*420/));
    await expect(tooltip).toHaveTextContent(/Total\s*484/);
  },
};

