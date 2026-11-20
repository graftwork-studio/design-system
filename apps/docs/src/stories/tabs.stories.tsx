import { Tab, TabList, TabPanel, Tabs } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] } },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Project">
        <Tab id="overview">Overview</Tab>
        <Tab id="reports">Reports</Tab>
        <Tab id="people">People</Tab>
        <Tab id="billing" isDisabled>
          Billing
        </Tab>
      </TabList>
      <TabPanel id="overview">Atlas tracks sign-ups across every region.</TabPanel>
      <TabPanel id="reports">12 reports, 3 published this week.</TabPanel>
      <TabPanel id="people">4 people can edit this project.</TabPanel>
      <TabPanel id="billing">Billing settings.</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole("tab", { name: "Overview" });
    await userEvent.tab();
    await expect(overview).toHaveFocus();
    await expectFocusRing(overview, { inset: true });
    await expectHitArea(overview);
    await userEvent.keyboard("{ArrowRight}");
    const reports = canvas.getByRole("tab", { name: "Reports" });
    await expect(reports).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("12 reports");
  },
};

export const Vertical: Story = { args: { orientation: "vertical" } };
