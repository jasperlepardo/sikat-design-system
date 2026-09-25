import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Autocomplete } from './Autocomplete';
import { FormField } from '../Field/Field';

const FRUITS = [
  'Apple',
  'Apricot',
  'Banana',
  'Blackberry',
  'Blueberry',
  'Cherry',
  'Cranberry',
  'Date',
  'Grape',
  'Mango',
];

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  args: {
    suggestions: FRUITS,
    placeholder: 'Type a fruit…',
    size: 'md',
    onValueChange: fn(),
    onSelect: fn(),
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 280 }}>
      <Autocomplete aria-label="Fruit" {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Typing filters suggestions; free text is kept as the value.
    await userEvent.type(input, 'berry');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('berry');
    await expect(canvas.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Blackberry',
      'Blueberry',
      'Cranberry',
    ]);

    // Arrow + Enter fills the field with the suggestion.
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onSelect).toHaveBeenLastCalledWith('Blueberry');
    await expect(input).toHaveValue('Blueberry');
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    // Clicking a suggestion fills the field too.
    await userEvent.clear(input);
    await userEvent.type(input, 'man');
    await userEvent.click(canvas.getByRole('option', { name: 'Mango' }));
    await expect(input).toHaveValue('Mango');

    // No matches → no listbox.
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    await expect(canvas.queryByRole('listbox')).toBeNull();
  },
};

export const InFormField: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 280 }}>
        <FormField label="Favorite fruit" hint="Free text — suggestions assist.">
          {(props) => (
            <Autocomplete {...props} suggestions={FRUITS} value={value} onValueChange={setValue} />
          )}
        </FormField>
      </div>
    );
  },
};
