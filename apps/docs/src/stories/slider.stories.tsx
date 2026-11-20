import { Slider } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: { label: "Volume", defaultValue: 40, className: "max-w-sm" },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("slider", { name: "Volume" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    const thumb = canvasElement.querySelector('[data-slot="slider-thumb"]') as Element;
    await expectFocusRing(thumb);
    await expectHitArea(thumb);
    await userEvent.keyboard("{ArrowRight}");
    await expect(input).toHaveValue("41");
    await expect(within(canvasElement).getByText("41")).toBeVisible();
  },
};

export const WithDescription: Story = { args: { description: "Applies to every chart sound." } };

export const Range: StoryObj<typeof Slider<number[]>> = {
  args: {
    label: "Price",
    defaultValue: [20, 80],
    thumbLabels: ["Minimum", "Maximum"],
    formatOptions: { style: "currency", currency: "GBP", maximumFractionDigits: 0 },
    className: "max-w-sm",
  },
  render: (args) => <Slider<number[]> {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("slider", { name: /Minimum/ })).toBeInTheDocument();
    await expect(canvas.getByRole("slider", { name: /Maximum/ })).toBeInTheDocument();
  },
};

export const Disabled: Story = { args: { isDisabled: true } };
