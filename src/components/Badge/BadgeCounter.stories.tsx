import type { Meta, StoryObj } from '@storybook/react';
import {
  BadgeCounter,
  badgeCounterIntents,
  badgeCounterStyles,
  type BadgeCounterIntent,
  type BadgeCounterStyle,
} from './Badge';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

const meta = {
  title: 'Components/Badge/Badge Counter',
  component: BadgeCounter,
  tags: ['autodocs'],
  args: { intent: 'default', variant: 'solid', count: 5 },
  argTypes: {
    intent: { control: 'inline-radio', options: badgeCounterIntents },
    variant: { control: 'inline-radio', options: badgeCounterStyles },
    count: { control: 'number' },
    max: { control: 'number' },
  },
} satisfies Meta<typeof BadgeCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls mirror the Figma Badge Counter component properties 1:1 — same names,
 * options and order (args keyed by the Figma property names).
 */
type BadgeCounterPlaygroundArgs = {
  Intent: BadgeCounterIntent;
  Style: BadgeCounterStyle;
  Size: 'extra-small';
  content: string;
};

export const Playground: StoryObj<BadgeCounterPlaygroundArgs> = {
  args: { Intent: 'default', Style: 'solid', Size: 'extra-small', content: '+9' },
  argTypes: {
    Intent: figmaSelect('Intent', badgeCounterIntents, [
      'Default',
      'Primary',
      'Success',
      'Warning',
      'Danger',
    ]),
    Style: figmaSelect('Style', badgeCounterStyles, ['Solid', 'Outline', 'Ghost']),
    Size: figmaSelect('Size', ['extra-small'] as const, ['Extra Small']),
    content: { name: 'Content', control: 'text' },
  },
  parameters: figmaControls(['Intent', 'Style', 'Size', 'Content']),
  render: (a) => (
    <BadgeCounter intent={a.Intent} variant={a.Style}>
      {a.content}
    </BadgeCounter>
  ),
};

export const Default: Story = {};

export const WithMax: Story = {
  args: { count: 120, max: 99 },
};

export const Intents: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {badgeCounterIntents.map((intent) => (
        <BadgeCounter key={intent} intent={intent} count={9} />
      ))}
    </div>
  ),
};

export const Styles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {badgeCounterStyles.map((variant) => (
        <BadgeCounter key={variant} variant={variant} intent="primary" count={9} />
      ))}
    </div>
  ),
};
