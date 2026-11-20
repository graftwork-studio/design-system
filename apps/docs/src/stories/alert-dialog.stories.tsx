import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

const onDelete = fn();

function DeleteProject({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <Button variant="destructive">Delete project</Button>
      <AlertDialogContent>
        {({ close }) => (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Atlas?</AlertDialogTitle>
              <AlertDialogDescription>This deletes the project and its 12 reports. You can't undo this.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button slot="close" variant="secondary">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onPress={() => {
                  onDelete();
                  close();
                }}
              >
                Delete project
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: "Components/AlertDialog",
  component: AlertDialogContent,
  args: { children: null },
  render: () => <DeleteProject />,
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    onDelete.mockClear();
    const trigger = within(canvasElement).getByRole("button", { name: "Delete project" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("alertdialog", { name: "Delete Atlas?" });
    await waitFor(() => expect(dialog).toBeVisible());
    // No close button, and clicking outside doesn't dismiss it.
    await expect(within(dialog).queryByRole("button", { name: "Close" })).toBeNull();
    await userEvent.click(document.body);
    await expect(dialog).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Delete project" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await expect(onDelete).toHaveBeenCalledOnce();
    await expect(trigger).toHaveFocus();
  },
};

export const Open: Story = { render: () => <DeleteProject defaultOpen />, // Overlays render outside #storybook-root, so fill the viewport for the visual tests to capture them.
  decorators: [(Story) => <div className="min-h-dvh"><Story /></div>], parameters: { layout: "fullscreen" } };
