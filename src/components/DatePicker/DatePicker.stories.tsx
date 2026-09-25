import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { FormField } from '../Field/Field';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { placeholder: 'Select a date', size: 'md', onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 280 }}>
      <DatePicker {...args} />
    </div>
  ),
};

/** Keyboard + pointer selection from a fixed starting date. */
export const Interaction: Story = {
  args: { defaultValue: '2026-05-15', 'aria-label': 'Date' },
  render: (args) => (
    <div style={{ width: 280, minHeight: 380 }}>
      <DatePicker {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    const focusedIso = () => (document.activeElement as HTMLElement | null)?.dataset.iso;
    const cell = (iso: string) =>
      canvasElement.querySelector<HTMLElement>(`[data-iso="${iso}"]`) as HTMLElement;

    await expect(input).toHaveValue('15 May 2026');

    // Opening focuses the selected day.
    await userEvent.click(input);
    const dialog = canvas.getByRole('dialog', { name: 'Choose date' });
    await expect(dialog).toHaveTextContent('May 2026');
    await expect(focusedIso()).toBe('2026-05-15');

    // Arrows move by day/week, PageDown by month; Enter selects and returns focus.
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    await expect(focusedIso()).toBe('2026-05-23');
    await userEvent.keyboard('{PageDown}');
    await expect(focusedIso()).toBe('2026-06-23');
    await expect(canvas.getByRole('dialog')).toHaveTextContent('June 2026');
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('2026-06-23');
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await expect(input).toHaveValue('23 June 2026');
    await expect(input).toHaveFocus();

    // Month buttons change the view; clicking a day selects it.
    await userEvent.click(input);
    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await expect(canvas.getByRole('dialog')).toHaveTextContent('July 2026');
    await userEvent.click(cell('2026-07-04'));
    await expect(input).toHaveValue('4 July 2026');

    // Escape closes without changing the value.
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowLeft}{Escape}');
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await expect(input).toHaveValue('4 July 2026');
    await expect(args.onValueChange).toHaveBeenCalledTimes(2);
  },
};

export const InFormField: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 280 }}>
        <FormField label="Birth date" hint="Arrow keys navigate; Enter selects.">
          {(props) => <DatePicker {...props} value={value} onValueChange={setValue} />}
        </FormField>
      </div>
    );
  },
};
