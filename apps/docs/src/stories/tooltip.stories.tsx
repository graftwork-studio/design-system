import { Button, Tooltip, TooltipContent } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArchiveIcon } from "lucide-react";
import { expect, screen, userEvent, waitFor } from "storybook/test";

const meta = {
  title: "Components/Tooltip",
  component: TooltipContent,
  args: { children: "Archive", placement: "top" },
  argTypes: { placement: { control: "inline-radio", options: ["top", "bottom", "start", "end"] } },
  render: (args) => (
    <Tooltip>
      <Button variant="ghost" aria-label="Archive">
        <ArchiveIcon aria-hidden />
      </Button>
      <TooltipContent {...args} />
    </Tooltip>
  ),
  parameters: { layout: "centered" },
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    // Keyboard focus shows it straight away; Escape hides it.
    await userEvent.tab();
    const tooltip = await screen.findByRole("tooltip");
    await waitFor(() => expect(tooltip).toHaveTextContent("Archive"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  },
};

export const Open: Story = {
  render: (args) => (
    <div className="flex min-h-24 w-48 items-end justify-center">
      <Tooltip defaultOpen>
        <Button variant="ghost" aria-label="Archive">
          <ArchiveIcon aria-hidden />
        </Button>
        <TooltipContent {...args} />
      </Tooltip>
    </div>
  ),
};
