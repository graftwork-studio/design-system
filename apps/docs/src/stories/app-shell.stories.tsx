import {
  AppShell,
  AppShellContent,
  AppShellHeader,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderOpenIcon, HouseIcon, SettingsIcon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/AppShell",
  component: AppShell,
  parameters: { controls: { disable: true } },
} as Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "AppShell")?.render()}</>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Share" })).toBeVisible();
    if (window.innerWidth < 768) return;
    const trigger = canvas.getByRole("button", { name: "Toggle sidebar" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};

/** A whole page: the sidebar fills the viewport height and the header stays at the top. */
export const FullPage: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <AppShell
      keyboardShortcut={false}
      sidebar={
        <Sidebar aria-label="Example app navigation">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="#overview" isActive>
                      <HouseIcon aria-hidden />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="#projects">
                      <FolderOpenIcon aria-hidden />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="#settings">
                      <SettingsIcon aria-hidden />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      }
    >
      <AppShellHeader actions={<Button size="sm">New project</Button>}>
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbItem href="#projects">Projects</BreadcrumbItem>
          <BreadcrumbItem>Northwind</BreadcrumbItem>
        </Breadcrumb>
      </AppShellHeader>
      <AppShellContent>
        <h1 className="text-2xl leading-heading font-semibold">Northwind</h1>
        <p className="text-text-secondary">The page content goes here.</p>
      </AppShellContent>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("main")).toBeVisible();
    const header = canvasElement.querySelector('[data-slot="app-shell-header"]');
    await expect(header).not.toBeNull();
    await expect(getComputedStyle(header as Element).position).toBe("sticky");
  },
};

/** The inset sidebar variant: the main area is a rounded panel, and the header follows its corners. */
export const Inset: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <AppShell
      keyboardShortcut={false}
      sidebar={
        <Sidebar variant="inset" aria-label="Example app navigation">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="#overview" isActive>
                      <HouseIcon aria-hidden />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      }
    >
      <AppShellHeader className="border-b-0">
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbItem>Overview</BreadcrumbItem>
        </Breadcrumb>
      </AppShellHeader>
      <AppShellContent>
        <h1 className="text-2xl leading-heading font-semibold">Overview</h1>
      </AppShellContent>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    if (window.innerWidth < 768) return;
    const header = canvasElement.querySelector('[data-slot="app-shell-header"]') as HTMLElement;
    const inset = canvasElement.querySelector('[data-slot="sidebar-inset"]') as HTMLElement;
    // The header's top corners follow the rounded inset panel instead of covering them.
    await expect(getComputedStyle(header).borderTopLeftRadius).toBe(getComputedStyle(inset).borderTopLeftRadius);
    await expect(getComputedStyle(inset).borderTopLeftRadius).not.toBe("0px");
  },
};
