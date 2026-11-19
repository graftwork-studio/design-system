import { Select, SelectItem } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Select",
  component: Select,
  args: { label: "Region", className: "max-w-sm", children: null },
  render: (args) => (
    <Select {...args}>
      <SelectItem id="eu">Europe</SelectItem>
      <SelectItem id="us">United States</SelectItem>
      <SelectItem id="apac">Asia Pacific</SelectItem>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: /Region/ });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expectFocusRing(trigger);
    await expectHitArea(trigger);

    // Open with the keyboard, move down, choose.
    await userEvent.keyboard("{ArrowDown}");
    const listbox = await screen.findByRole("listbox");
    // The popover fades in, so wait for it to finish.
    await waitFor(() => expect(listbox).toBeVisible());
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await expect(trigger).toHaveTextContent("United States");
    // Focus returns to the trigger.
    await expect(trigger).toHaveFocus();
  },
};

export const WithDescription: Story = { args: { description: "Where your data is stored." } };

export const Invalid: Story = {
  args: { isInvalid: true, errorMessage: "Choose a region." },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Choose a region.")).toBeVisible();
  },
};

export const Disabled: Story = { args: { isDisabled: true } };
