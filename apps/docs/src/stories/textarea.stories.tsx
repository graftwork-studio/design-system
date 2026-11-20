import { Textarea } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: { label: "Summary", placeholder: "What changed, and why?", className: "max-w-md" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole("textbox", { name: "Summary" });
    await userEvent.tab();
    await expect(textarea).toHaveFocus();
    await expectFocusRing(textarea);
    await userEvent.type(textarea, "Moved the release to Friday.");
    await expect(textarea).toHaveValue("Moved the release to Friday.");
  },
};

export const WithDescription: Story = { args: { description: "Shown in the changelog." } };
export const Invalid: Story = {
  args: { isRequired: true, isInvalid: true, errorMessage: "Add a summary." },
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole("textbox");
    await expect(textarea).toHaveAccessibleDescription(expect.stringContaining("Add a summary."));
  },
};
export const Disabled: Story = { args: { isDisabled: true, defaultValue: "Locked while the release runs." } };
