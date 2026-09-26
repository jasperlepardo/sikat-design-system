import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { FormField, TextField, Textarea, Select, Checkbox, Radio, fieldSizes } from './Field';
import { MultiSelect } from './MultiSelect';
import { Combobox } from './Combobox';
import { Autocomplete } from './Autocomplete';
import { DatePicker } from './DatePicker';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
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
const adorn = (a: FigmaAdornmentArgs) => ({
  leadingIcon: a.showLeadingIcon ? CircleIcon : undefined,
  prefix: a.showPrefix ? a.prefixText : undefined,
  suffix: a.showSuffix ? a.suffixText : undefined,
  trailingIcon: a.showTrailingIcon ? CircleIcon : undefined,
});

const meta = {
  title: 'Components/Field',
  component: TextField,
  tags: ['autodocs'],
  args: { placeholder: 'Enter text…', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: fieldSizes },
    invalid: { control: 'boolean' },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls mirror the Figma Field component properties 1:1 — same names, options
 * and order (args keyed by the Figma property names).
 */
type FieldPlaygroundArgs = {
  showHelper: boolean;
  showLabel: boolean;
  helper: string;
  Type: 'text-field' | 'textarea' | 'select' | 'multi-select';
  showDropdown: boolean;
  State: 'default' | 'hover' | 'error' | 'disabled' | 'read-only';
  hasContent: boolean;
  Orientation: 'vertical' | 'horizontal';
};

export const Playground: StoryObj<FieldPlaygroundArgs> = {
  args: {
    showHelper: true,
    showLabel: true,
    helper: 'Helper',
    Type: 'text-field',
    showDropdown: false,
    State: 'default',
    hasContent: false,
    Orientation: 'horizontal',
  },
  argTypes: {
    showHelper: { name: 'Show Helper', control: 'boolean' },
    showLabel: { name: 'Show Label', control: 'boolean' },
    helper: { name: 'Helper', control: 'text' },
    Type: figmaSelect('Type', ['text-field', 'textarea', 'select', 'multi-select'] as const, [
      'Text Field',
      'Textarea',
      'Select',
      'Multi Select',
    ]),
    showDropdown: { name: 'Show Dropdown', control: 'boolean' },
    State: figmaSelect('State', ['default', 'hover', 'error', 'disabled', 'read-only'] as const, [
      'Default',
      'Hover',
      'Error',
      'Disabled',
      'Read-only',
    ]),
    hasContent: figmaSelect('has Content', [false, true], ['False', 'True']),
    Orientation: figmaSelect('Orientation', ['vertical', 'horizontal'] as const, [
      'Vertical',
      'Horizontal',
    ]),
  },
  parameters: figmaControls([
    'Show Helper',
    'Show Label',
    'Helper',
    'Type',
    'Show Dropdown',
    'State',
    'has Content',
    'Orientation',
  ]),
  render: ({
    showHelper,
    showLabel,
    helper,
    Type: type,
    showDropdown,
    State: state,
    hasContent,
    Orientation: orientation,
  }) => {
    const content = hasContent ? 'Content' : undefined;
    const common = {
      disabled: state === 'disabled',
      readOnly: state === 'read-only',
      'data-state': state === 'hover' ? 'hover' : undefined,
    };
    return (
      <div style={{ width: 664 }}>
        <FormField
          orientation={orientation}
          label={showLabel ? 'Label' : undefined}
          hint={showHelper && state !== 'error' ? helper : undefined}
          error={showHelper && state === 'error' ? helper : undefined}
        >
          {(props) => (
            <>
              {type === 'text-field' ? (
                <TextField
                  key={String(hasContent)}
                  placeholder="Placeholder"
                  defaultValue={content}
                  {...common}
                  {...props}
                />
              ) : type === 'textarea' ? (
                <Textarea
                  key={String(hasContent)}
                  placeholder="Placeholder"
                  defaultValue={content}
                  {...common}
                  {...props}
                />
              ) : type === 'select' ? (
                <Select
                  key={String(hasContent)}
                  defaultValue={content ?? ''}
                  {...common}
                  {...props}
                >
                  <option value="" disabled>
                    Placeholder
                  </option>
                  <option value="Content">Content</option>
                </Select>
              ) : (
                <MultiSelect
                  key={String(hasContent)}
                  id={props.id}
                  placeholder="Placeholder"
                  options={[{ value: 'Content', label: 'Content' }]}
                  defaultValue={content ? [content] : []}
                  disabled={state === 'disabled'}
                  invalid={props.invalid}
                />
              )}
              {showDropdown ? (
                <Dropdown>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem>Option 3</DropdownItem>
                </Dropdown>
              ) : null}
            </>
          )}
        </FormField>
      </div>
    );
  },
};

/** Controls mirror the Figma Text Field component properties 1:1. */
export const TextFieldPlayground: StoryObj<FigmaAdornmentArgs & { Type: 'text' }> = {
  name: 'Text Field',
  args: { ...figmaAdornmentDefaults, Type: 'text' },
  argTypes: { ...figmaAdornmentArgTypes, Type: figmaSelect('Type', ['text'] as const, ['Text']) },
  parameters: figmaControls([...figmaAdornmentNames, 'Type']),
  render: (a) => (
    <div style={{ width: 480 }}>
      <TextField aria-label="Text Field" placeholder={a.content} {...adorn(a)} />
    </div>
  ),
};

/** Controls mirror the Figma Select component properties 1:1. */
export const SelectPlayground: StoryObj<FigmaAdornmentArgs & { Type: 'select' }> = {
  name: 'Select',
  args: { ...figmaAdornmentDefaults, Type: 'select' },
  argTypes: {
    ...figmaAdornmentArgTypes,
    Type: figmaSelect('Type', ['select'] as const, ['Select']),
  },
  parameters: figmaControls([...figmaAdornmentNames, 'Type']),
  render: (a) => (
    <div style={{ width: 480 }}>
      <Select aria-label="Select" name="choice" defaultValue="" {...adorn(a)}>
        <option value="" disabled>
          {a.content}
        </option>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
        <option value="c">Banana</option>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Select' });
    const hidden = canvasElement.querySelector<HTMLInputElement>('input[name=choice]')!;
    await expect(trigger).toHaveTextContent('Placeholder');
    await expect(hidden.value).toBe('');

    // Opens the Figma Dropdown; arrows + Enter choose and close, focus returns.
    await userEvent.click(trigger);
    await expect(canvas.getByRole('listbox')).toHaveClass('sikat-dropdown');
    await expect(canvas.getAllByRole('option')).toHaveLength(3);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent('Option B');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
    await expect(hidden.value).toBe('b');

    // Type-ahead on the closed trigger opens on the match; click an option.
    await userEvent.keyboard('b');
    await expect(canvas.getByRole('option', { name: 'Banana' })).toHaveAttribute(
      'data-active',
      'true',
    );
    await userEvent.click(canvas.getByRole('option', { name: 'Option A' }));
    await expect(trigger).toHaveTextContent('Option A');

    // Reopening marks the selection; Escape closes without changing it.
    await userEvent.click(trigger);
    await expect(canvas.getByRole('option', { name: 'Option A' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent('Option A');
  },
};

/** Controls mirror the Figma Textarea component properties 1:1. */
export const TextareaPlayground: StoryObj<{ content: string; Type: 'text' }> = {
  name: 'Textarea',
  args: { content: 'Placeholder', Type: 'text' },
  argTypes: {
    content: { name: 'Content', control: 'text' },
    Type: figmaSelect('Type', ['text'] as const, ['Text']),
  },
  parameters: figmaControls(['Content', 'Type']),
  render: (a) => (
    <div style={{ width: 480 }}>
      <Textarea aria-label="Textarea" placeholder={a.content} />
    </div>
  ),
};

/** Typing interaction (kept out of Playground so its Figma State preview isn't focused). */
export const TypingInteraction: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Label" hint="Helper">
        {(props) => <TextField placeholder="Placeholder" {...props} />}
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'hello');
    await expect(input).toHaveValue('hello');
    // "has Content" is tracked on the field box (the shell around the input).
    await expect(input.closest('.sikat-field')).toHaveAttribute('data-filled');
  },
};

export const WithLabelAndHint: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Email" hint="We'll never share it." required>
        {(props) => <TextField type="email" placeholder="you@example.com" {...props} />}
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Username" error="That username is taken.">
        {(props) => <TextField defaultValue="jasper" {...props} />}
      </FormField>
    </div>
  ),
};

