import { Attachment } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Attachment",
  component: Attachment,
  parameters: { controls: { disable: true } },
} as Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Attachment")?.render()}</>,
};
