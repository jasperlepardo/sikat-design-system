import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Chip, chipIntents, chipStyles, chipSizes } from './Chip';
import { Icon } from '../Icon/Icon';

const CheckGlyph = <Icon size={16}>check</Icon>;

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    intent: { control: 'select', options: chipIntents },
    variant: { control: 'select', options: chipStyles },
    size: { control: 'select', options: chipSizes },
    shape: { control: 'inline-radio', options: ['pill', 'rounded'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    intent: 'default',
    variant: 'outline',
    size: 'medium',
    shape: 'pill',
    children: 'Chip',
    onSelect: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Filter chip — click to toggle `selected` (aria-pressed). */
export const Filter: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return (
      <Chip
        {...args}
        selected={on}
        onSelect={() => setOn((v) => !v)}
        leadingIcon={on ? CheckGlyph : undefined}
      >
        In stock
      </Chip>
    );
  },
};

/** Input chip — removable token (e.g. a selected recipient or tag). */
export const Input: Story = {
  args: { onSelect: undefined, onRemove: fn(), children: 'agatha@sikat.com' },
};

/** Selectable AND removable in one chip. */
export const SelectableRemovable: Story = {
  render: (args) => {
    const [on, setOn] = useState(true);
    return (
      <Chip
        {...args}
        intent="primary"
        selected={on}
        onSelect={() => setOn((v) => !v)}
        onRemove={fn()}
      >
        Marketing
      </Chip>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, selected: true, onRemove: fn() },
};

/** Choice group — single-select rendered as pills. */
export const ChoiceGroup: Story = {
  render: () => {
    const options = ['Low', 'Medium', 'High'];
    const [value, setValue] = useState('Medium');
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {options.map((o) => (
          <Chip key={o} intent="primary" selected={value === o} onSelect={() => setValue(o)}>
            {o}
          </Chip>
        ))}
      </div>
    );
  },
};

/** Pill (default) vs rounded corners (button radius). */
export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip shape="pill" intent="primary" onRemove={fn()}>
        Pill
      </Chip>
      <Chip shape="rounded" intent="primary" onRemove={fn()}>
        Rounded
      </Chip>
    </div>
  ),
};

/** Every style (mirrors Badge) across a few intents. */
export const Styles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {chipStyles.map((variant) => (
        <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 72, fontSize: 12, color: 'var(--color-text-caption)' }}>
            {variant}
          </span>
          {(['default', 'primary', 'success', 'danger'] as const).map((intent) => (
            <Chip key={intent} intent={intent} variant={variant} onSelect={fn()}>
              {intent}
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Full intent × style matrix (parity with Badge). */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {chipIntents.map((intent) => (
        <div key={intent} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 88, fontSize: 12, color: 'var(--color-text-caption)' }}>
            {intent}
          </span>
          {chipStyles.map((variant) => (
            <Chip key={variant} intent={intent} variant={variant} onSelect={fn()}>
              {variant}
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};
