import type { Meta, StoryObj } from '@storybook/react';
import { DecorativeIcon, decorativeIconVariants } from './DecorativeIcon';

const meta = {
  title: 'Components/DecorativeIcon',
  component: DecorativeIcon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: decorativeIconVariants },
    icon: { control: 'text' },
  },
  args: { variant: 'solid', icon: 'circle' },
} satisfies Meta<typeof DecorativeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: { variant: 'solid', icon: 'circle' },
};

export const Subtle: Story = {
  args: { variant: 'subtle', icon: 'circle' },
};

export const Outline: Story = {
  args: { variant: 'outline', icon: 'circle' },
};

/** Size scaling — container and icon both scale from the `size` prop. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {[40, 56, 80, 100, 120].map((size) => (
        <DecorativeIcon key={size} icon="circle" variant="solid" size={size} />
      ))}
    </div>
  ),
};

/** All three variants side by side — mirrors Figma node 10716:174. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <DecorativeIcon icon="circle" variant="solid" />
      <DecorativeIcon icon="circle" variant="subtle" />
      <DecorativeIcon icon="circle" variant="outline" />
    </div>
  ),
};
