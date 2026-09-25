import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Combobox, type ComboboxOption } from './Combobox';
import { FormField } from '../Field/Field';

const OPTIONS: ComboboxOption[] = [
  { value: 'ph', label: 'Philippines' },
  { value: 'sg', label: 'Singapore' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'au', label: 'Australia', disabled: true },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    options: OPTIONS,
    placeholder: 'Search a country…',
    size: 'md',
    onValueChange: fn(),
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 280 }}>
      <Combobox aria-label="Country" {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Focus opens the full list.
    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByRole('option')).toHaveLength(OPTIONS.length);

    // Typing (including a space) filters.
    await userEvent.type(input, 'united k');
    await expect(input).toHaveValue('united k');
    await expect(canvas.getAllByRole('option')).toHaveLength(1);

    // Enter commits the active option and closes.
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('gb');
    await expect(input).toHaveValue('United Kingdom');
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    // Reopening highlights the selection; ArrowDown skips the disabled option and wraps.
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: 'United Kingdom' }).id,
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: 'Philippines' }).id,
    );

    // Disabled options can't be picked; Escape closes without committing.
    await userEvent.click(canvas.getByRole('option', { name: 'Australia' }));
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue('United Kingdom');
  },
};

export const InFormField: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ width: 280 }}>
        <FormField label="Country" hint="Type to filter.">
          {(props) => (
            <Combobox {...props} options={OPTIONS} value={value} onValueChange={setValue} />
          )}
        </FormField>
      </div>
    );
  },
};
