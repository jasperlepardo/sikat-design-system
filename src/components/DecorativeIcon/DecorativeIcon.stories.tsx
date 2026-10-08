import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import {
  DecorativeIcon,
  decorativeIconIntents,
  decorativeIconVariants,
  decorativeIconRoundeds,
  type DecorativeIconIntent,
  type DecorativeIconVariant,
  type DecorativeIconRounded,
} from './DecorativeIcon';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

const meta = {
  title: 'Components/DecorativeIcon',
  component: DecorativeIcon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { intent: 'default', variant: 'solid', rounded: 'full', icon: 'circle', size: 80 },
  argTypes: {
    intent: { control: 'inline-radio', options: decorativeIconIntents },
    variant: { control: 'inline-radio', options: decorativeIconVariants },
    rounded: { control: 'inline-radio', options: decorativeIconRoundeds },
    icon: { control: 'text' },
    size: { control: 'number' },
  },
} satisfies Meta<typeof DecorativeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls mirror the Figma "Decorative Icons" component properties 1:1. */
type DecorativeIconPlaygroundArgs = {
  Intent: DecorativeIconIntent;
  Style: DecorativeIconVariant;
  Rounded: DecorativeIconRounded;
  icon: string;
};

export const Playground: StoryObj<DecorativeIconPlaygroundArgs> = {
  args: { Intent: 'default', Style: 'solid', Rounded: 'full', icon: 'circle' },
  argTypes: {
    Intent: figmaSelect('Intent', decorativeIconIntents, [
      'Default',
      'Primary',
      'Success',
      'Warning',
      'Danger',
      'White',
      'Black',
    ]),
    Style: figmaSelect('Style', decorativeIconVariants, ['Solid', 'Ghost', 'Outline', 'Link']),
    Rounded: figmaSelect('Rounded', decorativeIconRoundeds, ['Full', 'Default', 'None']),
    icon: { control: 'text' },
  },
  parameters: figmaControls(['Intent', 'Style', 'Rounded', 'icon']),
  render: ({ Intent, Style, Rounded, icon }) => (
    <DecorativeIcon
      data-testid="decorative-icon"
      intent={Intent}
      variant={Style}
      rounded={Rounded}
      icon={icon}
    />
  ),
  play: async ({ canvasElement }) => {
    const el = within(canvasElement).getByTestId('decorative-icon');
    await expect(el).toHaveAttribute('data-intent', 'default');
    await expect(el).toHaveAttribute('data-style', 'solid');
    await expect(el).toHaveAttribute('data-rounded', 'full');
    await expect(getComputedStyle(el).width).toBe('80px');
  },
};

/** Every Intent × Style for one corner shape — mirrors a block of the Figma set. */
const Matrix = ({ rounded }: { rounded: DecorativeIconRounded }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${decorativeIconVariants.length}, auto)`,
      gap: 24,
    }}
  >
    {decorativeIconIntents.flatMap((intent) =>
      decorativeIconVariants.map((variant) => (
        <DecorativeIcon
          key={`${intent}-${variant}`}
          intent={intent}
          variant={variant}
          rounded={rounded}
          icon="circle"
          title={`${intent} / ${variant}`}
        />
      )),
    )}
  </div>
);

export const RoundedFull: Story = { render: () => <Matrix rounded="full" /> };

export const RoundedDefault: Story = { render: () => <Matrix rounded="default" /> };

export const RoundedNone: Story = { render: () => <Matrix rounded="none" /> };

/** Size scaling — container and icon both scale from the `size` prop. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {[40, 56, 80, 100, 120].map((size) => (
        <DecorativeIcon key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
