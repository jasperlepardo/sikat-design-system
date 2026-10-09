import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  FormField,
  ReadOnly,
  TextField,
  Textarea,
  Select,
  Checkbox,
  Radio,
  fieldSizes,
} from './Field';
import { MultiSelect } from './MultiSelect';
import { Combobox } from './Combobox';
import { Button } from '../Button/Button';
import { SidePanel } from '../SidePanel/SidePanel';
import { Panel } from '../Panel/Panel';
import { PanelHeader } from '../Panel/PanelHeader';
import { Card } from '../Card/Card';
import { Form } from '../Form/Form';
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
  showSubLabel: boolean;
  subLabel: string;
  showTooltip: boolean;
  tooltip: string;
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
    showSubLabel: false,
    subLabel: 'Sub Label',
    showTooltip: false,
    tooltip: 'Message',
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
    showSubLabel: { name: 'Show Sub Label', control: 'boolean' },
    subLabel: { name: 'Sub Label', control: 'text', if: { arg: 'showSubLabel' } },
    showTooltip: { name: 'Show Tooltip', control: 'boolean' },
    tooltip: { name: 'Tooltip', control: 'text', if: { arg: 'showTooltip' } },
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
    'Show Sub Label',
    'Sub Label',
    'Show Tooltip',
    'Tooltip',
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
    showSubLabel,
    subLabel,
    showTooltip,
    tooltip,
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
          subLabel={showSubLabel ? subLabel : undefined}
          tooltip={showTooltip ? tooltip : undefined}
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
export const SelectPlayground: StoryObj<
  FigmaAdornmentArgs & { Type: 'select'; clearable: boolean }
