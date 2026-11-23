import { NativeSelect } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/NativeSelect",
  component: NativeSelect,
  parameters: { controls: { disable: true } },
} as Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "NativeSelect")?.render()}</>,
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText("Time zone");
    await userEvent.selectOptions(select, "tokyo");
    await expect(select).toHaveValue("tokyo");
  },
};
