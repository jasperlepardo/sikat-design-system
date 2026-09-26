import type { Meta, StoryObj } from '@storybook/react';
import { PanelHeader, panelHeaderIcons, panelHeaderTypes } from './PanelHeader';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Tabs } from '../Tabs/Tabs';
import { Icon } from '../Icon/Icon';
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
    iconSize: 48,
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
          <Button intent="default" variant="solid" size="extra-large">Button</Button>
          <Button intent="primary" variant="solid" size="extra-large" trailingIcon={panelHeaderIcons.keyboardArrowDown}>
            Button
          </Button>
        </>
      }
      tabs={<Tabs items={panelTabs} />}
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
          tabs={<Tabs items={panelTabs} />}
        />
      ))}
    </div>
  ),
};
