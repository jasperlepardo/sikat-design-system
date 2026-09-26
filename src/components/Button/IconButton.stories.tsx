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
