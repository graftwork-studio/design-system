import { Label } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  title: "Components/Label",
  component: Label,
  args: { children: "Colour" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fields render their own label. Label is for labelling something custom. */
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      <Label {...args} htmlFor="colour" />
      <input id="colour" type="color" defaultValue="#2883de" className="focus-ring h-11 w-16" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText("Colour")).toBeInTheDocument();
  },
};