> = {
  name: 'Select',
  args: { ...figmaAdornmentDefaults, Type: 'select', clearable: false },
  argTypes: {
    ...figmaAdornmentArgTypes,
    Type: figmaSelect('Type', ['select'] as const, ['Select']),
    clearable: { name: 'Clearable', control: 'boolean' },
  },
  parameters: figmaControls([...figmaAdornmentNames, 'Type', 'Clearable']),
  render: ({ clearable, ...a }) => (
    <div style={{ width: 480 }}>
      <Select aria-label="Select" name="choice" defaultValue="" clearable={clearable} {...adorn(a)}>
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
    const body = within(document.body);
    await userEvent.click(trigger);
    await expect(body.getByRole('listbox')).toHaveClass('sikat-dropdown');
    await expect(body.getAllByRole('option')).toHaveLength(3);
    // Cover: the first option's box sits exactly on the field's box.
    const field = canvasElement.querySelector('.sikat-select')!.getBoundingClientRect();
    const first = body.getAllByRole('option')[0].getBoundingClientRect();
    await expect(Math.abs(first.top - field.top)).toBeLessThan(1);
    await expect(Math.abs(first.left - field.left)).toBeLessThan(1);
    await expect(Math.abs(first.width - field.width)).toBeLessThan(1);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent('Option B');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
    await expect(hidden.value).toBe('b');

    // Type-ahead on the closed trigger opens on the match; click an option.
    await userEvent.keyboard('b');
    await expect(body.getByRole('option', { name: 'Banana' })).toHaveAttribute(
      'data-active',
      'true',
    );
    await userEvent.click(body.getByRole('option', { name: 'Option A' }));
    await expect(trigger).toHaveTextContent('Option A');

    // Reopening marks the selection; Escape closes without changing it.
    await userEvent.click(trigger);
    await expect(body.getByRole('option', { name: 'Option A' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent('Option A');
  },
};

/**
 * Searchable Select (autocomplete) — the open panel starts with a search field
 * sitting exactly over the closed field; typing filters the options.
 */
export const SearchableSelect: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Select
        aria-label="Fruit"
        searchable
        placeholder="Pick a fruit"
        options={[
          { value: 'apple', label: 'Apple' },
          { value: 'apricot', label: 'Apricot' },
          { value: 'banana', label: 'Banana' },
          { value: 'cherry', label: 'Cherry', disabled: true },
          { value: 'grape', label: 'Grape' },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' });

    // Opening focuses the search field, which sits exactly on the field.
    await userEvent.click(trigger);
    const search = body.getByRole('combobox', { name: 'Search' });
    await expect(search).toHaveFocus();
    const field = canvasElement.querySelector('.sikat-select')!.getBoundingClientRect();
    const box = search.closest('.sikat-field')!.getBoundingClientRect();
    await expect(Math.abs(box.top - field.top)).toBeLessThan(1);
    await expect(Math.abs(box.left - field.left)).toBeLessThan(1);
    await expect(Math.abs(box.width - field.width)).toBeLessThan(1);

    // Typing filters; Enter picks the first match and focus returns.
    await userEvent.keyboard('ap');
    await expect(body.getAllByRole('option')).toHaveLength(3); // Apple, Apricot, Grape
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent('Apricot');
    await expect(trigger).toHaveFocus();

    // Typing on the closed field opens it with that text; no match → empty state.
    await userEvent.keyboard('x');
    await expect(body.getByRole('combobox', { name: 'Search' })).toHaveValue('x');
    await expect(body.getByText('No results')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveTextContent('Apricot');
  },
};

/**
 * Textarea auto-grow: one line at rest — the same height as a regular field —
 * then the height follows the content. `maxRows` caps it, after which it scrolls. A controlled `value` is
 * fitted on mount and whenever it changes.
 */
export const TextareaAutoGrow: Story = {
  render: () => {
    const [notes, setNotes] = useState('Line 1\nLine 2\nLine 3\nLine 4');
    return (
      <div style={{ display: 'grid', gap: 16, width: 480 }}>
        <TextField aria-label="Regular field" placeholder="Regular field" />
        <Textarea aria-label="Grows" placeholder="Type a few lines…" />
        <Textarea aria-label="Max 3 rows" maxRows={3} placeholder="Caps at 3 lines…" />
        <Textarea
          aria-label="Controlled"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="button" onClick={() => setNotes('')}>
          Clear controlled
        </button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const height = (el: HTMLElement) => Math.round(el.getBoundingClientRect().height);
    const lh = (el: HTMLElement) => parseFloat(getComputedStyle(el).lineHeight);

    // At rest: one line, the same height as a regular field.
    const grows = canvas.getByRole('textbox', { name: 'Grows' });
    const rest = height(grows);
    await expect(rest).toBe(height(canvas.getByRole('textbox', { name: 'Regular field' })));

    // Uncontrolled: +1 line of height per new line typed.
    await userEvent.type(grows, 'one{Enter}two{Enter}three');
    await expect(height(grows)).toBe(rest + 2 * lh(grows));
    await userEvent.clear(grows);
    await expect(height(grows)).toBe(rest);

    // maxRows: stops at 3 lines, then scrolls.
    const capped = canvas.getByRole('textbox', { name: 'Max 3 rows' });
    await userEvent.type(capped, '1{Enter}2{Enter}3{Enter}4{Enter}5');
    await expect(height(capped)).toBe(rest + 2 * lh(capped));
    await expect(getComputedStyle(capped).overflowY).toBe('auto');

    // Controlled: fitted to the initial 4 lines; shrinks when value is cleared.
    const controlled = canvas.getByRole('textbox', { name: 'Controlled' });
    await expect(height(controlled)).toBe(rest + 3 * lh(controlled));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear controlled' }));
    await expect(height(controlled)).toBe(rest);
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

/**
 * Label-beside fields (`orientation="vertical"`) respond to the width of their
 * container, not the viewport: below 28.5rem the label moves above the control,
 * matching the stacked (`horizontal`) layout exactly.
 */
export const ResponsiveOrientation: Story = {
  render: () => {
    const fields = (prefix: string) => (
      <>
        <FormField orientation="responsive" label={`${prefix} name`}>
          {(props) => <TextField placeholder="Placeholder" {...props} />}
        </FormField>
        <FormField
          orientation="responsive"
          label={`${prefix} email`}
          subLabel="(optional)"
          tooltip="We'll only use this for receipts."
        >
          {(props) => <TextField placeholder="Placeholder" {...props} />}
        </FormField>
      </>
    );
    return (
      <div style={{ display: 'grid', gap: 32 }}>
        <div data-testid="wide" style={{ display: 'grid', gap: 12, width: 560 }}>
          {fields('Wide')}
        </div>
        <div data-testid="narrow" style={{ display: 'grid', gap: 12, width: 320 }}>
          {fields('Narrow')}
        </div>
        <div data-testid="stacked" style={{ width: 320 }}>
          <FormField label="Stacked name">
            {(props) => <TextField placeholder="Placeholder" {...props} />}
          </FormField>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rect = (el: Element) => el.getBoundingClientRect();
    const parts = (name: string) => {
      // Measure the field box (.sikat-field), not the <input> inside its padding.
      const input = canvas.getByRole('textbox', { name: new RegExp(name) });
      const control = input.closest('.sikat-field') ?? input;
      const group = control.closest('.sikat-field-group')!;
      const label = group.querySelector(':scope > .sikat-field__label')!;
      return { control: rect(control), group: rect(group), label: rect(label) };
    };

    // Wide (560px): label in the 200px column beside the control, same row.
    for (const name of ['Wide name', 'Wide email']) {
      const { control, label } = parts(name);
      await expect(Math.round(label.width)).toBe(200);
      await expect(Math.round(control.left - label.right)).toBe(16);
      await expect(Math.round(label.top)).toBe(Math.round(control.top));
    }

    // Narrow (320px): label above, control full width — same as the stacked layout.
    const stacked = parts('Stacked name');
    for (const name of ['Narrow name', 'Narrow email']) {
      const { control, group, label } = parts(name);
      await expect(label.bottom).toBeLessThanOrEqual(control.top);
      await expect(Math.round(control.width)).toBe(Math.round(group.width));
      await expect(Math.round(control.top - label.top)).toBe(
        Math.round(stacked.control.top - stacked.label.top),
      );
    }
  },
};

/**
 * Suffix right after the value (e.g. units): the input is as wide as its text,
 * so "0 cm" reads as one value. Trailing icons and the hover edit icon stay at
 * the right edge; a long value scrolls while the suffix stays visible.
 */
export const SuffixInline: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, width: 640 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
        <FormField label="Length">
          {(props) => <TextField type="number" defaultValue="0" suffix="cm" {...props} />}
        </FormField>
        <FormField label="Width">
          {(props) => <TextField type="number" defaultValue="0" suffix="cm" {...props} />}
        </FormField>
        <FormField label="Volume">
          {(props) => <TextField type="number" defaultValue="0" suffix="cm³" {...props} />}
        </FormField>
        <FormField label="Net weight" tooltip="Weight of one piece, without packaging.">
          {(props) => <TextField type="number" defaultValue="0.1" suffix="kg" {...props} />}
        </FormField>
      </div>
      <div style={{ display: 'grid', gap: 12, width: 320 }}>
        <TextField aria-label="Empty" placeholder="Placeholder" suffix="cm" />
        <TextField
          aria-label="With icon"
          defaultValue="12.5"
          suffix="kg"
          trailingIcon={<Icon size={20}>info</Icon>}
        />
        <TextField
          aria-label="Prefix and suffix"
          defaultValue="1,250.00"
          prefix="PHP"
          suffix="/mo"
        />
        <TextField aria-label="Long" defaultValue={'1234567890'.repeat(6)} suffix="cm" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parts = (name: string) => {
      const input = canvas.getByRole(name === 'Length' ? 'spinbutton' : 'textbox', {
        name,
      }) as HTMLInputElement;
      const field = input.closest<HTMLElement>('.sikat-field')!;
      const suffix = field.querySelector('.sikat-field__value > .sikat-field__affix')!;
      // Distance from the end of the visible text (value or placeholder) to the
      // suffix — measured from the text, not the input box, so a too-wide input fails.
      const gap = () => {
        const ctx = document.createElement('canvas').getContext('2d')!;
        const cs = getComputedStyle(input);
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const textWidth = ctx.measureText(input.value || input.placeholder).width;
        return suffix.getBoundingClientRect().left - input.getBoundingClientRect().left - textWidth;
      };
      return { input, field, suffix, gap };
    };
    // 4px from the end of the text to the suffix (±1px for text rounding).
    const expectNextToValue = async (gap: number) => {
      await expect(gap).toBeGreaterThanOrEqual(3);
      await expect(gap).toBeLessThanOrEqual(5);
    };

    // The suffix sits right after the value — for a number, a placeholder, and as it grows.
    const length = parts('Length');
    await expectNextToValue(length.gap());
    const empty = parts('Empty');
    await expectNextToValue(empty.gap());
    const before = empty.suffix.getBoundingClientRect().left;
    await userEvent.type(empty.input, '12.5 kilograms, rounded up');
    await expectNextToValue(empty.gap());
    await expect(empty.suffix.getBoundingClientRect().left).toBeGreaterThan(before);

    // Prefix sits 4px before the value.
    const priced = parts('Prefix and suffix');
    const prefix = priced.field.querySelector('.sikat-field__affix--prefix')!;
    await expect(
      Math.round(priced.input.getBoundingClientRect().left - prefix.getBoundingClientRect().right),
    ).toBe(4);
    await expectNextToValue(priced.gap());

    // Clicking the empty part of the box focuses the input.
    await userEvent.click(length.field);
    await expect(length.input).toHaveFocus();

    // Trailing icon stays at the right edge (inside the 12px padding).
    const icon = parts('With icon');
    const iconEl = icon.field.querySelector('.sikat-field__icon')!;
    const pad = parseFloat(getComputedStyle(icon.field).paddingRight);
    await expect(Math.round(iconEl.getBoundingClientRect().right)).toBe(
      Math.round(icon.field.getBoundingClientRect().right - pad),
    );

    // A long value never widens its column (the group is 320px).
    for (const name of ['Empty', 'With icon', 'Long']) {
      await expect(Math.round(parts(name).field.getBoundingClientRect().width)).toBe(320);
    }

    // A long value scrolls inside the input; the suffix stays inside the field.
    const long = parts('Long');
    await expect(long.input.scrollWidth).toBeGreaterThan(long.input.clientWidth);
    await expect(long.suffix.getBoundingClientRect().right).toBeLessThanOrEqual(
      long.field.getBoundingClientRect().right -
        parseFloat(getComputedStyle(long.field).paddingRight),
    );
  },
};

/** Figma Form Label with Show Sub Label + Show Tooltip. */
export const WithSubLabel: Story = {
  render: () => (
    <div style={{ maxWidth: 360, paddingTop: 64 }}>
      <FormField
        label="Middle name"
        subLabel="(optional)"
        tooltip="As shown on your government ID."
      >
        {(props) => <TextField placeholder="Placeholder" {...props} />}
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('textbox', { name: 'Middle name(optional)' }),
    ).toBeInTheDocument();
    await expect(canvas.getByText('(optional)')).toBeVisible();

    // Hover the underlined label text to reveal the tooltip bubble.
    await userEvent.hover(canvas.getByText('Middle name'));
    // The tooltip bubble is portaled to <body>.
    await expect(within(canvasElement.ownerDocument.body).getByRole('tooltip')).toHaveTextContent(
      'As shown on your government ID.',
    );
  },
};

/** ReadOnly — static computed value displayed in the disabled field shell. */
export const ReadOnlyField: Story = {
  render: () => (
    <div style={{ maxWidth: 480, display: 'grid', gap: 8 }}>
      <FormField label="Average delay" disabled tooltip="Calculated from payment history.">
        <ReadOnly value="5 days" />
      </FormField>
      <FormField label="Normal balance" disabled tooltip="Determined by the account drawer.">
        <ReadOnly value="Debit" />
      </FormField>
      <FormField label="Inventory account" disabled tooltip="From the item group.">
        <ReadOnly value="1300 Raw Materials Inventory" />
      </FormField>
    </div>
  ),
};

/**
 * `description` on `ReadOnly` — a secondary line below the value (body/xs, muted).
 * The field height expands to fit both lines.
 */
export const ReadOnlyWithDescription: Story = {
  name: 'ReadOnly — with Description',
  render: () => (
    <div style={{ maxWidth: 480, display: 'grid', gap: 8 }}>
      <FormField label="Assigned employee" disabled>
        <ReadOnly value="Juan dela Cruz" subLabel="EMP001" description="Engineering" />
      </FormField>
      <FormField label="Chart of account" disabled>
        <ReadOnly value="Cash and Cash Equivalents" subLabel="1000" description="Assets" />
      </FormField>
      <FormField label="Vendor" disabled>
        <ReadOnly value="Acme Supplies Co." subLabel="VND-0042" description="Active" />
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
        {(props) => <Combobox {...props} options={COUNTRIES} placeholder="Search country…" />}
      </FormField>
    </div>
  ),
};

/**
 * `clearable` — for optional fields, instead of a "None" option. A ✕ shows while a
 * value is set; clicking it resets to the placeholder (Select → `''`, Combobox → `null`).
 */
export const Clearable: Story = {
  render: () => {
    const [account, setAccount] = useState('');
    const [country, setCountry] = useState<string | null>('ph');
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
        <FormField label="Parent account" subLabel="(optional)">
          {(props) => (
            <Select
              {...props}
              clearable
              placeholder="None"
              value={account}
              onValueChange={setAccount}
              options={[
                { value: '1000', label: '1000 · Assets' },
                { value: '2000', label: '2000 · Liabilities' },
              ]}
            />
          )}
        </FormField>
        <FormField label="Country" subLabel="(optional)">
          {(props) => (
            <Combobox
              {...props}
              clearable
              options={COUNTRIES}
              placeholder="Use the default country"
              value={country}
              onValueChange={setCountry}
            />
          )}
        </FormField>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    // ✕ is hidden at rest (CSS :hover can't be simulated) and shown with focus.
    const comboboxShell = canvas
      .getByRole('combobox', { name: /Country/ })
      .closest<HTMLElement>('.sikat-field')!;
    const clearOpacity = () =>
      getComputedStyle(comboboxShell.querySelector('.sikat-field__clear')!).opacity;
    await waitFor(() => expect(clearOpacity()).toBe('0'));
    canvas.getByRole('combobox', { name: /Country/ }).focus();
    await waitFor(() => expect(clearOpacity()).toBe('1'));
    await userEvent.keyboard('{Escape}');

    // Select: no ✕ while empty; pick → ✕ appears; ✕ → back to placeholder, list stays closed.
    const select = canvas.getByRole('combobox', { name: /Parent account/ });
    await expect(select).toHaveTextContent('None');
    await expect(canvas.getAllByRole('button', { name: 'Clear selection' })).toHaveLength(1);
    await userEvent.click(select);
    await userEvent.click(body.getByRole('option', { name: '2000 · Liabilities' }));
    await expect(select).toHaveTextContent('2000 · Liabilities');
    const [clearSelect, clearCombobox] = canvas.getAllByRole('button', { name: 'Clear selection' });
    await userEvent.click(clearSelect);
    await expect(select).toHaveTextContent('None');
    await expect(select).toHaveAttribute('aria-expanded', 'false');
    await expect(select).toHaveFocus();

    // Combobox: starts filled; ✕ clears to the placeholder.
    const combobox = canvas.getByRole('combobox', { name: /Country/ });
    await expect(combobox).toHaveTextContent('Philippines');
    await userEvent.click(clearCombobox);
    await expect(combobox).toHaveTextContent('Use the default country');
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
  },
};

/** Combobox with emptyContent — type a query that matches nothing to see a custom "create" action. */
export const ComboboxEmptyContent: Story = {
  name: 'Combobox (emptyContent)',
  render: () => {
    const [options, setOptions] = useState(COUNTRIES);
    const [value, setValue] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [draftName, setDraftName] = useState('');
    return (
      <div style={{ maxWidth: 360 }}>
        <FormField label="Country">
          {(props) => (
            <Combobox
              {...props}
              options={options}
              value={value}
              onValueChange={setValue}
              onQueryChange={setQuery}
              placeholder="Search or create…"
              emptyContent={(close) => (
                <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column' }}>
                  <Button
                    intent="default"
                    variant="solid"
                    size="small"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      close();
                      setDraftName(query.trim());
                      setModalOpen(true);
                    }}
                  >
                    + Create "{query}"
                  </Button>
                </div>
              )}
            />
          )}
        </FormField>

        {modalOpen && (
          <SidePanel overlay onOverlayClick={() => setModalOpen(false)}>
            <PanelHeader
              title="Create country"
              actions={
                <>
                  <Button
                    intent="default"
                    variant="solid"
                    size="small"
                    onClick={() => setModalOpen(false)}
                  >
                    Discard
                  </Button>
                  <Button
                    intent="primary"
                    variant="solid"
                    size="small"
                    disabled={!draftName.trim()}
                    onClick={() => {
                      const label = draftName.trim();
                      const next = { value: label.toLowerCase().replace(/\s+/g, '-'), label };
                      setOptions((prev) => [...prev, next]);
                      setValue(next.value);
                      setModalOpen(false);
                    }}
                  >
                    Create
                  </Button>
                </>
              }
            />
            <Panel.Body>
              <Card>
                <Card.Content>
                  <Form.Group>
                    <FormField label="Country name">
                      {(props) => (
                        <TextField
                          {...props}
                          autoFocus
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          placeholder="e.g. Narnia"
                        />
                      )}
                    </FormField>
                  </Form.Group>
                </Card.Content>
              </Card>
            </Panel.Body>
          </SidePanel>
        )}
      </div>
    );
  },
};

/** Asserts the control's field box spans the whole FormField row (regression: roots without a width shrank to content). */
const expectFullWidth = async (canvasElement: HTMLElement) => {
  const shell = canvasElement.querySelector<HTMLElement>('.sikat-field--shell')!;
  const row = shell.closest<HTMLElement>('.sikat-field__fieldset')!;
  await expect(Math.round(shell.getBoundingClientRect().width)).toBe(
    Math.round(row.getBoundingClientRect().width),
  );
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
  play: async ({ canvasElement }) => expectFullWidth(canvasElement),
};

/** MultiSelect — searchable multi-value. */
export const MultiSelectField: Story = {
  name: 'Multi Select',
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Countries">
        {(props) => <MultiSelect {...props} options={COUNTRIES} placeholder="Select countries…" />}
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expectFullWidth(canvasElement);

    // Chevron is hidden at rest and shown with keyboard focus / while open.
    // (Hover is CSS :hover — synthetic userEvent.hover can't trigger it.)
    const canvas = within(canvasElement);
    const chevron = canvasElement.querySelector<HTMLElement>('.sikat-field__chevron')!;
    const opacity = () => getComputedStyle(chevron).opacity;
    await waitFor(() => expect(opacity()).toBe('0'));
    await userEvent.tab();
    const field = canvas.getByRole('combobox');
    await expect(field).toHaveFocus();
    await expect(field).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(opacity()).toBe('1'));

    // ↓ opens over the field with the search focused; picks stay open as chips.
    const body = within(document.body);
    await userEvent.keyboard('{ArrowDown}');
    const panel = document.querySelector<HTMLElement>('.sikat-dropdown')!;
    const search = within(panel).getByRole('combobox', { name: 'Countries' });
    await expect(search).toHaveFocus();
    await userEvent.keyboard('jap{Enter}');
    await expect(body.getByRole('option', { name: 'Japan' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    // The panel's header mirrors the field, so the new chip shows while open.
    await expect(within(panel).getByRole('button', { name: 'Remove Japan' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(field).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Remove Japan' })).toBeInTheDocument();
  },
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

const EMPLOYEES = [
  { value: 'EMP001', label: 'Juan dela Cruz', subLabel: 'EMP001', description: 'Engineering' },
  { value: 'EMP002', label: 'Maria Santos', subLabel: 'EMP002', description: 'Design' },
  { value: 'EMP003', label: 'Pedro Reyes', subLabel: 'EMP003', description: 'Finance' },
  { value: 'EMP004', label: 'Ana Gomez', subLabel: 'EMP004', description: 'Operations' },
];

/**
 * Options with a `description` — a secondary line shown below the label in the
 * dropdown (body/xs, muted). Supported by Select, Combobox, MultiSelect, and
 * Autocomplete.
 *
 * **Select** also shows both lines in the closed/filled field. Combobox keeps a
 * single line in the field (native `<input>` limitation) but shows two lines in
 * the dropdown.
 */
export const OptionWithDescription: Story = {
  name: 'Option — with Description',
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <FormField label="Employee (Select — empty)">
        {(props) => <Select {...props} options={EMPLOYEES} placeholder="Select employee…" />}
      </FormField>
      <FormField label="Employee (Select — filled)">
        {(props) => <Select {...props} options={EMPLOYEES} defaultValue="EMP001" />}
      </FormField>
      <FormField label="Employee (Combobox — empty)">
        {(props) => <Combobox {...props} options={EMPLOYEES} placeholder="Search employee…" />}
      </FormField>
      <FormField label="Employee (Combobox — filled)">
        {(props) => <Combobox {...props} options={EMPLOYEES} defaultValue="EMP002" />}
      </FormField>
      <FormField label="Employees (Multi Select)">
        {(props) => <MultiSelect {...props} options={EMPLOYEES} placeholder="Select employees…" />}
      </FormField>
    </div>
  ),
};
