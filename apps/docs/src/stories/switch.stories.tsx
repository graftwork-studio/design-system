import { Switch } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { children: "Dark mode for charts" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("switch", { name: "Dark mode for charts" });
    await userEvent.tab();
    await expect(control).toHaveFocus();
    await expectFocusRing(canvasElement.querySelector('[data-slot="switch-track"]') as Element);
    await expectHitArea(canvasElement.querySelector('[data-slot="switch"]') as Element);
    await userEvent.keyboard(" ");
    await expect(control).toBeChecked();
  },
};

export const Selected: Story = { args: { defaultSelected: true } };
export const Disabled: Story = { args: { isDisabled: true } };
