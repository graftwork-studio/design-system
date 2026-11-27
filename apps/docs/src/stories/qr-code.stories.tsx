import { QrCode } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  title: "Components/QrCode",
  component: QrCode,
  args: { value: "https://example.com/pair/4829", label: "QR code to connect your phone" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const code = within(canvasElement).getByRole("img", { name: "QR code to connect your phone" });
    await expect(code).toHaveAttribute("width", "160");
    // Always light, so it scans in every theme.
    await expect(code.parentElement).toHaveAttribute("data-theme", "light");
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      <QrCode {...args} size="sm" />
      <QrCode {...args} size="md" />
      <QrCode {...args} size="lg" />
    </div>
  ),
};

/** Non-ASCII text is encoded as UTF-8, which scanners expect. */
export const Unicode: Story = { args: { value: "Café Zürich — Gruß 👋", label: "QR code with a greeting" } };
