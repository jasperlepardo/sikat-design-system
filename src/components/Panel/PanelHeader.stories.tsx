import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  PanelHeader,
  panelHeaderIcons,
  panelHeaderVariants,
  type PanelHeaderVariant,
} from './PanelHeader';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Tabs } from '../Tabs/Tabs';
import { Icon } from '../Icon/Icon';
import { Badge } from '../Badge/Badge';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import { decorativeIconVariants } from '../DecorativeIcon/DecorativeIcon';

const meta = {
  title: 'Components/Panel/Panel Header',
  component: PanelHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: panelHeaderVariants },
    icon: { control: 'text' },
    iconVariant: { control: 'select', options: decorativeIconVariants },
    iconSize: { control: 'number' },
    title: { control: 'text' },
    subcopy: { control: 'text' },
  },
  args: {
    variant: 'card',
    icon: 'inventory_2',
    iconVariant: 'solid',
    iconSize: 40,
    title: 'Page Title',
    subcopy: 'Subcopy',
  },
} satisfies Meta<typeof PanelHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const CircleIcon = <Icon size={20}>radio_button_unchecked</Icon>;

const panelTabs = [
  { value: 'all', label: 'All', icon: CircleIcon, badge: '+9' },
  { value: 'active', label: 'Active', icon: CircleIcon },
];

const operations = (
  <>
    <IconButton label="Filter" intent="default" variant="solid" size="extra-large">
      {CircleIcon}
    </IconButton>
    <IconButton label="Sort" intent="default" variant="solid" size="extra-large">
      {CircleIcon}
    </IconButton>
  </>
);

const actions = (
  <>
    <Button intent="default" variant="solid" size="extra-large">
      Button
    </Button>
    <Button intent="primary" variant="solid" size="extra-large">
      Button
    </Button>
  </>
);

const prevNext = (
  <>
    <IconButton label="Next" intent="default" variant="solid" size="extra-large">
      {panelHeaderIcons.arrowDownward}
    </IconButton>
    <IconButton label="Previous" intent="default" variant="solid" size="extra-large">
      {panelHeaderIcons.arrowUpward}
    </IconButton>
  </>
);

const statusBadge = (
  <Badge intent="default" variant="outline" size="extra-small" dot>
    Status
  </Badge>
);

/**
 * One layout — every slot renders when passed. `Variant` picks the chrome;
 * `Record Controls` swaps the decorative icon for prev/next, status and refresh.
 */
type PanelHeaderPlaygroundArgs = {
  variant: PanelHeaderVariant;
  panelTitle: string;
  panelSubTitle: string;
  recordControls: boolean;
  showTabs: boolean;
  showSearch: boolean;
};

export const Playground: StoryObj<PanelHeaderPlaygroundArgs> = {
  args: {
    variant: 'card',
    panelTitle: 'Panel Title',
    panelSubTitle: 'Panel Sub Title',
    recordControls: false,
    showTabs: true,
    showSearch: false,
  },
  argTypes: {
    variant: figmaSelect('Variant', panelHeaderVariants, ['Card', 'Plain']),
    panelTitle: { name: 'Panel Title', control: 'text' },
    panelSubTitle: { name: 'Panel Sub Title', control: 'text' },
    recordControls: { name: 'Record Controls', control: 'boolean' },
    showTabs: { name: 'Show Tabs', control: 'boolean' },
    showSearch: { name: 'Show Search', control: 'boolean' },
  },
  parameters: figmaControls([
    'Variant',
    'Panel Title',
    'Panel Sub Title',
    'Record Controls',
    'Show Tabs',
    'Show Search',
  ]),
  render: (a) => (
    <PanelHeader
      variant={a.variant}
      icon={a.recordControls ? undefined : 'radio_button_unchecked'}
      leading={a.recordControls ? prevNext : undefined}
      status={a.recordControls ? statusBadge : undefined}
      titleIcon={a.recordControls ? panelHeaderIcons.rotateRight : undefined}
      title={a.panelTitle}
      subcopy={a.panelSubTitle}
      showSearch={a.showSearch}
      operations={operations}
      actions={actions}
      tabs={a.showTabs ? <Tabs variant="outline" items={panelTabs} /> : undefined}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.panelTitle })).toBeVisible();
  },
};

/**
 * Details page header (Figma Page Type3, 18725:323053) — plain chrome with
 * prev/next, title + status + refresh, subcopy, search and outline tabs.
 */
