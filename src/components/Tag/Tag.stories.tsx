import type { Meta, StoryObj } from '@storybook/react';
import { Tag, tagIntents, tagStyles } from './Tag';
import { Icon } from '../Icon/Icon';

const LabelGlyph = <Icon size={16}>sell</Icon>;

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    intent: { control: 'select', options: tagIntents },
    variant: { control: 'select', options: tagStyles },
  },
  args: { intent: 'default', variant: 'outline', children: 'Label' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { leadingIcon: LabelGlyph, children: 'Design' },
};

/** Every intent in both styles — Tags categorize content (non-interactive). */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {tagStyles.map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tagIntents.map((intent) => (
            <Tag key={intent} intent={intent} variant={variant}>
              {intent}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  ),
};
