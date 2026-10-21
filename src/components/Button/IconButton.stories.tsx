import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  IconButton,
  iconButtonIntents,
  iconButtonStyles,
  iconButtonSizes,
  type IconButtonIntent,
  type IconButtonStyle,
  type IconButtonSize,
} from './IconButton';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import { Icon } from '../Icon/Icon';

const CloseGlyph = <Icon>close</Icon>;

const meta = {
  title: 'Components/Button/Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    label: 'Close',
    intent: 'primary',
    variant: 'solid',
    size: 'medium',
    children: CloseGlyph,
    onClick: fn(),
  },
  argTypes: {
    intent: { control: 'inline-radio', options: iconButtonIntents },
    variant: { control: 'inline-radio', options: iconButtonStyles },
    size: { control: 'inline-radio', options: iconButtonSizes },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls mirror the Figma Icon Button component properties 1:1 — same names,
 * options and order (args keyed by the Figma property names). `label` (the
 * accessible name) is code-only and not a control.
 */
type IconButtonPlaygroundArgs = {
  Type: IconButtonIntent;
  Style: IconButtonStyle;
  Size: IconButtonSize;
  State: 'default' | 'hover' | 'disabled';
  onClick: () => void;
};

export const Playground: StoryObj<IconButtonPlaygroundArgs> = {
  args: { Type: 'primary', Style: 'solid', Size: 'medium', State: 'default', onClick: fn() },
  argTypes: {
    Type: figmaSelect('Type', iconButtonIntents, [
      'Default',
      'Primary',
      'Success',
      'Warning',
      'Danger',
      'White',
      'Black',
    ]),
    // Figma's Icon Button lists styles as Solid, Ghost, Outline, Link.
    Style: figmaSelect('Style', ['solid', 'ghost', 'outline', 'link'] as const, [
      'Solid',
      'Ghost',
      'Outline',
      'Link',
    ]),
    Size: figmaSelect('Size', iconButtonSizes, [
      'Extra Large',
      'Large',
      'Medium',
      'Small',
      'Extra Small',
      '2xs',
    ]),
    State: figmaSelect('State', ['default', 'hover', 'disabled'] as const, [
      'Default',
      'Hover',
      'Disabled',
    ]),
  },
  parameters: figmaControls(['Type', 'Style', 'Size', 'State']),
  render: ({ Type, Style, Size, State, onClick }) => (
    <IconButton
      label="Close"
      intent={Type}
      variant={Style}
      size={Size}
      {...{ 'data-state': State === 'hover' ? 'hover' : undefined }}
      disabled={State === 'disabled'}
      onClick={onClick}
    >
      {CloseGlyph}
    </IconButton>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /close/i });
    await expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {iconButtonIntents.map((intent) => (
        <div key={intent} className="flex items-center gap-2">
          {iconButtonStyles.map((variant) => (
            <IconButton
              key={variant}
              intent={intent}
              variant={variant}
              label={`${intent} ${variant}`}
            >
              {CloseGlyph}
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  ),
};

const BOX: Record<IconButtonSize, number> = {
  'extra-large': 40,
  large: 36,
  medium: 32,
  small: 28,
  'extra-small': 24,
  '2xs': 20,
};

/**
 * Sized like Button: the size's padding around a 20px icon slot (Button's 20px
 * text line). Every size is an exact square, and a smaller glyph (16px) keeps
 * the same box, centred.
 */
export const Sizes: Story = {
  args: { label: 'Close', children: null },
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {[20, 16].map((glyph) => (
        <div key={glyph} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {iconButtonSizes.map((size) => (
            <IconButton key={size} label={`${size} ${glyph}`} size={size} variant="outline">
              <Icon size={glyph}>close</Icon>
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const glyph of [20, 16]) {
      for (const size of iconButtonSizes) {
        const button = canvas.getByRole('button', { name: `${size} ${glyph}` });
        const r = button.getBoundingClientRect();
        await expect([r.width, r.height]).toEqual([BOX[size], BOX[size]]);
        // Glyph centred: equal space on every side.
        const i = button.querySelector('.sikat-icon')!.getBoundingClientRect();
        await expect(i.top - r.top).toBe(r.bottom - i.bottom);
        await expect(i.left - r.left).toBe(r.right - i.right);
      }
    }
  },
};
