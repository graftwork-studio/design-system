import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const rows = [
  { id: "1", name: "Atlas", owner: "Priya Shah", status: "Live", updated: "18 Nov 2026" },
  { id: "2", name: "Beacon", owner: "Tom Okafor", status: "Draft", updated: "12 Nov 2026" },
  { id: "3", name: "Cobalt", owner: "Lena Fischer", status: "Live", updated: "3 Nov 2026" },
  { id: "4", name: "Delta", owner: "Sam Rivera", status: "Archived", updated: "28 Oct 2026" },
];

const meta = {
  title: "Components/Table",
  component: Table,
  args: { "aria-label": "Projects", density: "comfortable" },
  argTypes: { density: { control: "inline-radio", options: ["comfortable", "compact"] } },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableColumn isRowHeader>Project</TableColumn>
        <TableColumn>Owner</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Updated</TableColumn>
      </TableHeader>
      <TableBody items={rows}>
        {(row) => (
          <TableRow>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.owner}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.updated}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Comfortable: Story = {
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole("grid", { name: "Projects" });
    await expect(within(grid).getAllByRole("row")).toHaveLength(rows.length + 1);
    // Keyboard users move through the grid with the arrow keys.
    // Tab lands on the first data row; the right arrow moves into its first cell.
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    const focused = document.activeElement;
    if (!focused) throw new Error("Nothing focused");
    await expect(focused).toHaveTextContent("Atlas");
    await expectFocusRing(focused, { inset: true });
  },
};

export const Compact: Story = { args: { density: "compact" } };
