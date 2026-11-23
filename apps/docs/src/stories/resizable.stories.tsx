import { ResizablePanelGroup } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  parameters: { controls: { disable: true } },
} as Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Resizable")?.render()}</>,
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole("separator", { name: "Resize panels" });
    await waitFor(() => expect(handle).toHaveAttribute("aria-valuenow"));
    const before = Number(handle.getAttribute("aria-valuenow"));
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(before));
  },
};
