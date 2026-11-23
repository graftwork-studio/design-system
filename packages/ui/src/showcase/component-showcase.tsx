"use client";

import {
  ArchiveIcon,
  BoldIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  EllipsisIcon,
  FileTextIcon,
  FolderOpenIcon,
  HouseIcon,
  InfoIcon,
  ItalicIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
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
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Marker,
  MarkerContent,
  MarkerIcon,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  ScrollArea,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  ToggleGroup,
  ToggleGroupItem,
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
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

const exampleInput = "focus-ring h-8 w-full rounded-lg border border-border-input bg-surface-default px-2.5 text-md text-text-default md:text-body";

function FieldExample() {
  const id = React.useId();
  return (
    <FieldSet>
      <FieldLegend>Contact details</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>Full name</FieldLabel>
          <input id={`${id}-name`} aria-describedby={`${id}-hint`} defaultValue="Ana Silva" className={exampleInput} />
          <FieldDescription id={`${id}-hint`}>As it appears on invoices.</FieldDescription>
        </Field>
        <FieldSeparator>And</FieldSeparator>
        <Field>
          <FieldLabel htmlFor={`${id}-email`}>Work email</FieldLabel>
          <input id={`${id}-email`} aria-invalid aria-describedby={`${id}-error`} defaultValue="ana@" className={exampleInput} />
          <FieldError id={`${id}-error`} errors={[{ message: "Enter a full email address." }]} />
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Weekly summary</FieldTitle>
            <FieldDescription>Sent every Monday.</FieldDescription>
          </FieldContent>
          <Switch defaultSelected>On</Switch>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

const commandContents = (
  <>
    <CommandInput placeholder="Search commands" />
    <CommandList aria-label="Commands" renderEmptyState={() => <CommandEmpty>No results</CommandEmpty>}>
      <CommandGroup heading="Projects">
        <CommandItem id="new" textValue="New project">
          <PlusIcon aria-hidden />
          <span>New project</span>
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem id="archive" textValue="Archive project">
          <ArchiveIcon aria-hidden />
          <span>Archive project</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem id="preferences">Preferences</CommandItem>
      </CommandGroup>
    </CommandList>
  </>
);

function CommandExample() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="w-full rounded-xl border border-border-default">
        <Command>{commandContents}</Command>
      </div>
      <Dialog>
        <Button variant="secondary">Open command menu</Button>
        <CommandDialog>
          <Command>{commandContents}</Command>
        </CommandDialog>
      </Dialog>
    </div>
  );
}

function MessageScrollerExample() {
  const [count, setCount] = React.useState(6);
  return (
    <div className="flex flex-col gap-3">
      <div className="h-56 rounded-lg border border-border-default">
        <MessageScroller>
          <MessageScrollerViewport aria-label="Example conversation">
            <MessageScrollerContent className="gap-3 p-3">
              {Array.from({ length: count }, (_, index) => (
                <MessageScrollerItem key={index}>
                  <Message align={index % 2 ? "end" : "start"}>
                    <MessageContent>
                      <MessageHeader>{index % 2 ? "You" : "Assistant"}</MessageHeader>
                      <Bubble variant={index % 2 ? "default" : "muted"}>
                        <BubbleContent>Message {index + 1}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </div>
      <Button variant="secondary" size="sm" className="self-start" onPress={() => setCount((current) => current + 1)}>
        Add a message
      </Button>
    </div>
  );
}

function QuestionnaireExample() {
  const [submitted, setSubmitted] = React.useState(false);
  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Alert variant="success" title="Thanks, that's everything" />
        <Button variant="secondary" size="sm" onPress={() => setSubmitted(false)}>
          Start again
        </Button>
      </div>
    );
  }
  return (
    <Questionnaire onSubmit={() => setSubmitted(true)}>
      <QuestionnaireProgress />
      <QuestionnaireItem id="goal" type="single" isRequired>
        <QuestionnaireTitle level={4}>What should the report cover?</QuestionnaireTitle>
        <QuestionnaireDescription>Pick the closest match.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="usage">
            Usage
            <QuestionnaireChoiceDescription>Active people and sessions</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="revenue">Revenue</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem id="formats" type="multiple">
        <QuestionnaireTitle level={4}>Which formats do you need?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="pdf">PDF</QuestionnaireChoice>
          <QuestionnaireChoice value="csv">CSV</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem id="notes" type="text">
        <QuestionnaireTitle level={4}>Anything else?</QuestionnaireTitle>
        <QuestionnaireInput placeholder="Optional notes" />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
}

function SidebarExample() {
  return (
    <SidebarProvider keyboardShortcut={false} className="h-96 min-h-0 overflow-hidden rounded-lg border border-border-default">
      <Sidebar contained collapsible="icon" aria-label="Example navigation">
        <SidebarHeader>
          <SidebarInput label="Search" placeholder="Find a page" className="group-data-[collapsible=icon]/sidebar:hidden" />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction aria-label="Add a page">
              <PlusIcon aria-hidden />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton href="#overview" isActive tooltip="Overview">
                    <HouseIcon aria-hidden />
                    <span>Overview</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton href="#projects" tooltip="Projects">
                    <FolderOpenIcon aria-hidden />
                    <span>Projects</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction aria-label="Project options">
                    <EllipsisIcon aria-hidden />
                  </SidebarMenuAction>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#northwind">
                        <span>Northwind</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem aria-busy="true">
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <SettingsIcon aria-hidden />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset elementType="div" className="gap-2 p-3">
        <SidebarTrigger />
        <p>Page content goes here.</p>
      </SidebarInset>
    </SidebarProvider>
  );
}

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
    name: "Attachment",
    render: () => (
      <AttachmentGroup aria-label="Attached files">
        <Attachment>
          <AttachmentTrigger aria-label="Open report.pdf" />
          <AttachmentMedia>
            <FileTextIcon aria-hidden />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>report.pdf</AttachmentTitle>
            <AttachmentDescription>2.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove report.pdf">
              <XIcon aria-hidden />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="error">
          <AttachmentMedia>
            <FileTextIcon aria-hidden />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>notes.txt</AttachmentTitle>
            <AttachmentDescription>Upload failed</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </AttachmentGroup>
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
    name: "Bubble",
    render: () => (
      <BubbleGroup className="pb-3">
        <Bubble variant="muted">
          <BubbleContent>Can you summarise this report?</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Sign-ups rose by 12%.</BubbleContent>
          <BubbleReactions aria-label="1 thumbs up reaction">👍</BubbleReactions>
        </Bubble>
      </BubbleGroup>
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
    name: "ButtonGroup",
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        <ButtonGroup aria-label="Page actions">
          <Button variant="secondary">Copy</Button>
          <Button variant="secondary">Share</Button>
          <Button variant="secondary" aria-label="More actions">
            <ChevronDownIcon aria-hidden />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Publish">
          <ButtonGroupText>Draft</ButtonGroupText>
          <Button>Publish</Button>
          <ButtonGroupSeparator />
          <Button aria-label="Publish options">
            <ChevronDownIcon aria-hidden />
          </Button>
        </ButtonGroup>
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
  { name: "Command", render: () => <CommandExample /> },
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
  { name: "Field", render: () => <FieldExample /> },
  { name: "Input", render: () => <Input label="Display name" description="Shown on your profile." placeholder="For example, Ana" /> },
  {
    name: "InputGroup",
    render: () => <InputGroup label="Find items" startAddon={<SearchIcon aria-hidden />} endAddon="⌘K" placeholder="Search" />,
  },
  {
    name: "Item",
    render: () => (
      <ItemGroup>
        <Item variant="outline">
          <ItemHeader>
            <Badge variant="success">Live</Badge>
          </ItemHeader>
          <ItemMedia variant="icon">
            <FileTextIcon aria-hidden />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Monthly report</ItemTitle>
            <ItemDescription>Updated 2 hours ago</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="secondary">
              Open
            </Button>
          </ItemActions>
          <ItemFooter>
            <span className="text-xs text-text-secondary">Owned by Ana Silva</span>
          </ItemFooter>
        </Item>
        <ItemSeparator />
        <Item href="#northwind" variant="muted" size="sm">
          <ItemContent>
            <ItemTitle>Northwind</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
    ),
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
  {
    name: "Marker",
    render: () => (
      <div className="flex flex-col gap-3">
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
        <Marker>
          <MarkerIcon>
            <InfoIcon />
          </MarkerIcon>
          <MarkerContent>Ana joined the conversation</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Earlier messages</MarkerContent>
        </Marker>
      </div>
    ),
  },
  {
    name: "Message",
    render: () => (
      <MessageGroup>
        <Message>
          <MessageAvatar>
            <Avatar name="Assistant" size="sm" />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Assistant</MessageHeader>
            <Bubble variant="muted">
              <BubbleContent>How can I help?</BubbleContent>
            </Bubble>
            <MessageFooter>09:41</MessageFooter>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageContent>
            <MessageHeader>You</MessageHeader>
            <Bubble>
              <BubbleContent>Find last month's report.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>
    ),
  },
  { name: "MessageScroller", render: () => <MessageScrollerExample /> },
  {
    name: "NativeSelect",
    render: () => (
      <NativeSelect label="Time zone" description="Used for scheduled reports." defaultValue="london">
        <NativeSelectOptGroup label="Europe">
          <NativeSelectOption value="london">London</NativeSelectOption>
          <NativeSelectOption value="paris">Paris</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Asia">
          <NativeSelectOption value="tokyo">Tokyo</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    ),
  },
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
  { name: "Questionnaire", render: () => <QuestionnaireExample /> },
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
    name: "ScrollArea",
    render: () => (
      <ScrollArea aria-label="Release notes" className="h-32 rounded-lg border border-border-default p-3">
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 12 }, (_, index) => (
            <li key={index}>Release note {index + 1}</li>
          ))}
        </ul>
      </ScrollArea>
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
  { name: "Sidebar", wide: true, render: () => <SidebarExample /> },
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
    name: "ToggleGroup",
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup aria-label="Text style" selectionMode="multiple" variant="secondary" spacing={0} defaultSelectedKeys={["bold"]}>
          <ToggleGroupItem id="bold" aria-label="Bold">
            <BoldIcon aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem id="italic" aria-label="Italic">
            <ItalicIcon aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup aria-label="View" defaultSelectedKeys={["list"]}>
          <ToggleGroupItem id="list">List</ToggleGroupItem>
          <ToggleGroupItem id="board">Board</ToggleGroupItem>
        </ToggleGroup>
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
  {
    name: "Trace",
    render: () => (
      <Trace>
        <TraceLine>
          <TraceIcon>
            <SearchIcon />
          </TraceIcon>
          <TraceTitle>Searched the docs</TraceTitle>
          <TraceDescription>1.2s</TraceDescription>
        </TraceLine>
        <TraceLine status="running">
          <TraceIcon>
            <Spinner size="sm" label="Running" />
          </TraceIcon>
          <TraceTitle>Reading 3 files</TraceTitle>
        </TraceLine>
        <TraceLine status="error">
          <TraceIcon>
            <InfoIcon />
          </TraceIcon>
          <TraceTitle>Export failed</TraceTitle>
        </TraceLine>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceTitle>Reasoning</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>The report covers the last full month.</TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
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
