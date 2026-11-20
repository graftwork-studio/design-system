import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDownIcon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  render: (args) => (
    <Collapsible {...args} className="max-w-sm">
      <CollapsibleTrigger className="font-medium text-text-default">
        3 more people can view this
        <ChevronsUpDownIcon aria-hidden className="size-4 text-icon-default" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="flex flex-col gap-1 text-text-secondary">
          <li>Priya Shah</li>
          <li>Tom Okafor</li>
          <li>Lena Fischer</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: /3 more people/ });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(within(canvasElement).getByText("Priya Shah")).toBeVisible();
  },
};

export const Expanded: Story = { args: { defaultExpanded: true } };
