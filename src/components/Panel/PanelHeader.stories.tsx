import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { PanelHeader, panelHeaderIcons, panelHeaderVariants } from './PanelHeader';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { ButtonGroup } from '../Button/ButtonGroup';
import { Tabs } from '../Tabs/Tabs';
import { Icon } from '../Icon/Icon';
import { Badge } from '../Badge/Badge';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import { decorativeIconVariants, decorativeIconIntents } from '../DecorativeIcon/DecorativeIcon';

const meta = {
  title: 'Components/Panel/Panel Header',
  component: PanelHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: panelHeaderVariants },
    icon: { control: 'text' },
    iconIntent: { control: 'inline-radio', options: decorativeIconIntents },
    iconVariant: { control: 'select', options: decorativeIconVariants },
    iconSize: { control: 'number' },
    iconShape: { control: 'inline-radio', options: ['circle', 'rounded'] },
    title: { control: 'text' },
  },
  args: {
    variant: 'card',
    icon: 'inventory_2',
    iconIntent: 'default',
    iconVariant: 'outline',
    iconSize: 28,
    iconShape: 'rounded',
    title: 'Panel Title',
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
    <Button intent="primary" variant="solid" size="medium" shape="pill">
      Button
    </Button>
  </>
);

const prevNext = (
  <ButtonGroup
    type="enclosed"
    intent="white"
    variant="solid"
    buttonIntent="default"
    buttonVariant="link"
  >
    <IconButton label="Previous" shape="pill" size="small">
      {panelHeaderIcons.arrowUpward}
    </IconButton>
    <IconButton label="Next" shape="pill" size="small">
      {panelHeaderIcons.arrowDownward}
    </IconButton>
  </ButtonGroup>
);

const statusBadge = (
  <Badge intent="default" variant="outline" size="extra-small" dot>
    Status
  </Badge>
);

type PlaygroundExtras = {
  showSearch: boolean;
  showTabs: boolean;
  showStatus: boolean;
  showTitleIcon: boolean;
  showTrailing: boolean;
  showOperations: boolean;
  showActions: boolean;
};

export const Playground: Story & { args: PlaygroundExtras } = {
  args: {
    showSearch: false,
    showTabs: true,
    showStatus: false,
    showTitleIcon: false,
    showTrailing: false,
    showOperations: true,
    showActions: true,
  },
  argTypes: {
    variant: figmaSelect('Variant', panelHeaderVariants, ['Card', 'Plain']),
    ...({
      showSearch: { name: 'Search', control: 'boolean' },
      showTabs: { name: 'Tabs', control: 'boolean' },
      showStatus: { name: 'Status', control: 'boolean' },
      showTitleIcon: { name: 'Title Icon', control: 'boolean' },
      showTrailing: { name: 'Prev / Next', control: 'boolean' },
      showOperations: { name: 'Operations', control: 'boolean' },
      showActions: { name: 'Actions', control: 'boolean' },
    } as Record<string, unknown>),
  },
  parameters: figmaControls([
    'Variant',
    'Search',
    'Tabs',
    'Status',
    'Title Icon',
    'Prev / Next',
    'Operations',
    'Actions',
  ]),
  render: (a) => {
    const {
      showSearch,
      showTabs,
      showStatus,
      showTitleIcon,
      showTrailing,
      showOperations,
      showActions,
      ...rest
    } = a as typeof a & PlaygroundExtras;
    return (
      <PanelHeader
        {...rest}
        status={showStatus ? statusBadge : undefined}
        titleIcon={showTitleIcon ? panelHeaderIcons.rotateRight : undefined}
        showSearch={showSearch}
        operations={showOperations ? operations : undefined}
        actions={showActions ? actions : undefined}
        trailing={showTrailing ? prevNext : undefined}
        tabs={showTabs ? <Tabs variant="outline" items={panelTabs} /> : undefined}
      />
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: (args as typeof args & { title: string }).title }),
    ).toBeVisible();
  },
};
