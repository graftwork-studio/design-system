import { RadialChart } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const data = [
  { browser: "Browser A", visitors: 275 },
  { browser: "Browser B", visitors: 200 },
  { browser: "Browser C", visitors: 187 },
  { browser: "Other", visitors: 90 },
];

const meta = {
  title: "Components/RadialChart",
  component: RadialChart,
  args: {
    title: "Visitors by browser",
    summary: "Browser A brought the most visitors, 275. Other browsers together brought 90.",
    data,
    categoryKey: "browser",
    series: [{ key: "visitors", label: "Visitors" }],
  },
} satisfies Meta<typeof RadialChart>;

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

const bars = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll(".recharts-radial-bar-sector")];

export const Chart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A written summary is always visible, and the legend names every ring.
    await expect(canvas.getByText(/Browser A brought the most visitors/)).toBeVisible();
    await expect(bars(canvasElement)).toHaveLength(data.length);
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
    // Arrow keys move the tooltip from ring to ring.
    await userEvent.keyboard("{ArrowRight}");
    const tooltip = canvasElement.querySelector(".recharts-tooltip-wrapper") as HTMLElement;
    await expect(tooltip).toHaveTextContent(/Browser B\s*200/);

    // The table shows each ring's label and value.
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

export const Names: Story = {
  args: { labels: "names" },
  play: async ({ canvasElement }) => {
    const labels = [...canvasElement.querySelectorAll(".radial-label")];
    await expect(labels.map((l) => l.textContent)).toEqual(data.map((row) => row.browser));
    // Names stay inside the chart and clear of every ring.
    const chart = (canvasElement.querySelector("[data-slot=chart]") as HTMLElement).getBoundingClientRect();
    const rings = bars(canvasElement).map((b) => b.getBoundingClientRect());
    for (const label of labels.map((l) => l.getBoundingClientRect())) {
      await expect(label.left).toBeGreaterThanOrEqual(chart.left);
      for (const ring of rings) {
        // Rings start at the top, so a name to the left of the centre line never meets one.
        await expect(label.right).toBeLessThanOrEqual(ring.left + ring.width);
      }
    }
  },
};

export const SingleRingWithTotal: Story = {
  args: {
    title: "Visitors this month",
    summary: "1,260 visitors this month, 63% of the 2,000 target.",
    data: [{ month: "November", visitors: 1260 }],
    categoryKey: "month",
    totalLabel: "Visitors",
    max: 2000,
  },
  play: async ({ canvasElement }) => {
    await expect((canvasElement.querySelector(".radial-total") as SVGTextElement).textContent).toBe("1,260Visitors");
    await expect(bars(canvasElement)).toHaveLength(1);
  },
};

export const StackedHalf: Story = {
  args: {
    title: "Visitors by device",
    summary: "1,860 visitors in January: 1,260 on desktop and 600 on mobile.",
    data: [{ month: "January", desktop: 1260, mobile: 600 }],
    categoryKey: "month",
    series: [
      { key: "desktop", label: "Desktop" },
      { key: "mobile", label: "Mobile" },
    ],
    shape: "half",
    totalLabel: "Visitors",
  },
  play: async ({ canvasElement }) => {
    // One segment per series, separated by a 2px gap in the surface colour.
    const segments = bars(canvasElement);
    await expect(segments).toHaveLength(2);
    for (const segment of segments) {
      await expect(segment.getAttribute("stroke")).toBe("var(--gw-color-surface-raised)");
      await expect(segment.getAttribute("stroke-width")).toBe("2");
    }
    await expect((canvasElement.querySelector(".radial-total") as SVGTextElement).textContent).toBe("1,860Visitors");
    await expect(await tableRows(canvasElement)).toEqual([["January", "1,260", "600"]]);
  },
};

const many = ["Search", "Direct", "Email", "Social", "Referral", "Ads"].map((channel, i) => ({ channel, visits: 420 - i * 60 }));

export const MoreThanFourRings: Story = {
  args: {
    title: "Visits by channel",
    summary: "Search brought the most visits, 420. Ads brought the fewest, 120.",
    data: many,
    categoryKey: "channel",
    series: [{ key: "visits", label: "Visits" }],
  },
  play: async ({ canvasElement }) => {
    // Six rings can't be drawn, so the table shows instead, with a note and no toggle.
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/more than the 4 rings this chart can draw/)).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "View as chart" })).toBeNull();
    const table = canvas.getByRole("grid", { name: "Visits by channel" });
    await expect(within(table).getAllByRole("row")).toHaveLength(many.length + 1);
  },
};

export const TableView: Story = { args: { defaultView: "table" } };
