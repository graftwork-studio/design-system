import { Input } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { label: "Project name", placeholder: "For example, Atlas", className: "max-w-sm" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", { name: "Project name" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expectFocusRing(input);
    await expectHitArea(input);
    await userEvent.type(input, "Atlas");
    await expect(input).toHaveValue("Atlas");
  },
};

export const WithDescription: Story = {
  args: { description: "Shown to everyone in your team." },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox");
    await expect(input).toHaveAccessibleDescription("Shown to everyone in your team.");
  },
};

export const Required: Story = { args: { isRequired: true } };

export const Invalid: Story = {
  args: { isInvalid: true, errorMessage: "Enter a project name.", defaultValue: "" },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    // The error is text, linked to its field.
    await expect(input).toHaveAccessibleDescription(expect.stringContaining("Enter a project name."));
  },
};

export const Disabled: Story = { args: { isDisabled: true, defaultValue: "Atlas" } };
