"use client";

import { ArchiveIcon, BoldIcon, ChevronDownIcon, ChevronsUpDownIcon, FolderOpenIcon, ItalicIcon, PlusIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
  AvatarGroup,
  Badge,
  BarChart,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  ComboboxItem,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuSub,
  Empty,
  Input,
  InputGroup,
  Kbd,
  Label,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTitle,
  Progress,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Separator,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  ThemeToggle,
  Toaster,
  Toggle,
  Tooltip,
  TooltipContent,
  cn,
  toast,
} from "../index.js";

/*
 * One working example of every public component. Example pages render it, so a
 * new component reaches them with the next package update.
 *
 * Adding a component? Add an entry here. showcase.test.tsx fails until every
 * component exported from src/index.ts is used in this file.
 */

export type ShowcaseEntry = {
  /** The component's name, shown as the heading. */
  name: string;
  /** Spans the full width from the md breakpoint. */
  wide?: boolean;
  render: () => React.ReactNode;
};

function LabelExample() {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Accent colour</Label>
      <input id={id} type="color" defaultValue="#737373" className="focus-ring h-8 w-16" />
    </div>
  );
}

function PaginationExample() {
  const [page, setPage] = React.useState(5);
  return <Pagination aria-label="Example pagination" page={page} pageCount={12} onPageChange={setPage} />;
}

const chartData = [
  { quarter: "Q1", visits: 120, trials: 32 },
  { quarter: "Q2", visits: 180, trials: 48 },
  { quarter: "Q3", visits: 160, trials: 55 },
  { quarter: "Q4", visits: 240, trials: 71 },
];

const tableRows = [
  { id: "1", name: "Northwind", lead: "Ana Silva", state: "Live" },
  { id: "2", name: "Orchard", lead: "Ben Carter", state: "Draft" },
  { id: "3", name: "Harbour", lead: "Mei Tan", state: "Archived" },
];

