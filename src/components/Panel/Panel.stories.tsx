import type { Meta, StoryObj } from '@storybook/react';
import { Panel } from './Panel';
import { PanelHeader, panelHeaderIcons } from './PanelHeader';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Tabs } from '../Tabs/Tabs';

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

/** Full panel: header with DecorativeIcon, tabs, Card body, and 2-button footer. */
export const Default: Story = {
  render: () => (
    <Panel style={{ width: 632 }}>
      <PanelHeader
        icon="inventory_2"
        iconVariant="solid"
        title="Page Title"
        subcopy="Subcopy"
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
            <Button intent="default" variant="solid" size="extra-large">Button</Button>
            <Button intent="primary" variant="solid" size="extra-large" trailingIcon={panelHeaderIcons.keyboardArrowDown}>
              Button
            </Button>
          </>
        }
        tabs={<Tabs items={panelTabs} />}
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
        <Button intent="default" variant="solid" size="extra-large" className="flex-1">Button</Button>
        <Button intent="primary" variant="solid" size="extra-large" className="flex-1">Button</Button>
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
          iconVariant={variant}
          title="Page Title"
          subcopy={`iconVariant="${variant}"`}
          tabs={<Tabs items={panelTabs} />}
        />
      ))}
    </div>
  ),
};

/** Panel with no footer. */
export const NoFooter: Story = {
  render: () => (
    <Panel style={{ width: 632 }}>
      <PanelHeader icon="home" iconVariant="subtle" title="Page Title" subcopy="Subcopy" />
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
