import { Button, InputGroup } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon, XIcon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const meta = {
  title: "Components/InputGroup",
  component: InputGroup,
  args: { label: "Website", startAddon: "https://", placeholder: "example.com", className: "max-w-sm" },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", { name: "Website" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    // The ring goes round the whole group, addons included.
    const group = canvasElement.querySelector('[data-slot="input-group"]') as Element;
    await expectFocusRing(group);
    await userEvent.type(input, "graftwork.dev");
    await expect(input).toHaveValue("graftwork.dev");
  },
};

export const WithIcon: Story = {
  args: { label: "Search projects", startAddon: <SearchIcon aria-hidden />, placeholder: undefined },
};

export const WithUnit: Story = { args: { label: "Weight", startAddon: undefined, endAddon: "kg", inputMode: "decimal" } };

export const WithButton: Story = {
  args: {
    label: "Search projects",
    startAddon: <SearchIcon aria-hidden />,
    endAddon: (
      <Button variant="ghost" size="sm" aria-label="Clear search">
        <XIcon aria-hidden />
      </Button>
    ),
    defaultValue: "Atlas",
  },
};

export const Invalid: Story = {
  args: { isInvalid: true, errorMessage: "Enter a domain, like example.com." },
};

export const Disabled: Story = { args: { isDisabled: true } };
