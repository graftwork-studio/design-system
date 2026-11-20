import { Avatar, AvatarGroup } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

// A tiny inline photo, so the story never depends on the network.
const PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#8fb8e8"/><circle cx="20" cy="16" r="7" fill="#f2d3b5"/><rect x="8" y="26" width="24" height="14" rx="7" fill="#185a9c"/></svg>',
  );

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { name: "Priya Shah" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {
  play: async ({ canvasElement }) => {
    const avatar = within(canvasElement).getByRole("img", { name: "Priya Shah" });
    await expect(avatar).toHaveTextContent("PS");
  },
};

export const Photo: Story = { args: { src: PHOTO } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Priya Shah" size="sm" />
      <Avatar name="Priya Shah" size="md" />
      <Avatar name="Priya Shah" size="lg" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Priya Shah" src={PHOTO} />
      <Avatar name="Tom Okafor" />
      <Avatar name="Lena Fischer" />
      <Avatar name="Sam Rivera" />
      <Avatar name="Jo Kim" />
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("img", { name: "2 more" })).toBeInTheDocument();
  },
};
