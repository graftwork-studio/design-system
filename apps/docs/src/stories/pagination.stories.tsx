import { Pagination } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  args: { page: 5, pageCount: 12 },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    await userEvent.tab();
    const previous = canvas.getByRole("link", { name: "Previous page" });
    await expect(previous).toHaveFocus();
    await expectFocusRing(previous);
    const next = canvas.getByRole("link", { name: "Next page" });
    await expectHitArea(next);
    await userEvent.click(next);
    await expect(canvas.getByRole("link", { name: "Page 6" })).toHaveAttribute("aria-current", "page");
  },
};

export const FirstPage: Story = {
  args: { page: 1 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("link", { name: "Previous page" })).toHaveAttribute("aria-disabled", "true");
  },
};

export const FewPages: Story = { args: { page: 2, pageCount: 3 } };
