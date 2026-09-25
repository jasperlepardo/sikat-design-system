import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import {
  BadgeCounter,
  badgeCounterIntents,
  badgeCounterStyles,
  type BadgeCounterIntent,
  type BadgeCounterStyle,
} from './BadgeCounter';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

const meta = {
  title: 'Components/BadgeCounter',
  component: BadgeCounter,
  tags: ['autodocs'],
  args: { intent: 'danger', variant: 'solid', count: 5 },
  argTypes: {
    intent: { control: 'inline-radio', options: badgeCounterIntents },
    variant: { control: 'inline-radio', options: badgeCounterStyles },
  },
} satisfies Meta<typeof BadgeCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls mirror the Figma Badge Counter component properties 1:1 — same names,
 * options and defaults (args keyed by the Figma property names).
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
    <BadgeCounter intent={a.Intent} variant={a.Style} data-testid="counter">
      {a.content}
    </BadgeCounter>
  ),
  play: async ({ canvasElement }) => {
    const counter = within(canvasElement).getByTestId('counter');
    const box = counter.getBoundingClientRect();
    await expect([box.width, box.height]).toEqual([20, 20]);
    const style = getComputedStyle(counter);
    await expect(style.fontSize).toBe('12px');
    await expect(style.lineHeight).toBe('16px');
    await expect(style.fontWeight).toBe('600');
  },
};

export const Overflow: Story = {
  args: { count: 128, max: 99 },
};

export const Matrix: Story = {
  render: () => (
    <div className="flex gap-3">
      {badgeCounterStyles.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          {badgeCounterIntents.map((intent) => (
            <BadgeCounter key={intent} intent={intent} variant={variant}>
              +9
            </BadgeCounter>
          ))}
        </div>
      ))}
    </div>
  ),
};
