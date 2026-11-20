import { Button, Empty } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderOpenIcon, PlusIcon } from "lucide-react";

const meta = {
  title: "Components/Empty",
  component: Empty,
  args: {
    icon: <FolderOpenIcon />,
    title: "No projects yet",
    description: "Projects hold your reports and the people who can see them.",
    action: (
      <Button>
        <PlusIcon aria-hidden />
        New project
      </Button>
    ),
    className: "max-w-xl",
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoAction: Story = { args: { action: undefined, title: "No results", description: "Try a different search." } };
