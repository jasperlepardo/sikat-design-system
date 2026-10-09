import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Panel } from './Panel';
import { PanelHeader, panelHeaderIcons } from './PanelHeader';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../Button/IconButton';
import { ButtonGroup } from '../Button/ButtonGroup';
import { Tabs } from '../Tabs/Tabs';
import { Select } from '../Field/Select';
import { figmaControls } from '../../docs/figma-controls';

const meta = {
  title: 'Components/Panel',
  component: Panel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

const ArtTrackIcon = <Icon size={24}>art_track</Icon>;
const CircleIcon = <Icon size={20}>radio_button_unchecked</Icon>;

const panelTabs = [
  { value: 'all', label: 'All', icon: CircleIcon, badge: '+9' },
  { value: 'active', label: 'Active', icon: CircleIcon },
];

const operations = (
  <>
    <IconButton label="Filter" intent="white" variant="solid" size="medium" shape="pill">
      {CircleIcon}
    </IconButton>
    <IconButton label="Sort" intent="white" variant="solid" size="medium" shape="pill">
      {CircleIcon}
    </IconButton>
  </>
);

const actions = (
  <>
    <Button intent="white" variant="solid" size="medium" shape="pill">
      Button
    </Button>
    <Button intent="primary" variant="solid" size="medium" shape="pill"
      trailingIcon={panelHeaderIcons.keyboardArrowDown}>
      Button
    </Button>
  </>
);

const prevNext = (
  <ButtonGroup type="enclosed" intent="white" variant="solid" buttonIntent="default" buttonVariant="link">
    <IconButton label="Previous" shape="pill" size="small">
      {panelHeaderIcons.arrowUpward}
    </IconButton>
    <IconButton label="Next" shape="pill" size="small">
      {panelHeaderIcons.arrowDownward}
    </IconButton>
  </ButtonGroup>
);

/** Full panel: header with DecorativeIcon, tabs, Card body, and 2-button footer. */
export const Default: Story = {
  render: () => (
    <Panel style={{ width: 632 }}>
      <PanelHeader
        icon="inventory_2"
        iconIntent="default"
        iconVariant="outline"
        iconSize={28}
        iconShape="rounded"
        title="Page Title"
        operations={operations}
        actions={actions}
        tabs={<Tabs variant="outline" items={panelTabs} />}
      />
      <Panel.Body>
        <Card>
          <Card.Header icon={ArtTrackIcon}>Details</Card.Header>
          <Card.Content>
            <p style={{ color: 'var(--color-text-body)', minHeight: 120 }}>
              Content slot — place section cards or other content here.
            </p>
          </Card.Content>
        </Card>
      </Panel.Body>
      <Panel.Footer>
        <Button intent="default" variant="solid" size="extra-large">Button</Button>
        <Button intent="primary" variant="solid" size="extra-large">Button</Button>
      </Panel.Footer>
    </Panel>
  ),
};

/**
 * Controls mirror the Figma Panel (set 9474:6173) properties 1:1 —
 * is Horizontal and Show Footer.
 */
type PanelPlaygroundArgs = { isHorizontal: boolean; showFooter: boolean };

const SlotContent = (
  <Card>
    <Card.Header icon={ArtTrackIcon}>Details</Card.Header>
    <Card.Content>
      <p style={{ color: 'var(--color-text-body)', minHeight: 80 }}>Content slot.</p>
    </Card.Content>
  </Card>
);

export const Playground: StoryObj<PanelPlaygroundArgs> = {
  args: { isHorizontal: false, showFooter: true },
  argTypes: {
    isHorizontal: { name: 'is Horizontal', control: 'boolean' },
    showFooter: { name: 'Show Footer', control: 'boolean' },
  },
  parameters: figmaControls(['is Horizontal', 'Show Footer']),
  render: (a) => (
    <Panel horizontal={a.isHorizontal} style={{ width: a.isHorizontal ? 1248 : 632 }}>
      {a.isHorizontal ? null : (
        <PanelHeader
          icon="inventory_2"
          iconIntent="default"
          iconVariant="outline"
          iconSize={28}
          iconShape="rounded"
          title="Panel Title"
          operations={operations}
          actions={actions}
          trailing={prevNext}
        />
      )}
      <Panel.Body>{SlotContent}</Panel.Body>
      {a.showFooter ? (
        <Panel.Footer>
          {a.isHorizontal ? (
            <>
              <Button intent="primary" variant="solid" size="extra-large">Button</Button>
              <Button intent="default" variant="solid" size="extra-large">Button</Button>
            </>
          ) : (
            <>
              <Button intent="default" variant="solid" size="extra-large">Button</Button>
              <Button intent="primary" variant="solid" size="extra-large">Button</Button>
            </>
          )}
        </Panel.Footer>
      ) : null}
    </Panel>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByRole('button', { name: 'Button' })).toHaveLength(
      (args.showFooter ? 2 : 0) + (args.isHorizontal ? 0 : 2),
    );
  },
};

