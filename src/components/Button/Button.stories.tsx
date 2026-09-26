import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Button,
  buttonIntents,
  buttonStyles,
  buttonSizes,
  type ButtonIntent,
  type ButtonStyle,
  type ButtonSize,
} from './Button';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import { Icon } from '../Icon/Icon';

const ArrowRight = <Icon size={20}>arrow_forward</Icon>;

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', intent: 'primary', variant: 'solid', size: 'medium', onClick: fn() },
  argTypes: {
    intent: { control: 'inline-radio', options: buttonIntents },
    variant: { control: 'inline-radio', options: buttonStyles },
    size: { control: 'inline-radio', options: buttonSizes },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderIcon = <Icon size={20}>radio_button_unchecked</Icon>;

/**
 * Controls mirror the Figma Button component properties 1:1 — same names, same
 * options, same order (args are keyed by the Figma property names).
 */
type ButtonPlaygroundArgs = {
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
  buttonLabel: string;
  Type: ButtonIntent;
  Style: ButtonStyle;
  Size: ButtonSize;
  State: 'default' | 'hover' | 'disabled';
  onClick: () => void;
};

export const Playground: StoryObj<ButtonPlaygroundArgs> = {
  args: {
    showLeadingIcon: true,
    showTrailingIcon: true,
    buttonLabel: 'Button',
    Type: 'primary',
    Style: 'solid',
    Size: 'medium',
    State: 'default',
    onClick: fn(),
  },
  argTypes: {
    showLeadingIcon: { name: 'Show Leading Icon', control: 'boolean' },
    showTrailingIcon: { name: 'Show Trailing Icon', control: 'boolean' },
    buttonLabel: { name: 'Button Label', control: 'text' },
    Type: figmaSelect('Type', buttonIntents, [
      'Default',
      'Primary',
      'Success',
      'Warning',
      'Danger',
      'White',
      'Black',
    ]),
    Style: figmaSelect('Style', buttonStyles, ['Solid', 'Outline', 'Ghost', 'Link']),
    Size: figmaSelect('Size', buttonSizes, [
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
  parameters: figmaControls([
    'Show Leading Icon',
    'Show Trailing Icon',
    'Button Label',
    'Type',
    'Style',
    'Size',
    'State',
  ]),
  render: ({
    showLeadingIcon,
    showTrailingIcon,
    buttonLabel,
    Type,
    Style,
    Size,
    State,
    onClick,
  }) => (
    <Button
      intent={Type}
      variant={Style}
      size={Size}
      {...{ 'data-state': State === 'hover' ? 'hover' : undefined }}
      disabled={State === 'disabled'}
      leadingIcon={showLeadingIcon ? PlaceholderIcon : undefined}
      trailingIcon={showTrailingIcon ? PlaceholderIcon : undefined}
      onClick={onClick}
    >
      {buttonLabel}
    </Button>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /button/i });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const WithIcon: Story = {
  args: { children: 'Continue', trailingIcon: ArrowRight },
};

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {buttonIntents.map((intent) => (
        <div key={intent} className="flex flex-wrap items-center gap-3">
          {buttonStyles.map((variant) => (
            <Button key={variant} intent={intent} variant={variant}>
              {intent}/{variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Figma's six sizes (40/36/32/28/24/20px), with leading + trailing icons as in Figma. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {buttonSizes.map((size) => (
        <Button key={size} size={size} leadingIcon={PlaceholderIcon} trailingIcon={PlaceholderIcon}>
          Button
        </Button>
      ))}
    </div>
  ),
};
