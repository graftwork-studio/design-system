import { DataTable, type DataTableColumn } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/DataTable",
  component: DataTable,
  parameters: { controls: { disable: true } },
} as Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "DataTable")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Filter clients" }), "orch");
    await waitFor(() => expect(canvas.getByRole("rowheader", { name: "Orchard" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("rowheader", { name: "Northwind" })).toBeNull());
    await userEvent.clear(canvas.getByRole("textbox", { name: "Filter clients" }));
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Filter clients" })).toHaveValue(""));
    await userEvent.click(canvas.getByRole("columnheader", { name: "Client" }));
    await waitFor(() => expect(canvas.getByRole("columnheader", { name: "Client" })).toHaveAttribute("aria-sort", "ascending"));
    await expect(canvas.getAllByRole("rowheader")[0]).toHaveTextContent("Beacon");
  },
};

type Section = { id: string; title: string; type: string; status: string };

const sections: Section[] = [
  { id: "cover", title: "Cover page", type: "Cover page", status: "In process" },
  { id: "contents", title: "Table of contents", type: "Table of contents", status: "Done" },
  { id: "summary", title: "Executive summary", type: "Narrative", status: "Done" },
  { id: "approach", title: "Technical approach", type: "Narrative", status: "In process" },
  { id: "design", title: "Design", type: "Narrative", status: "Not started" },
];

const sectionColumns: DataTableColumn<Section>[] = [
  { accessorKey: "title", header: "Section" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "status", header: "Status" },
];

function ReorderExample({ selectionMode }: { selectionMode?: "none" | "multiple" }) {
  const [rows, setRows] = React.useState(sections);
  return (
    <DataTable
      aria-label="Proposal sections"
      columns={sectionColumns}
      data={rows}
      getRowId={(row) => row.id}
      filterColumn="title"
      filterLabel="Filter sections"
      selectionMode={selectionMode}
      onReorder={(ids) => setRows(ids.map((id) => rows.find((row) => row.id === id)!))}
    />
  );
}

const order = (canvas: ReturnType<typeof within>) => canvas.getAllByRole("rowheader").map((cell: HTMLElement) => cell.textContent);

/** Focuses a row, then moves right onto its drag handle, as a keyboard user would. */
async function focusHandle(canvas: ReturnType<typeof within>, title: string) {
  const row = (canvas.getByRole("rowheader", { name: title }) as HTMLElement).closest('[role="row"]') as HTMLElement;
  row.focus();
  await userEvent.keyboard("{ArrowRight}");
  const handle = within(row).getByRole("button", { name: /^Drag / });
  await waitFor(() => expect(handle).toHaveFocus());
  return handle;
}

/** While dragging, presses the down arrow until the named drop position has focus. */
async function moveTo(name: string) {
  for (let step = 0; step < 12 && document.activeElement?.getAttribute("aria-label") !== name; step++) {
    await userEvent.keyboard("{ArrowDown}");
  }
  await expect(document.activeElement).toHaveAccessibleName(name);
}

/** Drag a row by its handle, or use the keyboard: move onto the handle, press Enter to pick the row up, use the arrow keys to choose where it goes, then Enter to drop it or Escape to cancel. */
export const Reorder: Story = {
  render: () => <ReorderExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Columns can't be sorted while rows can be reordered.
    await expect(canvas.getByRole("columnheader", { name: "Section" })).not.toHaveAttribute("aria-sort");
    const handle = await focusHandle(canvas, "Cover page");
    await expect(handle.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName("Insert between Cover page and Table of contents"));
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName("Insert between Executive summary and Technical approach"));
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(order(canvas)).toEqual(["Table of contents", "Executive summary", "Cover page", "Technical approach", "Design"]),
    );
  },
};

export const ReorderCancelled: Story = {
  name: "Reorder (cancelled)",
  render: () => <ReorderExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await focusHandle(canvas, "Design");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName("Insert after Design"));
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(handle).toHaveFocus());
    await expect(order(canvas)).toEqual(sections.map((section) => section.title));
  },
};

/** While filtered, a row moves next to the row it's dropped beside, and hidden rows keep their places. */
export const ReorderFiltered: Story = {
  name: "Reorder (filtered)",
  render: () => <ReorderExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Filter sections" }), "s");
    await waitFor(() => expect(order(canvas)).toEqual(["Table of contents", "Executive summary", "Design"]));
    await focusHandle(canvas, "Design");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName("Insert after Design"));
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName("Insert between Table of contents and Executive summary"));
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(order(canvas)).toEqual(["Table of contents", "Design", "Executive summary"]));
    // React Aria returns focus to the dropped row just after the drop, so retry until the filter keeps focus.
    const filter = canvas.getByRole("textbox", { name: "Filter sections" });
    await waitFor(() => userEvent.clear(filter));
    await waitFor(() =>
      expect(order(canvas)).toEqual(["Cover page", "Table of contents", "Design", "Executive summary", "Technical approach"]),
    );
  },
};

/** Dragging a selected row moves every selected row with it. */
export const ReorderWithSelection: Story = {
  name: "Reorder with selection",
  render: () => <ReorderExample selectionMode="multiple" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("row", { name: /Cover page/ }).querySelector<HTMLElement>('[role="checkbox"], input[type="checkbox"]')!);
    await userEvent.click(canvas.getByRole("row", { name: /Executive summary/ }).querySelector<HTMLElement>('[role="checkbox"], input[type="checkbox"]')!);
    const handle = await focusHandle(canvas, "Cover page");
    await expect(handle).toHaveAccessibleName("Drag 2 selected items");
    await userEvent.keyboard("{Enter}");
    await moveTo("Insert after Design");
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(order(canvas)).toEqual(["Table of contents", "Technical approach", "Design", "Cover page", "Executive summary"]),
    );
  },
};
