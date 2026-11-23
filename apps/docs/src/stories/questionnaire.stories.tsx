import { Questionnaire } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Questionnaire",
  component: Questionnaire,
  parameters: { controls: { disable: true } },
} as Meta<typeof Questionnaire>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Questionnaire")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(canvas.getByRole("alert")).toHaveTextContent("Answer this question");
    await userEvent.click(canvas.getByRole("radio", { name: /Usage/ }));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    const title = canvas.getByRole("heading", { name: "Which formats do you need?" });
    await waitFor(() => expect(title).toHaveFocus());
    await userEvent.click(canvas.getByRole("button", { name: "Previous" }));
  },
};
