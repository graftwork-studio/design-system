import { Button, Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const meta = {
  title: "Components/Dialog",
  component: DialogContent,
  args: { size: "md", showCloseButton: true, children: null },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  render: (args) => (
    <Dialog>
      <Button variant="secondary">Rename project</Button>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>The new name is shown to everyone in your team.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Input label="Project name" defaultValue="Atlas" />
        </DialogBody>
        <DialogFooter>
          <Button slot="close" variant="secondary">
            Cancel
          </Button>
          <Button slot="close">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Rename project" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Rename project" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).toHaveAccessibleDescription("The new name is shown to everyone in your team.");
    // Focus moves into the dialog, and Tab stays inside it.
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(dialog.contains(document.activeElement)).toBe(true);
    await expectFocusRing(document.activeElement as Element);
    // Escape closes it and focus returns to the trigger.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Open, so the visual tests capture the dialog itself. */
export const Open: Story = {
  render: (args) => (
    <Dialog defaultOpen>
      <Button variant="secondary">Rename project</Button>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>The new name is shown to everyone in your team.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button slot="close" variant="secondary">
            Cancel
          </Button>
          <Button slot="close">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  // Overlays render outside #storybook-root, so fill the viewport for the visual tests to capture them.
  decorators: [(Story) => <div className="min-h-dvh"><Story /></div>], parameters: { layout: "fullscreen" },
};
