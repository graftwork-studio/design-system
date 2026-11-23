import { InputOTP } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/InputOTP",
  component: InputOTP,
  parameters: { controls: { disable: true } },
} as Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "InputOTP")?.render()}</>,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Verification code");
    await userEvent.type(input, "12a34");
    await waitFor(() => expect(input).toHaveValue("1234"));
    await userEvent.clear(input);
    await waitFor(() => expect(input).toHaveValue(""));
  },
};
