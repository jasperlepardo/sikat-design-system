import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, avatarVariants, avatarIntents } from './Avatar';
import { Field } from '../Field/Field';

const PHOTO = 'https://i.pravatar.cc/80';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: avatarVariants },
    intent: { control: 'inline-radio', options: avatarIntents },
    shape: { control: 'inline-radio', options: ['circle', 'rounded'] },
    size: { control: { type: 'number' } },
  },
  args: { initials: 'JL', size: 48 },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Photo — `src` renders a clipped image filling the container. */
export const Photo: Story = {
  args: { src: PHOTO },
};

/** Initials fallback — shown when there's no `src`. */
export const Initials: Story = {
  args: { initials: 'JL' },
};

/** Icon fallback — shown when there's neither `src` nor `initials`. */
export const IconFallback: Story = {
  args: { initials: undefined, icon: 'person' },
};

/** Content priority: `src` → `initials` → `icon`. */
export const ContentPriority: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar src={PHOTO} initials="JL" icon="person" />
      <Avatar initials="JL" icon="person" />
      <Avatar icon="person" />
    </div>
  ),
};

/** Sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {[24, 32, 48, 64, 80].map((size) => (
        <Avatar key={size} src={PHOTO} size={size} />
      ))}
    </div>
  ),
};

/** Shape + placeholder palette (intent / variant) for the initials state. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar initials="JL" intent="primary" variant="subtle" />
      <Avatar initials="JL" intent="default" variant="subtle" />
      <Avatar initials="JL" intent="primary" variant="solid" />
      <Avatar initials="JL" variant="outline" />
      <Avatar initials="JL" shape="rounded" />
      <Avatar src={PHOTO} shape="rounded" />
    </div>
  ),
};

/**
 * In a Field — drop the Avatar into `leadingIcon`. The avatar keeps its declared
 * size and the field contains it inside its padding.
 */
export const InField: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Field.Group label="Assignee">
        {(props) => (
          <Field.Text
            {...props}
            defaultValue="Jasper Lepardo"
            leadingIcon={<Avatar src={PHOTO} size={24} />}
          />
        )}
      </Field.Group>
    </div>
  ),
};
