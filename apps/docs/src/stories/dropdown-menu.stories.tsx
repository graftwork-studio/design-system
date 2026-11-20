import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuSub,
} from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDownIcon, CopyIcon, PencilIcon, TrashIcon } from "lucide-react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

const onAction = fn();

function Actions({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <Button variant="secondary">
        Actions
        <ChevronDownIcon aria-hidden />
      </Button>
      <DropdownMenuContent aria-label="Actions" onAction={onAction}>
        <DropdownMenuItem id="rename" shortcut="⌘R">
          <PencilIcon aria-hidden />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem id="duplicate" shortcut="⌘D">
          <CopyIcon aria-hidden />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuItem id="move">Move to</DropdownMenuItem>
          <DropdownMenuContent aria-label="Move to" onAction={onAction}>
            <DropdownMenuItem id="team-a">Design team</DropdownMenuItem>
            <DropdownMenuItem id="team-b">Research team</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem id="delete" variant="destructive">
          <TrashIcon aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenuContent,
  args: { children: null },
  render: () => <Actions />,
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    onAction.mockClear();
    const trigger = within(canvasElement).getByRole("button", { name: /Actions/ });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const menu = await screen.findByRole("menu", { name: "Actions" });
    await waitFor(() => expect(menu).toBeVisible());
    await expect(within(menu).getByRole("menuitem", { name: /Rename/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(onAction.mock.calls[0]?.[0]).toBe("duplicate");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Open: Story = {
  render: () => (
    <div className="min-h-96">
      <Actions defaultOpen />
    </div>
  ),
};

export const WithSelection: Story = {
  render: () => (
    <div className="min-h-72">
      <DropdownMenu defaultOpen>
        <Button variant="secondary">Sort</Button>
        <DropdownMenuContent aria-label="Sort" selectionMode="single" defaultSelectedKeys={["updated"]}>
          <DropdownMenuSection title="Sort by">
            <DropdownMenuItem id="name">Name</DropdownMenuItem>
            <DropdownMenuItem id="updated">Last updated</DropdownMenuItem>
            <DropdownMenuItem id="owner">Owner</DropdownMenuItem>
          </DropdownMenuSection>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async () => {
    const menu = await screen.findByRole("menu", { name: "Sort" });
    await expect(within(menu).getByRole("menuitemradio", { name: "Last updated" })).toBeChecked();
  },
};
