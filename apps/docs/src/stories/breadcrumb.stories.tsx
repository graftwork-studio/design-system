import { Breadcrumb, BreadcrumbItem } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbItem href="#projects">Projects</BreadcrumbItem>
      <BreadcrumbItem>Atlas</BreadcrumbItem>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    await expect(canvas.getByText("Atlas")).toHaveAttribute("aria-current", "page");
    await userEvent.tab();
    const home = canvas.getByRole("link", { name: "Home" });
    await expect(home).toHaveFocus();
    await expectFocusRing(home);
  },
};