export const Details: Story = {
  args: {
    variant: 'plain',
    title: 'Panel Title',
    subcopy: 'Panel Sub Title',
    showSearch: true,
    onSearchChange: fn(),
  },
  render: (args) => (
    <PanelHeader
      {...args}
      icon={undefined}
      leading={prevNext}
      status={statusBadge}
      titleIcon={panelHeaderIcons.rotateRight}
      operations={operations}
      actions={actions}
      tabs={<Tabs variant="outline" items={panelTabs} />}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Panel Title' })).toBeVisible();
    await expect(canvas.getByText('Panel Sub Title')).toBeVisible();
    await expect(canvas.getByText('Status')).toBeVisible();
    await expect(canvas.getByRole('tablist')).toBeVisible();
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search' }), 'q');
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('q');
    // Plain chrome: no fill, radius or border.
    const header = getComputedStyle(canvasElement.querySelector('.sikat-panel-header')!);
    await expect(header.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(header.borderTopLeftRadius).toBe('0px');
    await expect(header.boxShadow).toBe('none');
  },
};

/**
 * Table header with search — three equal columns: title block | search | buttons.
 */
export const TableWithSearch: Story = {
  args: {
    title: 'Panel Title',
    subcopy: 'Panel Sub Title',
    showSearch: true,
    searchPlaceholder: 'Search',
    onSearchChange: fn(),
  },
  render: (args) => (
    <PanelHeader
      {...args}
      operations={operations}
      actions={actions}
      tabs={<Tabs variant="outline" items={panelTabs} />}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Search' });
    await userEvent.type(search, 'q');
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('q');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(search).toHaveValue('');
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('');
    // Equal columns: the search fills the middle third of the bar.
    const header = canvasElement.querySelector('.sikat-panel-header__bar')!.getBoundingClientRect();
    const box = canvasElement.querySelector('.sikat-panel-header__center')!.getBoundingClientRect();
    await expect(
      Math.abs(box.left + box.width / 2 - (header.left + header.width / 2)),
    ).toBeLessThan(2);
    const gap = parseFloat(
      getComputedStyle(canvasElement.querySelector('.sikat-panel-header__bar')!).columnGap,
    );
    await expect(Math.abs(box.width - (header.width - 2 * gap) / 3)).toBeLessThan(2);
  },
};

/** Controlled search: the page owns the text (`searchValue` + `onSearchChange`). */
export const ControlledSearch: Story = {
  args: {
    title: 'Purchase orders',
    showSearch: true,
    searchLabel: 'Search purchase orders',
    searchPlaceholder: 'Search by PO no., vendor or item',
  },
  render: function Render(args) {
    const [query, setQuery] = useState('PO-1001');
    return (
      <PanelHeader
        {...args}
        searchValue={query}
        onSearchChange={setQuery}
        operations={operations}
        actions={actions}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Search purchase orders' });
    await expect(search).toHaveValue('PO-1001');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(search).toHaveValue('');
    await userEvent.type(search, 'x');
    await expect(search).toHaveValue('x');
  },
};

/** Figma Page Type=Forms (17447:40111) — the same layout with only prev/next, title, status and refresh. */
export const Forms: Story = {
  args: { title: 'Panel Title', subcopy: undefined },
  render: (args) => (
    <PanelHeader
      {...args}
      icon={undefined}
      leading={
        <>
          <IconButton label="Next" intent="default" variant="solid" size="extra-large">
            {panelHeaderIcons.arrowDownward}
          </IconButton>
          <IconButton label="Previous" intent="default" variant="solid" size="extra-large">
            {panelHeaderIcons.arrowUpward}
          </IconButton>
        </>
      }
      status={
        <Badge intent="default" variant="outline" size="extra-small" dot>
          Status
        </Badge>
      }
      titleIcon={panelHeaderIcons.rotateRight}
      operations={operations}
      actions={actions}
    />
  ),
};

export const Default: Story = {
  render: (args) => (
    <PanelHeader
      {...args}
      operations={
        <>
          <IconButton label="Filter" intent="default" variant="solid" size="extra-large">
            {CircleIcon}
          </IconButton>
          <IconButton label="Sort" intent="default" variant="solid" size="extra-large">
            {CircleIcon}
          </IconButton>
        </>
      }
      actions={
        <>
          <Button intent="default" variant="solid" size="extra-large">
            Button
          </Button>
          <Button
            intent="primary"
            variant="solid"
            size="extra-large"
            trailingIcon={panelHeaderIcons.keyboardArrowDown}
          >
            Button
          </Button>
        </>
      }
      tabs={<Tabs variant="outline" items={panelTabs} />}
    />
  ),
};

/** All three icon variants stacked. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {decorativeIconVariants.map((variant) => (
        <PanelHeader
          key={variant}
          {...args}
          iconVariant={variant}
          subcopy={`iconVariant="${variant}"`}
          tabs={<Tabs variant="outline" items={panelTabs} />}
        />
      ))}
    </div>
  ),
};
