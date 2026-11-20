import {
  Button,
  Checkbox,
  CheckboxGroup,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

function Filters({ side, defaultOpen = false }: { side?: "right" | "left" | "top" | "bottom"; defaultOpen?: boolean }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <Button variant="secondary">Filters</Button>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list of projects.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <CheckboxGroup label="Status" defaultValue={["live"]}>
            <Checkbox value="live">Live</Checkbox>
            <Checkbox value="draft">Draft</Checkbox>
            <Checkbox value="archived">Archived</Checkbox>
          </CheckboxGroup>
        </SheetBody>
        <SheetFooter>
          <Button slot="close" variant="secondary">
            Cancel
          </Button>
          <Button slot="close">Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "Components/Sheet",
  component: SheetContent,
  args: { side: "right", children: null },
  argTypes: { side: { control: "inline-radio", options: ["right", "left", "top", "bottom"] } },
  render: (args) => <Filters side={args.side} />,
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Filters" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).toHaveAccessibleDescription("Narrow the list of projects.");
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const OpenRight: Story = { render: () => <Filters defaultOpen />, // Overlays render outside #storybook-root, so fill the viewport for the visual tests to capture them.
  decorators: [(Story) => <div className="min-h-dvh"><Story /></div>], parameters: { layout: "fullscreen" } };
export const OpenBottom: Story = { render: () => <Filters side="bottom" defaultOpen />, // Overlays render outside #storybook-root, so fill the viewport for the visual tests to capture them.
  decorators: [(Story) => <div className="min-h-dvh"><Story /></div>], parameters: { layout: "fullscreen" } };
