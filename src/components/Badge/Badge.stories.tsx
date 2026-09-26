import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Badge,
  badgeIntents,
  badgeStyles,
  badgeSizes,
  type BadgeIntent,
  type BadgeStyle,
  type BadgeSize,
} from './Badge';
import { Icon } from '../Icon/Icon';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

/** Figma's placeholder icon for the leading/trailing slots. */
const CircleGlyph = <Icon size={16}>radio_button_unchecked</Icon>;

const CheckGlyph = <Icon size={16}>check</Icon>;

const meta = {
  title: 'Components/Badge/Badge',
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

/**
 * Controls mirror the Figma Badge component properties 1:1 — same names, options
 * and defaults (args keyed by the Figma property names).
 */
type BadgePlaygroundArgs = {
  Intent: BadgeIntent;
  Style: BadgeStyle;
  Size: BadgeSize;
  badgeLabel: string;
  showDot: boolean;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
  isDismissable: boolean;
  onDismiss: () => void;
};

export const Playground: StoryObj<BadgePlaygroundArgs> = {
  args: {
    Intent: 'default',
    Style: 'solid',
    Size: 'medium',
    badgeLabel: 'Badge',
    showDot: true,
    showLeadingIcon: true,
    showTrailingIcon: true,
    isDismissable: true,
    onDismiss: fn(),
  },
  argTypes: {
    Intent: figmaSelect('Intent', badgeIntents, [
      'Default',
      'Primary',
      'Success',
      'Warning',
      'Danger',
      'White',
      'Black',
    ]),
    Style: figmaSelect('Style', badgeStyles, ['Solid', 'Outline', 'Ghost']),
    Size: figmaSelect('Size', badgeSizes, [
      'Extra Small',
      'Small',
      'Medium',
      'Large',
      'Extra Large',
    ]),
    badgeLabel: { name: 'Badge Label', control: 'text' },
    showDot: { name: 'Show Dot', control: 'boolean' },
    showLeadingIcon: { name: 'Show Leading Icon', control: 'boolean' },
    showTrailingIcon: { name: 'Show Trailing Icon', control: 'boolean' },
    isDismissable: { name: 'Is Dismissable', control: 'boolean' },
  },
  parameters: figmaControls([
    'Intent',
    'Style',
    'Size',
    'Badge Label',
    'Show Dot',
    'Show Leading Icon',
    'Show Trailing Icon',
    'Is Dismissable',
  ]),
  render: (a) => (
    <Badge
      intent={a.Intent}
      variant={a.Style}
      size={a.Size}
      dot={a.showDot}
      leadingIcon={a.showLeadingIcon ? CircleGlyph : undefined}
      trailingIcon={a.showTrailingIcon ? CircleGlyph : undefined}
      onDismiss={a.isDismissable ? a.onDismiss : undefined}
    >
      {a.badgeLabel}
    </Badge>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Badge')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /dismiss/i }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};

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
