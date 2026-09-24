import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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

const CircleIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

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
};
