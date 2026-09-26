import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { MultiSelect, type MultiSelectOption } from './MultiSelect';
import { FormField } from '../Field/Field';
import {
  figmaAdornmentArgTypes,
  figmaAdornmentDefaults,
  figmaAdornmentNames,
  figmaControls,
  figmaSelect,
  type FigmaAdornmentArgs,
} from '../../docs/figma-controls';
import { Icon } from '../Icon/Icon';

const CircleIcon = <Icon size={20}>radio_button_unchecked</Icon>;

const OPTIONS: MultiSelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'solid', label: 'Solid' },
  { value: 'qwik', label: 'Qwik', disabled: true },
];

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  args: { options: OPTIONS, placeholder: 'Pick frameworks…' },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls mirror the Figma Multi Select component properties 1:1 — same names,
 * options and order (args keyed by the Figma property names).
 */
type MultiSelectPlaygroundArgs = FigmaAdornmentArgs & {
  State: 'default';
  hasContent: boolean;
};

export const Playground: StoryObj<MultiSelectPlaygroundArgs> = {
  args: { ...figmaAdornmentDefaults, State: 'default', hasContent: false },
  argTypes: {
    ...figmaAdornmentArgTypes,
    State: figmaSelect('State', ['default'] as const, ['Default']),
    hasContent: figmaSelect('Has Content', [false, true], ['False', 'True']),
  },
  parameters: figmaControls([...figmaAdornmentNames, 'State', 'Has Content']),
  render: (a) => (
    <div style={{ width: 480 }}>
      <MultiSelect
        key={String(a.hasContent)}
        aria-label="Multi Select"
        options={OPTIONS}
        placeholder={a.content}
        defaultValue={a.hasContent ? ['react', 'vue'] : []}
        leadingIcon={a.showLeadingIcon ? CircleIcon : undefined}
        prefix={a.showPrefix ? a.prefixText : undefined}
        suffix={a.showSuffix ? a.suffixText : undefined}
        trailingIcon={a.showTrailingIcon ? CircleIcon : undefined}
      />
    </div>
  ),
};

export const InFormField: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['react']);
    return (
      <div style={{ width: 320 }}>
        <FormField label="Frameworks" hint="Type to filter; Backspace removes the last chip.">
          {(props) => (
            <MultiSelect {...props} options={OPTIONS} value={value} onValueChange={setValue} />
          )}
        </FormField>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Frameworks');
    const chips = () =>
      canvas
        .queryAllByRole('button', { name: /^Remove / })
        .map((b) => b.getAttribute('aria-label'));
    await expect(chips()).toEqual(['Remove React']);

    // Filter + Enter toggles an option on; the menu stays open and the query clears.
    await userEvent.click(input);
    await userEvent.type(input, 'sv');
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    await expect(chips()).toEqual(['Remove React', 'Remove Svelte']);
    await expect(input).toHaveValue('');
    await expect(input).toHaveAttribute('aria-expanded', 'true');

    // Clicking toggles; disabled options are ignored.
    await userEvent.click(canvas.getByRole('option', { name: 'Vue' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Qwik' }));
    await expect(chips()).toEqual(['Remove React', 'Remove Svelte', 'Remove Vue']);
    await expect(canvas.getByRole('option', { name: 'Vue' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Backspace on an empty query removes the last chip; the chip button removes its value.
    await userEvent.keyboard('{Backspace}');
    await expect(chips()).toEqual(['Remove React', 'Remove Svelte']);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove React' }));
    await expect(chips()).toEqual(['Remove Svelte']);

    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};
