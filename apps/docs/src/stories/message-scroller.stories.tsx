import { MessageScroller } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/MessageScroller",
  component: MessageScroller,
  parameters: { controls: { disable: true } },
} as Meta<typeof MessageScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "MessageScroller")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole("log");
    await waitFor(() => expect(log.scrollTop).toBeGreaterThan(0));
    log.scrollTop = 0;
    const button = await canvas.findByRole("button", { name: "Scroll to latest message" });
    await userEvent.click(button);
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Scroll to latest message" })).toBeNull());
    await expect(log).toHaveFocus();
  },
};
