import { PieChart } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const data = [
  { browser: "Browser A", visitors: 275, returning: 120 },
  { browser: "Browser B", visitors: 200, returning: 90 },
  { browser: "Browser C", visitors: 187, returning: 60 },
  { browser: "Other", visitors: 90, returning: 30 },
];

const meta = {
  title: "Components/PieChart",
  component: PieChart,
  args: {
    title: "Visitors by browser",
    summary: "Browser A brought the most visitors, 275 of 752. Other browsers together brought 90.",
    data,
    categoryKey: "browser",
    series: [{ key: "visitors", label: "Visitors" }],
  },
} satisfies Meta<typeof PieChart>;

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

const sectors = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll(".recharts-pie-sector .recharts-sector")];

export const Chart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A written summary is always visible.
    await expect(canvas.getByText(/Browser A brought the most visitors/)).toBeVisible();
    // One slice per row, separated by a 2px gap in the surface colour.
    const slices = sectors(canvasElement);
    await expect(slices).toHaveLength(data.length);
    for (const slice of slices) {
      await expect(slice.getAttribute("stroke")).toBe("var(--gw-color-surface-raised)");
      await expect(slice.getAttribute("stroke-width")).toBe("2");
    }
    // The legend names every slice.
    const legend = canvasElement.querySelector("ul[aria-hidden]") as HTMLElement;
    await expect([...legend.querySelectorAll("li")].map((li) => li.textContent)).toEqual(data.map((row) => row.browser));

    // The toggle comes first, then the chart, which is labelled by the title and summary.
    const toggle = canvas.getByRole("button", { name: "View as table" });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.tab();
    const surface = canvas.getByRole("application", { name: "Visitors by browser" });
    await expect(surface).toHaveFocus();
    await expect(surface).toHaveAccessibleDescription(/Browser A brought the most visitors/);
    await expectFocusRing(canvasElement.querySelector("[data-slot=chart]") as Element);
    // Arrow keys move the tooltip from slice to slice.
    await userEvent.keyboard("{ArrowRight}");
    const tooltip = canvasElement.querySelector(".recharts-tooltip-wrapper") as HTMLElement;
    await expect(tooltip).toHaveTextContent(/Browser B\s*200/);

    // The table shows each slice's label and value.
    await userEvent.click(toggle);
    const table = await canvas.findByRole("grid", { name: "Visitors by browser" });
    const rows = within(table).getAllByRole("row").slice(1);
    await expect(rows.map((row) => [...row.querySelectorAll("[role=rowheader], [role=gridcell]")].map((c) => c.textContent))).toEqual(
      data.map((row) => [row.browser, String(row.visitors)]),
    );
    await expect(canvas.getByRole("button", { name: "View as chart" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("application", { name: "Visitors by browser" })).toBeVisible();
  },
};

export const Donut: Story = {
  args: { variant: "donut" },
  play: async ({ canvasElement }) => {
    // The slices leave a hole in the middle.
    for (const slice of sectors(canvasElement)) {
      await expect(slice.getAttribute("d")).toMatch(/L/);
    }
    await expect(canvasElement.querySelector(".pie-total")).toBeNull();
  },
};

export const DonutWithTotal: Story = {
  args: { variant: "donut", totalLabel: "Visitors" },
  play: async ({ canvasElement }) => {
    const total = canvasElement.querySelector(".pie-total") as SVGTextElement;
    await expect(total.textContent).toBe("752Visitors");
  },
};

export const Values: Story = {
  args: { labels: "values" },
  play: async ({ canvasElement }) => {
    const labels = [...canvasElement.querySelectorAll(".pie-label")];
    await expect(labels.map((l) => l.textContent)).toEqual(data.map((row) => String(row.visitors)));
    await expectLabelsInside(canvasElement);
  },
};

export const Names: Story = {
  args: { labels: "names", variant: "donut" },
  play: async ({ canvasElement }) => {
    const labels = [...canvasElement.querySelectorAll(".pie-label")];
    await expect(labels.map((l) => l.textContent)).toEqual(data.map((row) => row.browser));
    await expectLabelsInside(canvasElement);
  },
};

/** Labels stay inside the chart and don't overlap each other. */
async function expectLabelsInside(canvasElement: HTMLElement) {
  const chart = (canvasElement.querySelector("[data-slot=chart]") as HTMLElement).getBoundingClientRect();
  const boxes = [...canvasElement.querySelectorAll(".pie-label")].map((l) => l.getBoundingClientRect());
  for (const box of boxes) {
    await expect(box.left).toBeGreaterThanOrEqual(chart.left);
    await expect(box.right).toBeLessThanOrEqual(chart.right);
    await expect(box.top).toBeGreaterThanOrEqual(chart.top);
    await expect(box.bottom).toBeLessThanOrEqual(chart.bottom);
  }
  for (const [i, a] of boxes.entries()) {
    for (const b of boxes.slice(i + 1)) {
      const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      await expect(overlap).toBe(false);
    }
  }
}

export const Highlight: Story = {
  args: {
    variant: "donut",
    highlight: "Browser B",
    summary: "Browser B, highlighted, brought 200 of 752 visitors.",
  },
  play: async ({ canvasElement }) => {
    // The highlighted slice is drawn larger, and the table says which it is.
    await expect(canvasElement.querySelectorAll(".pie-highlight")).toHaveLength(1);
    const rows = await tableRows(canvasElement);
    await expect(rows[1]).toEqual(["Browser B (highlighted)", "200"]);
  },
};

export const TwoRings: Story = {
  args: {
    series: [
      { key: "visitors", label: "Visitors" },
      { key: "returning", label: "Returning visitors" },
    ],
    summary: "Browser A led for all visitors and for returning visitors, with 275 and 120.",
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".recharts-pie")).toHaveLength(2);
    await expect(sectors(canvasElement)).toHaveLength(data.length * 2);
    await expect(await tableRows(canvasElement)).toEqual(
      data.map((row) => [row.browser, String(row.visitors), String(row.returning)]),
    );
  },
};

const many = [
  { channel: "Search", visits: 420 },
  { channel: "Direct", visits: 310 },
  { channel: "Email", visits: 150 },
  { channel: "Social", visits: 90 },
  { channel: "Referral", visits: 60 },
  { channel: "Ads", visits: 30 },
];

export const MoreThanFourSlices: Story = {
  args: {
    title: "Visits by channel",
    summary: "Search and direct visits made up most of the 1,060 visits. Social, referral and ads together brought 180.",
    data: many,
    categoryKey: "channel",
    series: [{ key: "visits", label: "Visits" }],
    labels: "values",
  },
  play: async ({ canvasElement }) => {
    // From the fifth row on, the rest are combined into "Other"; the table still lists every row.
    await expect(sectors(canvasElement)).toHaveLength(4);
    const legend = canvasElement.querySelector("ul[aria-hidden]") as HTMLElement;
    await expect([...legend.querySelectorAll("li")].map((li) => li.textContent)).toEqual([
      "Search",
      "Direct",
      "Email",
      "Other (3 categories)",
    ]);
    await expect([...canvasElement.querySelectorAll(".pie-label")].map((l) => l.textContent)).toContain("180");
    await expect(await tableRows(canvasElement)).toEqual(many.map((row) => [row.channel, String(row.visits)]));
  },
};

export const TableView: Story = { args: { defaultView: "table" } };
