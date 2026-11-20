import { Button, Toaster, toast, toastQueue } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Toast",
  component: Toaster,
  decorators: [
    (Story) => {
      // Each story starts with an empty queue.
      useEffect(() => () => toastQueue.clear(), []);
      return <Story />;
    },
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Button onPress={() => toast({ title: "Report saved", description: "Everyone in your team can see it.", variant: "success" })}>
        Save report
      </Button>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Save report" }));
    const region = await screen.findByRole("region", { name: /Notifications/ });
    const alert = await within(region).findByRole("alertdialog");
    await expect(alert).toHaveTextContent("Report saved");
    await userEvent.click(within(alert).getByRole("button", { name: "Dismiss" }));
    // The region is removed with its last toast, so look in the whole document.
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  },
};

/** Every variant, shown at once so the visual tests capture them. */
export const Variants: Story = {
  decorators: [(Story) => <div className="min-h-dvh"><Story /></div>],
  parameters: { layout: "fullscreen" },
  render: function Render() {
    useEffect(() => {
      toast({ title: "New version available", variant: "info" }, { timeout: 0 });
      toast({ title: "Report saved", description: "Everyone in your team can see it.", variant: "success" }, { timeout: 0 });
      toast({ title: "Sync failed", description: "We couldn't reach the server.", variant: "error" });
    }, []);
    return <Toaster />;
  },
};
