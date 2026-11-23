import { DataTable } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { clearField, typeInto } from "./test-helpers.js";

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
    await typeInto(canvas.getByRole("textbox", { name: "Filter clients" }), "orch");
    await waitFor(() => expect(canvas.getByRole("rowheader", { name: "Orchard" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("rowheader", { name: "Northwind" })).toBeNull());
    await clearField(canvas.getByRole("textbox", { name: "Filter clients" }));
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Filter clients" })).toHaveValue(""));
    await userEvent.click(canvas.getByRole("columnheader", { name: "Client" }));
    await waitFor(() => expect(canvas.getByRole("columnheader", { name: "Client" })).toHaveAttribute("aria-sort", "ascending"));
    await expect(canvas.getAllByRole("rowheader")[0]).toHaveTextContent("Beacon");
  },
};
