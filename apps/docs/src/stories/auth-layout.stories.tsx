import { AuthLayout, Button, Card, CardContent, CardDescription, CardHeader, Input } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryVerticalEndIcon, ImageIcon } from "lucide-react";
import { expect, within } from "storybook/test";

const meta = {
  title: "Components/AuthLayout",
  component: AuthLayout,
  parameters: { controls: { disable: true } },
} as Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const brand = (
  <a href="#home" className="flex items-center gap-2 font-medium text-text-default no-underline">
    <span className="flex size-6 items-center justify-center rounded-md bg-action-primary-bg text-text-on-primary">
      <GalleryVerticalEndIcon aria-hidden className="size-4" />
    </span>
    Your app
  </a>
);

const form = (
  <form className="flex flex-col gap-5" aria-label="Log in" onSubmit={(event) => event.preventDefault()}>
    <Input label="Email" type="email" placeholder="name@example.com" isRequired />
    <Input label="Password" type="password" isRequired />
    <Button type="submit">Log in</Button>
  </form>
);

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "AuthLayout")?.render()}</>,
};

/** A log-in card on a muted page, with the brand above and the terms below. */
export const Centered: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <AuthLayout
      background="muted"
      brand={brand}
      footer={
        <p>
          By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
        </p>
      }
    >
      <Card>
        <CardHeader>
          <h1 className="text-xl leading-heading font-medium">Welcome back</h1>
          <CardDescription>Log in to your account.</CardDescription>
        </CardHeader>
        <CardContent>{form}</CardContent>
      </Card>
    </AuthLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("main")).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 1 })).toBeVisible();
  },
};

/** The form beside an image, which shows from the lg breakpoint. */
export const Split: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <AuthLayout
      layout="split"
      brand={brand}
      aside={
        <div className="flex flex-1 items-center justify-center text-text-secondary">
          <ImageIcon aria-hidden className="size-12" />
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-center text-2xl leading-heading font-semibold">Log in to your account</h1>
        {form}
      </div>
    </AuthLayout>
  ),
  play: async ({ canvasElement }) => {
    const aside = canvasElement.querySelector('[data-slot="auth-layout-aside"]') as HTMLElement;
    await expect(getComputedStyle(aside).display).toBe(window.innerWidth >= 1024 ? "flex" : "none");
  },
};
