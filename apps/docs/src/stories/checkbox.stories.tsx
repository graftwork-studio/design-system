import { Checkbox, CheckboxGroup } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { children: "Email me about new releases" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    // The ring is drawn on the box, and the whole labelled row is the hit area.
    await expectFocusRing(canvasElement.querySelector('[data-slot="checkbox-indicator"]') as Element);
    await expectHitArea(canvasElement.querySelector('[data-slot="checkbox"]') as Element);
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();
    await userEvent.click(canvas.getByText("Email me about new releases"));
    await expect(checkbox).not.toBeChecked();
  },
};

export const Selected: Story = { args: { defaultSelected: true } };
export const Indeterminate: Story = { args: { isIndeterminate: true, children: "Select all" } };
export const Invalid: Story = { args: { isInvalid: true, children: "I accept the terms" } };
export const Disabled: Story = { args: { isDisabled: true } };

export const Group: StoryObj<typeof CheckboxGroup> = {
  render: () => (
    <CheckboxGroup label="Notifications" description="Choose how we contact you." defaultValue={["email"]}>
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">Text message</Checkbox>
      <Checkbox value="push">Push notification</Checkbox>
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole("group", { name: "Notifications" });
    await expect(group).toHaveAccessibleDescription("Choose how we contact you.");
    await expect(within(group).getByRole("checkbox", { name: "Email" })).toBeChecked();
  },
};

export const GroupInvalid: StoryObj<typeof CheckboxGroup> = {
  render: () => (
    <CheckboxGroup label="Notifications" isRequired isInvalid errorMessage="Choose at least one.">
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">Text message</Checkbox>
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Choose at least one.")).toBeVisible();
  },
};
