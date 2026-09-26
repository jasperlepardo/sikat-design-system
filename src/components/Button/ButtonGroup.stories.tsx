import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup, buttonGroupOrientations, buttonGroupAligns } from './ButtonGroup';
import { Button } from './Button';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

const meta = {
  title: 'Components/Button/Button Group',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', align: 'end', fill: false },
  argTypes: {
    orientation: { control: 'inline-radio', options: buttonGroupOrientations },
    align: { control: 'inline-radio', options: buttonGroupAligns },
    fill: { control: 'boolean' },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

/**
 * Controls mirror the Figma Button Group component properties 1:1 — same names,
 * options and order (args keyed by the Figma property names).
 */
type ButtonGroupPlaygroundArgs = {
  Type: 'Single' | '2 Button' | '3 Button';
  isStacked: 'False' | 'True';
};

export const Playground: StoryObj<ButtonGroupPlaygroundArgs> = {
  args: { Type: '2 Button', isStacked: 'False' },
  argTypes: {
    Type: figmaSelect('Type', ['Single', '2 Button', '3 Button'] as const, [
      'Single',
      '2 Button',
      '3 Button',
    ]),
    isStacked: figmaSelect('is Stacked', ['False', 'True'] as const, ['False', 'True']),
  },
  parameters: figmaControls(['Type', 'is Stacked']),
  render: ({ Type, isStacked }) => (
    <ButtonGroup orientation={isStacked === 'True' ? 'stacked' : 'horizontal'} className="w-96">
      {Type === 'Single' ? (
        <Button intent="primary">Confirm</Button>
      ) : Type === '2 Button' ? (
        <>
          <Button intent="default" variant="ghost">Cancel</Button>
          <Button intent="primary">Confirm</Button>
        </>
      ) : (
        <>
          <Button intent="default" variant="ghost">Cancel</Button>
          <Button intent="default" variant="outline">Save Draft</Button>
          <Button intent="primary">Confirm</Button>
        </>
      )}
    </ButtonGroup>
  ),
};