/**
 * Mirrors the Figma Field frame: States × has Content, per Orientation. Hover
 * states are live — hover a field to see them (empty: primary border; with
 * content: tertiary fill + edit icon).
 */
export const Matrix: Story = {
  render: () => {
    const states = [
      { name: 'Default', props: {} },
      { name: 'Default · content', props: { defaultValue: 'Placeholder' } },
      { name: 'Error', props: { defaultValue: 'Placeholder' }, error: 'Helper' },
      { name: 'Disabled', props: { defaultValue: 'Placeholder', disabled: true } },
      { name: 'Read-only', props: { defaultValue: 'Placeholder', readOnly: true } },
    ];
    return (
      <div className="flex flex-col gap-10">
        {(['horizontal', 'vertical'] as const).map((orientation) => (
          <div
            key={orientation}
            className="grid gap-10"
            style={{ gridTemplateColumns: 'repeat(5, 320px)' }}
          >
            {states.map((s) => (
              <FormField
                key={s.name}
                orientation={orientation}
                label="Label"
                hint={s.error ? undefined : 'Helper'}
                error={s.error}
              >
                {(props) => <TextField placeholder="Placeholder" {...s.props} {...props} />}
              </FormField>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const Controls: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ maxWidth: 360 }}>
      <FormField label="Country">
        {(props) => (
          <Select {...props} defaultValue="ph">
            <option value="ph">Philippines</option>
            <option value="sg">Singapore</option>
            <option value="jp">Japan</option>
          </Select>
        )}
      </FormField>
      <FormField label="Notes" hint="Optional.">
        {(props) => <Textarea placeholder="Add a note…" {...props} />}
      </FormField>
      <fieldset className="flex flex-col gap-2">
        <Checkbox defaultChecked>Email me updates</Checkbox>
        <Checkbox>Subscribe to newsletter</Checkbox>
        <Checkbox disabled>Unavailable option</Checkbox>
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <Radio name="plan" defaultChecked>
          Starter
        </Radio>
        <Radio name="plan">Pro</Radio>
        <Radio name="plan" disabled>
          Enterprise (soon)
        </Radio>
      </fieldset>
    </div>
  ),
};

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Mango'];
const COUNTRIES = [
  { value: 'ph', label: 'Philippines' },
  { value: 'sg', label: 'Singapore' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
];

/** Combobox — searchable single-select, constrained to options. */
export const ComboboxField: Story = {
  name: 'Combobox',
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Country">
        {(props) => (
          <Combobox {...props} options={COUNTRIES} placeholder="Search country…" />
        )}
      </FormField>
    </div>
  ),
};

/** Autocomplete — free-text with suggestions. */
export const AutocompleteField: Story = {
  name: 'Autocomplete',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 360 }}>
        <FormField label="Fruit" hint="Free text — suggestions assist.">
          {(props) => (
            <Autocomplete
              {...props}
              suggestions={FRUITS}
              value={value}
              onValueChange={setValue}
              placeholder="Type a fruit…"
            />
          )}
        </FormField>
      </div>
    );
  },
};

/** MultiSelect — searchable multi-value. */
export const MultiSelectField: Story = {
  name: 'Multi Select',
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Countries">
        {(props) => (
          <MultiSelect
            {...props}
            options={COUNTRIES}
            placeholder="Select countries…"
          />
        )}
      </FormField>
    </div>
  ),
};

/** DatePicker — calendar date input. */
export const DatePickerField: Story = {
  name: 'Date Picker',
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Date" hint="Select a date from the calendar.">
        {(props) => <DatePicker {...props} />}
      </FormField>
    </div>
  ),
};
