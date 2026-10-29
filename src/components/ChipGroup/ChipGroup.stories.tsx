import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ChipGroup } from './ChipGroup';
import { Chip } from '../Chip/Chip';

const meta = {
  title: 'Components/ChipGroup',
  component: ChipGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Category is' },
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Label + a single removable value chip. */
export const Default: Story = {
  render: (args) => (
    <ChipGroup {...args}>
      <Chip onRemove={fn()}>Laptops</Chip>
    </ChipGroup>
  ),
};

/** The filter-bar pattern from the design: several labeled tokens in a row. */
export const FilterBar: Story = {
  render: () => {
    const [hasCategory, setHasCategory] = useState(true);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        {hasCategory && (
          <ChipGroup label="Category is">
            <Chip onRemove={() => setHasCategory(false)}>Laptops</Chip>
          </ChipGroup>
        )}
        <ChipGroup label="Sales channel is">
          <Chip intent="primary">Online Store, Point of Sale</Chip>
        </ChipGroup>
      </div>
    );
  },
};

/** Grouping two or more chips under one label. */
export const MultipleChips: Story = {
  render: () => (
    <ChipGroup label="Sizes">
      <Chip onRemove={fn()}>Small</Chip>
      <Chip onRemove={fn()}>Medium</Chip>
      <Chip onRemove={fn()}>Large</Chip>
    </ChipGroup>
  ),
};

/** Selectable chips grouped as a choice set. */
export const SelectableGroup: Story = {
  render: () => {
    const [value, setValue] = useState('Online Store');
    const options = ['Online Store', 'Point of Sale', 'Buy Button'];
    return (
      <ChipGroup label="Sales channel is">
        {options.map((o) => (
          <Chip key={o} intent="primary" selected={value === o} onSelect={() => setValue(o)}>
            {o}
          </Chip>
        ))}
      </ChipGroup>
    );
  },
};
