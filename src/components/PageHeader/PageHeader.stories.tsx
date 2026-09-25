import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { PageHeader, pageHeaderIcons, pageHeaderTypes, type PageHeaderType } from './PageHeader';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { Tabs } from '../Tabs/Tabs';
import { Icon } from '../Icon/Icon';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

/** Figma's placeholder icon (circle) for the slot buttons and tabs. */
const Circle = (
  <Icon size={20}>
    <circle cx="12" cy="12" r="9" />
  </Icon>
);

/** Figma "Operation Buttons" default content: two Extra Large Icon Buttons. */
const operations = (style: 'solid' | 'ghost') => (
  <>
    <IconButton label="Operation 1" intent="default" variant={style} size="extra-large">
      {Circle}
    </IconButton>
    <IconButton label="Operation 2" intent="default" variant={style} size="extra-large">
      {Circle}
    </IconButton>
  </>
);

/** Figma "Core Action Button" default content. */
const actions = (secondary: 'solid' | 'ghost') => (
  <>
    <Button intent="default" variant={secondary} size="extra-large">
      Button
    </Button>
    <Button
      intent="primary"
      variant="solid"
      size="extra-large"
      trailingIcon={pageHeaderIcons.keyboardArrowDown}
    >
      Button
    </Button>
  </>
);

const tableHeader = (title: string, subcopy: string) => (
  <PageHeader
    type="table"
    title={title}
    subcopy={subcopy}
    leading={
      <IconButton label="Module" intent="default" variant="outline" size="extra-large">
        {pageHeaderIcons.pix}
      </IconButton>
    }
    operations={operations('solid')}
    actions={actions('solid')}
    tabs={
      <Tabs
        aria-label="Views"
        items={[
          { value: 'a', label: 'Tabs', icon: Circle, badge: '+9' },
          { value: 'b', label: 'Tabs', icon: Circle, badge: '+9' },
        ]}
      />
    }
  />
);

const formsHeader = (title: string) => (
  <PageHeader
    type="forms"
    title={title}
    leading={
      <>
        <IconButton label="Next record" intent="default" variant="ghost" size="extra-large">
          {pageHeaderIcons.arrowDownward}
        </IconButton>
        <IconButton label="Previous record" intent="default" variant="ghost" size="extra-large">
          {pageHeaderIcons.arrowUpward}
        </IconButton>
      </>
    }
    status={
      <Badge intent="default" variant="outline" size="medium" dot>
        Status
      </Badge>
    }
    titleIcon={pageHeaderIcons.rotateRight}
    operations={operations('ghost')}
    actions={actions('ghost')}
  />
);

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { title: 'Page Title' },
} satisfies Meta<typeof PageHeader>;

export default meta;

/** Controls mirror the Figma Header properties: Page Type, Page Title, Subcopy. */
type PageHeaderPlaygroundArgs = { pageType: PageHeaderType; pageTitle: string; subcopy: string };

export const Playground: StoryObj<PageHeaderPlaygroundArgs> = {
  args: { pageType: 'table', pageTitle: 'Page Title', subcopy: 'Subcopy' },
  argTypes: {
    pageType: figmaSelect('Page Type', pageHeaderTypes, ['Table', 'Forms']),
    pageTitle: { name: 'Page Title', control: 'text' },
    subcopy: { name: 'Subcopy', control: 'text' },
  },
  parameters: figmaControls(['Page Type', 'Page Title', 'Subcopy']),
  render: (a) =>
    a.pageType === 'table' ? tableHeader(a.pageTitle, a.subcopy) : formsHeader(a.pageTitle),
};

/** Figma Page Type = Table: 120px — title over subcopy, tabs below. */
export const Table: StoryObj<typeof meta> = {
  render: () => tableHeader('Page Title', 'Subcopy'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector('.sikat-page-header')!;
    await expect(header.getBoundingClientRect().height).toBe(120);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Page Title');
    await expect(canvas.getByText('Subcopy')).toBeInTheDocument();
    await expect(canvas.getByRole('tablist', { name: 'Views' })).toBeInTheDocument();
    // Divider between the slots: a 2×20 vertical line (Figma's rotated 20px asset).
    const line = canvasElement
      .querySelector('.sikat-page-header__divider img')!
      .getBoundingClientRect();
    await expect([Math.round(line.width), Math.round(line.height)]).toEqual([2, 20]);
    // Extra Large buttons (40px), as in Figma.
    for (const b of canvas.getAllByRole('button'))
      await expect(b.getBoundingClientRect().height).toBe(40);
  },
};

/** Figma Page Type = Forms: 68px — one row with a status after the title. */
export const Forms: StoryObj<typeof meta> = {
  render: () => formsHeader('Page Title'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector('.sikat-page-header')!;
    await expect(header.getBoundingClientRect().height).toBe(68);
    await expect(canvas.getByText('Status')).toBeInTheDocument();
    await expect(canvas.queryByRole('tablist')).toBeNull();
  },
};
