import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  args: { allowsMultipleExpanded: false, className: "max-w-xl" },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem id="billing">
        <AccordionTrigger>How does billing work?</AccordionTrigger>
        <AccordionContent>You're billed monthly for each active seat. Remove a seat and the next bill is lower.</AccordionContent>
      </AccordionItem>
      <AccordionItem id="export">
        <AccordionTrigger>Can I export my data?</AccordionTrigger>
        <AccordionContent>Yes. Every report can be exported as CSV from its menu.</AccordionContent>
      </AccordionItem>
      <AccordionItem id="sso" isDisabled>
        <AccordionTrigger>Single sign-on (Enterprise only)</AccordionTrigger>
        <AccordionContent>Available on the Enterprise plan.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "How does billing work?" });
    await expect(canvas.getByRole("heading", { level: 3, name: "How does billing work?" })).toBeInTheDocument();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expectFocusRing(trigger);
    await expectHitArea(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/billed monthly/)).toBeVisible();
  },
};

export const Expanded: Story = { args: { defaultExpandedKeys: ["billing"] } };
export const Multiple: Story = { args: { allowsMultipleExpanded: true, defaultExpandedKeys: ["billing", "export"] } };
