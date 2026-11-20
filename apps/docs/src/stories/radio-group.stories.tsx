import { Radio, RadioGroup } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: { label: "Plan", children: null },
  argTypes: { orientation: { control: "inline-radio", options: ["vertical", "horizontal"] } },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free">Free</Radio>
      <Radio value="team">Team</Radio>
      <Radio value="enterprise">Enterprise</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radiogroup", { name: "Plan" })).toBeVisible();
    const free = canvas.getByRole("radio", { name: "Free" });
    await userEvent.tab();
    await expect(free).toHaveFocus();
    await expectFocusRing(canvasElement.querySelector('[data-slot="radio-indicator"]') as Element);
    await expectHitArea(canvasElement.querySelector('[data-slot="radio"]') as Element);
    // Arrow keys move and select within the group.
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Team" })).toBeChecked();
  },
};

export const Horizontal: Story = { args: { orientation: "horizontal", defaultValue: "team" } };
export const WithDescription: Story = { args: { description: "You can change this at any time." } };
export const Invalid: Story = {
  args: { isRequired: true, isInvalid: true, errorMessage: "Choose a plan." },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Choose a plan.")).toBeVisible();
  },
};
export const Disabled: Story = { args: { isDisabled: true, defaultValue: "free" } };