export const showcaseEntries: readonly ShowcaseEntry[] = [
  {
    name: "Accordion",
    render: () => (
      <Accordion defaultExpandedKeys={["billing"]}>
        <AccordionItem id="billing">
          <AccordionTrigger level={4}>How does billing work?</AccordionTrigger>
          <AccordionContent>You're billed monthly for each active seat.</AccordionContent>
        </AccordionItem>
        <AccordionItem id="export">
          <AccordionTrigger level={4}>Can I export my data?</AccordionTrigger>
          <AccordionContent>Yes, as CSV from each report's menu.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: "Alert",
    render: () => (
      <div className="flex flex-col gap-2">
        <Alert variant="info" title="New version available">Update when you're ready.</Alert>
        <Alert variant="success" title="Report published" />
        <Alert variant="warning" title="Usage at 90%" />
        <Alert variant="error" title="Sync failed" />
      </div>
    ),
  },
  {
    name: "AlertDialog",
    render: () => (
      <AlertDialog>
        <Button variant="destructive">Delete item</Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>This is only an example, so nothing is deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button slot="close" variant="secondary">
              Cancel
            </Button>
            <Button slot="close" variant="destructive">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: "Avatar",
    render: () => (
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name="Ana Silva" size="sm" />
        <Avatar name="Ben Carter" size="md" />
        <Avatar name="Mei Tan" size="lg" />
        <AvatarGroup max={2}>
          <Avatar name="Ana Silva" />
          <Avatar name="Ben Carter" />
          <Avatar name="Mei Tan" />
        </AvatarGroup>
      </div>
    ),
  },
  {
    name: "Badge",
    render: () => (
      <div className="flex flex-wrap gap-2">
        <Badge>Draft</Badge>
        <Badge variant="info">In review</Badge>
        <Badge variant="success">Live</Badge>
        <Badge variant="warning">Expiring</Badge>
        <Badge variant="error">Failed</Badge>
        <Badge variant="outline">Archived</Badge>
      </div>
    ),
  },
  {
    name: "BarChart",
    wide: true,
    render: () => (
      <BarChart
        title="Visits and trials"
        summary="Visits grew from 120 in Q1 to 240 in Q4. Trials rose every quarter, reaching 71."
        data={chartData}
        categoryKey="quarter"
        series={[
          { key: "visits", label: "Visits" },
          { key: "trials", label: "Trials" },
        ]}
        headingLevel={4}
      />
    ),
  },
  {
    name: "Breadcrumb",
    render: () => (
      <Breadcrumb aria-label="Example breadcrumb">
        <BreadcrumbItem href="#home">Home</BreadcrumbItem>
        <BreadcrumbItem href="#library">Library</BreadcrumbItem>
        <BreadcrumbItem>Northwind</BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  {
    name: "Button",
    render: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Small</Button>
        <Button>Primary</Button>
        <Button size="lg">Large</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    ),
  },
  {
    name: "Card",
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle level={4}>Monthly report</CardTitle>
          <CardDescription>Updated 2 hours ago</CardDescription>
        </CardHeader>
        <CardContent>Sign-ups rose by 12% compared with last month.</CardContent>
        <CardFooter>
          <Button size="sm">Open report</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    name: "Checkbox",
    render: () => (
      <div className="flex flex-col gap-4">
        <Checkbox defaultSelected>Email me about new releases</Checkbox>
        <CheckboxGroup label="Notifications" description="Choose how we contact you." defaultValue={["email"]}>
          <Checkbox value="email">Email</Checkbox>
          <Checkbox value="sms">Text message</Checkbox>
        </CheckboxGroup>
      </div>
    ),
  },
  {
    name: "Collapsible",
    render: () => (
      <Collapsible>
        <CollapsibleTrigger className="font-medium text-text-default">
          2 more people can view this
          <ChevronsUpDownIcon aria-hidden className="size-4 text-icon-default" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="flex flex-col gap-1 text-text-secondary">
            <li>Ana Silva</li>
            <li>Ben Carter</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: "Combobox",
    render: () => (
      <Combobox label="Country" placeholder="Type to filter">
        <ComboboxItem id="ca">Canada</ComboboxItem>
        <ComboboxItem id="fr">France</ComboboxItem>
        <ComboboxItem id="jp">Japan</ComboboxItem>
      </Combobox>
    ),
  },
  {
    name: "Dialog",
    render: () => (
      <Dialog>
        <Button variant="secondary">Rename item</Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename item</DialogTitle>
            <DialogDescription>The new name is shown to everyone in your team.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Input label="Item name" defaultValue="Northwind" />
          </DialogBody>
          <DialogFooter>
            <Button slot="close" variant="secondary">
              Cancel
            </Button>
            <Button slot="close">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    name: "DropdownMenu",
    render: () => (
      <DropdownMenu>
        <Button variant="secondary">
          Actions
          <ChevronDownIcon aria-hidden />
        </Button>
        <DropdownMenuContent aria-label="Actions">
          <DropdownMenuSection title="Item">
            <DropdownMenuItem id="rename" shortcut="⌘R">
              Rename
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuItem id="move">Move to</DropdownMenuItem>
              <DropdownMenuContent aria-label="Move to">
                <DropdownMenuItem id="design">Design team</DropdownMenuItem>
                <DropdownMenuItem id="research">Research team</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuSub>
          </DropdownMenuSection>
          <DropdownMenuSeparator />
          <DropdownMenuItem id="delete" variant="destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: "Empty",
    render: () => (
      <Empty
        level={4}
        icon={<FolderOpenIcon />}
        title="Nothing here yet"
        description="Say why it's empty, and what to do next."
        action={
          <Button size="sm">
            <PlusIcon aria-hidden />
            Add item
          </Button>
        }
      />
    ),
  },
  { name: "Input", render: () => <Input label="Display name" description="Shown on your profile." placeholder="For example, Ana" /> },
  {
    name: "InputGroup",
    render: () => <InputGroup label="Find items" startAddon={<SearchIcon aria-hidden />} endAddon="⌘K" placeholder="Search" />,
  },
  {
    name: "Kbd",
    render: () => (
      <p>
        Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search.
      </p>
    ),
  },
  { name: "Label", render: () => <LabelExample /> },
  { name: "Pagination", wide: true, render: () => <PaginationExample /> },
  {
    name: "Popover",
    render: () => (
      <Popover>
        <Button variant="secondary">
          <SlidersHorizontalIcon aria-hidden />
          Display
        </Button>
        <PopoverContent>
          <PopoverTitle>Display</PopoverTitle>
          <Switch defaultSelected>Show archived items</Switch>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: "Progress",
    render: () => (
      <div className="flex flex-col gap-4">
        <Progress label="Uploading file" value={60} />
        <Progress label="Preparing export" isIndeterminate />
      </div>
    ),
  },
  {
    name: "RadioGroup",
    render: () => (
      <RadioGroup label="Plan" defaultValue="team">
        <Radio value="free">Free</Radio>
        <Radio value="team">Team</Radio>
        <Radio value="enterprise">Enterprise</Radio>
      </RadioGroup>
    ),
  },
  {
    name: "Select",
    render: () => (
      <Select label="Language">
        <SelectItem id="en">English</SelectItem>
        <SelectItem id="es">Spanish</SelectItem>
        <SelectItem id="ja">Japanese</SelectItem>
      </Select>
    ),
  },
  {
    name: "Separator",
    render: () => (
      <div className="flex flex-col gap-3">
        <p>Account</p>
        <Separator />
        <div className="flex h-6 items-center gap-3">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Support</span>
        </div>
      </div>
    ),
  },
  {
    name: "Sheet",
    render: () => (
      <Sheet>
        <Button variant="secondary">Open filters</Button>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow the list of items.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <Switch>Only show live items</Switch>
          </SheetBody>
          <SheetFooter>
            <Button slot="close" variant="secondary">
              Cancel
            </Button>
            <Button slot="close">Apply</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
  {
    name: "Skeleton",
    render: () => (
      <div role="group" aria-busy="true" aria-label="Loading example" className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ),
  },
  { name: "Slider", render: () => <Slider label="Volume" defaultValue={40} /> },
  {
    name: "Spinner",
    render: () => (
      <div className="flex items-center gap-4">
        <Spinner size="sm" label="Loading small example" />
        <Spinner label="Loading medium example" />
        <Spinner size="lg" label="Loading large example" />
      </div>
    ),
  },
  { name: "Switch", render: () => <Switch defaultSelected>Weekly summary emails</Switch> },
  {
    name: "Table",
    wide: true,
    render: () => (
      <Table aria-label="Example items" density="compact">
        <TableHeader>
          <TableColumn isRowHeader>Name</TableColumn>
          <TableColumn>Lead</TableColumn>
          <TableColumn>State</TableColumn>
        </TableHeader>
        <TableBody items={tableRows}>
          {(row) => (
            <TableRow>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.lead}</TableCell>
              <TableCell>{row.state}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    ),
  },
  {
    name: "Tabs",
    render: () => (
      <Tabs>
        <TabList aria-label="Example sections">
          <Tab id="overview">Overview</Tab>
          <Tab id="activity">Activity</Tab>
        </TabList>
        <TabPanel id="overview">A short overview goes here.</TabPanel>
        <TabPanel id="activity">Recent activity goes here.</TabPanel>
      </Tabs>
    ),
  },
  { name: "Textarea", render: () => <Textarea label="Summary" placeholder="What changed, and why?" /> },
  { name: "ThemeToggle", wide: true, render: () => <ThemeToggle /> },
  {
    name: "Toast",
    render: () => (
      <>
        <Button
          variant="secondary"
          onPress={() => toast({ title: "Report saved", description: "This is an example toast.", variant: "success" })}
        >
          Show a toast
        </Button>
        <Toaster />
      </>
    ),
  },
  {
    name: "Toggle",
    render: () => (
      <div className="flex flex-wrap items-center gap-1">
        <Toggle aria-label="Bold" defaultSelected>
          <BoldIcon aria-hidden />
        </Toggle>
        <Toggle aria-label="Italic">
          <ItalicIcon aria-hidden />
        </Toggle>
        <Toggle variant="secondary">Show archived</Toggle>
      </div>
    ),
  },
  {
    name: "Tooltip",
    render: () => (
      <Tooltip>
        <Button variant="ghost" aria-label="Archive">
          <ArchiveIcon aria-hidden />
        </Button>
        <TooltipContent>Archive</TooltipContent>
      </Tooltip>
    ),
  },
];

export type ComponentShowcaseProps = {
  /** Section heading. Defaults to "All components". */
  heading?: string;
  /** Heading level. Each example's name is one level below. Defaults to 2. */
  level?: 2 | 3;
  /** Components the page already shows, such as a ThemeToggle in its header. */
  exclude?: readonly string[];
  className?: string;
};

/** A working example of every component in the design system. */
export function ComponentShowcase({ heading = "All components", level = 2, exclude = [], className }: ComponentShowcaseProps) {
  const headingId = React.useId();
  const Heading = `h${level}` as const;
  const ItemHeading = `h${level + 1}` as "h3" | "h4";
  const entries = showcaseEntries.filter((entry) => !exclude.includes(entry.name));
  return (
    <section data-slot="component-showcase" aria-labelledby={headingId} className={cn("flex flex-col gap-6", className)}>
      <Heading id={headingId} className="text-xl leading-heading font-semibold text-text-default">
        {heading}
      </Heading>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.name} data-component={entry.name} className={cn("flex min-w-0 flex-col gap-2", entry.wide && "md:col-span-2")}>
            <ItemHeading className="text-sm font-medium text-text-secondary">{entry.name}</ItemHeading>
            <div className="min-w-0 flex-1 rounded-xl border border-border-default bg-surface-raised p-4 text-body text-text-default">
              {entry.render()}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
