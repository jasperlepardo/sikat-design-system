import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Badge, badgeIntents, badgeStyles, badgeSizes } from './Badge';
import { Icon } from '../Icon/Icon';

const CheckGlyph = (
  <Icon size={16}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge', intent: 'default', variant: 'solid', size: 'medium' },
  argTypes: {
    intent: { control: 'inline-radio', options: badgeIntents },
    variant: { control: 'inline-radio', options: badgeStyles },
    size: { control: 'inline-radio', options: badgeSizes },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDot: Story = {
  args: { intent: 'success', dot: true, children: 'Active' },
};

export const WithIcon: Story = {
  args: { intent: 'primary', leadingIcon: CheckGlyph, children: 'Verified' },
};

export const Dismissible: Story = {
  args: { intent: 'danger', children: 'Error', onDismiss: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /dismiss/i });
    await userEvent.click(btn);
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {badgeStyles.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-2">
          {badgeIntents.map((intent) => (
            <Badge key={intent} intent={intent} variant={variant}>
              {intent}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {badgeSizes.map((size) => (
        <Badge key={size} intent="primary" size={size}>
          {size}
        </Badge>
      ))}
    </div>
  ),
};

const CircleGlyph = (
  <Icon size={16}>
    <circle cx="12" cy="12" r="9" />
  </Icon>
);

/** Every slot on, as in the Figma Badge component set (all sizes 16px icons, 12/16 label). */
export const Anatomy: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {badgeSizes.map((size) => (
        <Badge
          key={size}
          size={size}
          dot
          leadingIcon={CircleGlyph}
          trailingIcon={CircleGlyph}
          onDismiss={() => {}}
          data-testid={`badge-${size}`}
        >
          Badge
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heights = { 'extra-small': 20, small: 24, medium: 28, large: 32, 'extra-large': 36 };
    for (const size of badgeSizes) {
      const badge = canvas.getByTestId(`badge-${size}`);
      await expect(badge.getBoundingClientRect().height).toBe(heights[size]);
      const label = getComputedStyle(badge);
      await expect(label.fontSize).toBe('12px');
      await expect(label.lineHeight).toBe('16px');
      await expect(label.fontWeight).toBe('500');
    }
  },
};
