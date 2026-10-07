import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  PanelHeader,
  panelHeaderIcons,
  panelHeaderTypes,
  type PanelHeaderType,
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
    type: { control: 'select', options: panelHeaderTypes },
    icon: { control: 'text' },
    iconVariant: { control: 'select', options: decorativeIconVariants },
    iconSize: { control: 'number' },
    title: { control: 'text' },
    subcopy: { control: 'text' },
  },
  args: {
    type: 'table',
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
 * Controls mirror the Figma Panel Header (set 17447:35967) properties 1:1 —
 * same names, options and defaults.
 */
type PanelHeaderPlaygroundArgs = {
  pageType: PanelHeaderType;
  panelTitle: string;
  panelSubTitle: string;
  showTabs: boolean;
  showSearch: boolean;
};

export const Playground: StoryObj<PanelHeaderPlaygroundArgs> = {
  args: {
    pageType: 'table',
    panelTitle: 'Panel Title',
    panelSubTitle: 'Panel Sub Title',
    showTabs: true,
    showSearch: false,
  },
  argTypes: {
    pageType: figmaSelect('Page Type', panelHeaderTypes, ['Table', 'Forms', 'Details']),
    panelTitle: { name: 'Panel Title', control: 'text' },
    panelSubTitle: { name: 'Panel Sub Title', control: 'text' },
    showTabs: { name: 'Show Tabs', control: 'boolean' },
    showSearch: { name: 'Show Search', control: 'boolean', if: { arg: 'pageType', eq: 'table' } },
  },
  parameters: figmaControls([
    'Page Type',
    'Panel Title',
    'Panel Sub Title',
    'Show Tabs',
    'Show Search',
  ]),
  render: (a) =>
    a.pageType === 'table' ? (
      <PanelHeader
        type="table"
        icon="radio_button_unchecked"
        title={a.panelTitle}
        subcopy={a.panelSubTitle}
        showSearch={a.showSearch}
        operations={operations}
        actions={actions}
        tabs={a.showTabs ? <Tabs variant="outline" items={panelTabs} /> : undefined}
      />
    ) : (
      <PanelHeader
        type={a.pageType}
        leading={prevNext}
        title={a.panelTitle}
        subcopy={a.panelSubTitle}
        status={statusBadge}
        titleIcon={panelHeaderIcons.rotateRight}
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
 * Details page header (Figma Page Type3, 18725:323053) — Forms' prev/next and
 * title + status + refresh row, plus Table's subcopy and outline tabs.
 */
export const Details: Story = {
  args: { type: 'details', title: 'Panel Title', subcopy: 'Panel Sub Title' },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Panel Title' })).toBeVisible();
    await expect(canvas.getByText('Panel Sub Title')).toBeVisible();
    await expect(canvas.getByText('Status')).toBeVisible();
    await expect(canvas.getByRole('tablist')).toBeVisible();
  },
};

/**
 * Table header with search — three equal columns: title block | search | buttons.
 */
export const TableWithSearch: Story = {
  args: {
    type: 'table',
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

/** Figma Page Type=Forms (17447:40111) — prev/next, title, status, refresh glyph. */
export const Forms: Story = {
  args: { type: 'forms', title: 'Panel Title' },
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
