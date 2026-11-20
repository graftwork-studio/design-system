import { Combobox, ComboboxItem } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { expectFocusRing } from "./test-helpers.js";

const COUNTRIES = ["Australia", "Canada", "France", "Germany", "Ireland", "Japan", "New Zealand", "United Kingdom"];

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  args: { label: "Country", className: "max-w-sm", children: null },
  render: (args) => (
    <Combobox {...args}>
      {COUNTRIES.map((c) => (
        <ComboboxItem key={c} id={c}>
          {c}
        </ComboboxItem>
      ))}
    </Combobox>
  ),
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Country" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expectFocusRing(canvasElement.querySelector('[data-slot="combobox-control"]') as Element);

    // Typing filters the list; Enter chooses the highlighted option.
    await userEvent.type(input, "Ire");
    const listbox = await screen.findByRole("listbox");
    await waitFor(() => expect(listbox).toBeVisible());
    await expect(within(listbox).getAllByRole("option")).toHaveLength(1);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await expect(input).toHaveValue("Ireland");
  },
};

export const WithDescription: Story = { args: { description: "Where you pay tax." } };
export const Invalid: Story = { args: { isInvalid: true, errorMessage: "Choose a country." } };
export const Disabled: Story = { args: { isDisabled: true } };
