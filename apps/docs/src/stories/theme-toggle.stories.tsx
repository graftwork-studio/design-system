import { ThemeToggle } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  args: { onChange: fn(), defaultValue: "system" },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", { name: "Theme" });
    const radios = within(group).getAllByRole("radio");
    for (const radio of radios) await expectHitArea(radio.closest("label") ?? radio);

    // Arrow keys move between options and apply them.
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "System" })).toHaveFocus();
    await expectFocusRing(canvas.getByRole("radio", { name: "System" }).closest("label") ?? group);
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "Dark" })).toBeChecked();
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    await expect(args.onChange).toHaveBeenLastCalledWith("dark");

    // Back to system: the attribute is removed and the OS preference applies.
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await expect(document.documentElement).not.toHaveAttribute("data-theme");
  },
};