/** Figma is Horizontal=True (9474:6501) — content and stacked footer side by side. */
export const Horizontal: Story = {
  render: () => (
    <Panel horizontal style={{ width: 1248 }}>
      <Panel.Body>{SlotContent}</Panel.Body>
      <Panel.Footer>
        <Button intent="primary" variant="solid" size="extra-large">Button</Button>
        <Button intent="default" variant="solid" size="extra-large">Button</Button>
      </Panel.Footer>
    </Panel>
  ),
};

/** PanelHeader icon variants — solid, subtle, outline. */
export const HeaderOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: 632 }}>
      {(['solid', 'subtle', 'outline'] as const).map((variant) => (
        <PanelHeader
          key={variant}
          icon="inventory_2"
          iconIntent="default"
          iconVariant={variant}
          iconSize={28}
          iconShape="rounded"
          title="Page Title"
          tabs={<Tabs variant="outline" items={panelTabs} />}
        />
      ))}
    </div>
  ),
};

/** Summary block — entity identity at the top of Panel.Sidebar. */
export const Summary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 300 }}>
      <Panel.Summary icon="person" iconVariant="outline" iconSize={40} name="Customer Name" code="BP-00001" />
      <Panel.Summary icon="inventory_2" iconVariant="solid" iconSize={40} name="Sales Order" code="SO-2024-00042" />
      <Panel.Summary
        icon="receipt_long"
        iconVariant="subtle"
        iconSize={40}
        name="A very long entity name that should truncate gracefully"
        code="INV-00999"
      />
    </div>
  ),
};

/** Panel with no footer. */
export const NoFooter: Story = {
  render: () => (
    <Panel style={{ width: 632 }}>
      <PanelHeader
        icon="home"
        iconIntent="default"
        iconVariant="outline"
        iconSize={28}
        iconShape="rounded"
        title="Page Title"
      />
      <Panel.Body>
        <Card>
          <Card.Header icon={ArtTrackIcon}>Details</Card.Header>
          <Card.Content>
            <p style={{ color: 'var(--color-text-body)', minHeight: 120 }}>Content slot.</p>
          </Card.Content>
        </Card>
      </Panel.Body>
    </Panel>
  ),
};

/** Always light: on a dark page the Panel and everything in it keep the light theme. */
export const OnDarkPage: StoryObj<typeof Panel> = {
  render: () => (
    <div
      data-theme="dark"
      style={{ height: 320, padding: 8, display: 'flex', background: 'var(--color-bg-secondary)' }}
    >
      <Panel>
        <PanelHeader
          icon="inventory_2"
          iconIntent="default"
          iconVariant="outline"
          iconSize={28}
          iconShape="rounded"
          title="Orders"
        />
        <Panel.Body>
          <Card>
            <Card.Header>Section</Card.Header>
            <Card.Content>
              <p className="text-body">Content</p>
              <Select
                aria-label="Discount"
                defaultValue="lowest"
                options={[
                  { value: 'lowest', label: 'Lowest discount' },
                  { value: 'highest', label: 'Highest discount' },
                ]}
              />
            </Card.Content>
          </Card>
        </Panel.Body>
      </Panel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvasElement.querySelector<HTMLElement>('.sikat-panel')!;
    await expect(panel).toHaveAttribute('data-theme', 'light');
    await expect(getComputedStyle(panel).backgroundColor).toBe('rgb(255, 255, 255)');
    const page = canvasElement.querySelector<HTMLElement>('[data-theme="dark"]')!;
    const header = canvas.getByRole('banner');
    await expect(getComputedStyle(header).backgroundColor).not.toBe(
      getComputedStyle(page).backgroundColor,
    );
    await userEvent.click(canvas.getByRole('combobox', { name: 'Discount' }));
    const listbox = within(document.body).getByRole('listbox');
    await expect(listbox).toHaveAttribute('data-theme', 'light');
    await expect(getComputedStyle(listbox).backgroundColor).toBe('rgb(255, 255, 255)');
    await userEvent.keyboard('{Escape}');
  },
};
