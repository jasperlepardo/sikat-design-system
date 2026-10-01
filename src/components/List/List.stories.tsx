import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { List, listVariants, type ListCardField, type ListVariant } from './List';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../Button/IconButton';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import pixGlyph from './assets/pix.svg';

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <List.Group divider>
        <List.Item title="Account name" content="Jasper Lepardo" />
        <List.Item title="Account number" content="•••• 1234" />
        <List.Item title="Status" content={<Badge intent="success">Active</Badge>} />
      </List.Group>
    </div>
  ),
};

/** Figma's placeholder icon for the leading/trailing media slots. */
const CircleGlyph = <Icon>radio_button_unchecked</Icon>;

/**
 * Controls mirror the Figma List Item (node 9504:12580) and its nested List
 * Content properties 1:1 — same names, options and defaults.
 */
type ListItemPlaygroundArgs = {
  Type: ListVariant;
  title: string;
  content: string;
  showLeading: boolean;
  showTrailing: boolean;
  showDivider: boolean;
};

export const Playground: StoryObj<ListItemPlaygroundArgs> = {
  args: {
    Type: 'inline',
    title: 'Title',
    content: 'Content',
    showLeading: true,
    showTrailing: true,
    showDivider: true,
  },
  argTypes: {
    Type: figmaSelect('Type', listVariants, ['Inline', 'Stacked', 'Stacked Value', 'Value Only']),
    title: { name: 'Title', control: 'text' },
    content: { name: 'Content', control: 'text' },
    showLeading: { name: 'Show Leading', control: 'boolean' },
    showTrailing: { name: 'Show Trailing', control: 'boolean' },
    showDivider: { name: 'Show Divider', control: 'boolean' },
  },
  parameters: figmaControls([
    'Type',
    'Title',
    'Content',
    'Show Leading',
    'Show Trailing',
    'Show Divider',
  ]),
  render: (a) => (
    <div style={{ maxWidth: 410 }}>
      <List.Group>
        <List.Item
          variant={a.Type}
          title={a.title}
          content={a.content}
          leading={a.showLeading ? CircleGlyph : undefined}
          trailing={a.showTrailing ? CircleGlyph : undefined}
          divider={a.showDivider}
        />
      </List.Group>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // Title is hidden in the Value Only layout.
    if (args.Type !== 'value-only') await expect(canvas.getByText('Title')).toBeVisible();
    await expect(canvas.getByText('Content')).toBeVisible();
  },
};

/** Every Figma List Content Type: Inline, Stacked, Stacked Value, Value Only. */
export const Types: Story = {
  render: () => (
    <div style={{ maxWidth: 410 }}>
      <List.Group divider>
        {listVariants.map((variant) => (
          <List.Item
            key={variant}
            variant={variant}
            title="Title"
            content={variant}
            leading={CircleGlyph}
            trailing={CircleGlyph}
          />
        ))}
      </List.Group>
    </div>
  ),
};

/** Figma "List Item" (node 9504:12580) — leading/trailing media around a title/content pair. */
export const WithMedia: Story = {
  render: () => (
    <div style={{ maxWidth: 410 }}>
      <List.Group divider>
        <List.Item
          leading={<Icon>circle</Icon>}
          title="Title"
          content="Content"
          trailing={<Icon>circle</Icon>}
        />
        <List.Item
          leading={<Icon>account_balance</Icon>}
          title="Account number"
          content="•••• 1234"
          trailing={<Icon>chevron_right</Icon>}
        />
      </List.Group>
    </div>
  ),
};

export const Sectioned: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <List>
        <List.Section>
          <List.Header heading="Profile" subHeading="Your details" />
          <List.Group divider>
            <List.Item variant="stacked" title="Name" content="Jasper Lepardo" />
            <List.Item variant="stacked" title="Email" content="jsprlprd@gmail.com" />
          </List.Group>
        </List.Section>
        <List.Section>
          <List.Header heading="Actions" />
          <List.Group>
            <List.Item title="Open settings" onClick={() => {}} trailing="›" />
            <List.Item title="Sign out" onClick={() => {}} trailing="›" />
          </List.Group>
        </List.Section>
      </List>
    </div>
  ),
};

const addressFields: ListCardField[] = [
  { label: 'Street', value: '8th Avenue, Unit 1204' },
  { label: 'Building', value: 'Bonifacio One Technology Tower' },
  { label: 'City', value: 'Taguig' },
  { label: 'Region', value: ['Metro Manila', 'NCR'] },
  { label: 'Postal', value: ['1634', 'Philippines'] },
  { label: 'Country', value: ['Philippines', 'PH'] },
];

const onMore = fn();
const onExpandedChange = fn();

const cardProps = {
  icon: <Icon size={16}>location_on</Icon>,
  title: 'Manila HQ',
  badge: <img src={pixGlyph} alt="" width={12} height={12} />,
  fields: addressFields,
  actions: (
    <IconButton label="More actions" intent="default" variant="link" size="extra-small" onClick={onMore}>
      <Icon size={20}>more_vert</Icon>
    </IconButton>
  ),
};

/** Figma "Table Card" (node 18214:56912) — expandable record cards. Click a card to expand/collapse. */
export const Cards: Story = {
  render: () => (
    <div style={{ maxWidth: 433 }}>
      <List.Group>
        <List.Card {...cardProps} defaultExpanded onExpandedChange={onExpandedChange} />
        <List.Card {...cardProps} />
        <List.Card {...cardProps} />
      </List.Group>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = canvas.getAllByRole('button', { name: /Manila HQ/ });

    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByText('Street')).toHaveLength(1);

    await userEvent.click(second);
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByText('Street')).toHaveLength(2);

    await userEvent.click(first);
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(onExpandedChange).toHaveBeenLastCalledWith(false);

    // Actions don't toggle the card.
    await userEvent.click(canvas.getAllByRole('button', { name: 'More actions' })[1]);
    await expect(onMore).toHaveBeenCalledOnce();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
  },
};
