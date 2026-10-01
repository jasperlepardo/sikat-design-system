import type { Meta, StoryObj } from '@storybook/react';
import { useId, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Dropdown, DropdownItem } from './Dropdown';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Icon } from '../Icon/Icon';
import { Select } from '../Field/Field';
import { DatePicker } from '../Field/DatePicker';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

const OPTIONS = ['Apple', 'Banana', 'Cherry', 'Dragonfruit', 'Elderberry'];

const ChevronGlyph = <Icon size={20}>expand_more</Icon>;

/** A select-only combobox composed from the foundation: useDropdown + useListbox + Dropdown. */
function SelectMenu() {
  const [value, setValue] = useState<string | null>(null);
  const { open, setOpen, toggle, rootRef } = useDropdown<HTMLDivElement>();
  const baseId = useId();
  const listId = `${baseId}-list`;
  const getItemId = (i: number) => `${baseId}-opt-${i}`;
  const selectedIndex = value ? OPTIONS.indexOf(value) : -1;

  const { activeIndex, onKeyDown, activeId } = useListbox({
    itemCount: OPTIONS.length,
    open,
    setOpen,
    onActivate: (i) => setValue(OPTIONS[i]),
    getItemId,
    getItemText: (i) => OPTIONS[i],
    selectedIndex,
  });

  return (
    <div ref={rootRef} style={{ position: 'relative', width: 240 }}>
      <Button
        intent="default"
        variant="outline"
        trailingIcon={ChevronGlyph}
        role="combobox"
        aria-label="Fruit"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeId}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        {value ?? 'Select a fruit'}
      </Button>
      {open ? (
        <Dropdown id={listId}>
          {OPTIONS.map((o, i) => (
            <DropdownItem
              key={o}
              id={getItemId(i)}
              selected={o === value}
              active={i === activeIndex}
              onSelect={() => {
                setValue(o);
                setOpen(false);
              }}
            >
              {o}
            </DropdownItem>
          ))}
        </Dropdown>
      ) : null}
    </div>
  );
}

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: { children: null, role: 'listbox' },
  argTypes: {
    role: { control: 'inline-radio', options: ['listbox', 'menu'] },
    multiselectable: { control: 'boolean' },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Foundation demo — a working select built from useDropdown + useListbox + Dropdown. */
export const SelectMenuExample: Story = {
  render: () => <SelectMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox');
    const activeName = () =>
      canvasElement.querySelector(
        `#${CSS.escape(trigger.getAttribute('aria-activedescendant') ?? '')}`,
      )?.textContent;

    // Click opens with the first option active; arrows + Enter select and close.
    await userEvent.click(trigger);
    await expect(canvas.getAllByRole('option')).toHaveLength(OPTIONS.length);
    await expect(activeName()).toBe('Apple');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent('Banana');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Type-ahead on the closed trigger opens and jumps to the match.
    await userEvent.keyboard('c');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(activeName()).toBe('Cherry');
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveTextContent('Cherry');

    // Reopening highlights the selection; Escape closes without changing it.
    await userEvent.keyboard(' ');
    await expect(activeName()).toBe('Cherry');
    await userEvent.keyboard('{End}{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent('Cherry');
  },
};

const CircleIcon = <Icon size={20}>radio_button_unchecked</Icon>;

/**
 * Controls mirror the Figma Dropdown Item component properties 1:1 — same names,
 * options and order (args keyed by the Figma property names).
 */
type DropdownItemPlaygroundArgs = {
  showLeading: boolean;
  showTrailing: boolean;
  dropdownLabel: string;
  showPrefix: boolean;
  prefix: string;
  showSuffix: boolean;
  suffix: string;
  State: 'default' | 'hover';
  isSelected: boolean;
};

export const ItemPlayground: StoryObj<DropdownItemPlaygroundArgs> = {
  name: 'Dropdown Item',
  args: {
    showLeading: true,
    showTrailing: true,
    dropdownLabel: 'Dropdown',
    showPrefix: true,
    prefix: 'Prefix',
    showSuffix: true,
    suffix: 'Suffix',
    State: 'default',
    isSelected: false,
  },
  argTypes: {
    showLeading: { name: 'Show Leading', control: 'boolean' },
    showTrailing: { name: 'Show Trailing', control: 'boolean' },
    dropdownLabel: { name: 'Dropdown Label', control: 'text' },
    showPrefix: { name: 'Show Prefix', control: 'boolean' },
    prefix: { name: 'Prefix', control: 'text' },
    showSuffix: { name: 'Show Suffix', control: 'boolean' },
    suffix: { name: 'Suffix', control: 'text' },
    State: figmaSelect('State', ['default', 'hover'] as const, ['Default', 'Hover']),
    isSelected: figmaSelect('isSelected', [false, true], ['False', 'True']),
  },
  parameters: figmaControls([
    'Show Leading',
    'Show Trailing',
    'Dropdown Label',
    'Show Prefix',
    'Prefix',
    'Show Suffix',
    'Suffix',
    'State',
    'isSelected',
  ]),
  render: (a) => (
    <div role="listbox" aria-label="Dropdown" style={{ width: 480 }}>
      <DropdownItem
        active={a.State === 'hover'}
        selected={a.isSelected}
        leadingIcon={a.showLeading ? CircleIcon : undefined}
        prefix={a.showPrefix ? a.prefix : undefined}
        suffix={a.showSuffix ? a.suffix : undefined}
        trailingIcon={a.showTrailing ? CircleIcon : undefined}
      >
        {a.dropdownLabel}
      </DropdownItem>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole('option');
    await expect(item.getBoundingClientRect().height).toBe(36);
    const style = getComputedStyle(item);
    await expect(style.fontSize).toBe('14px');
    await expect(style.lineHeight).toBe('20px');
    // Fonts = Figma Body/sm: DM Sans (opsz follows the 14px size, as in Figma),
    // Medium label, Regular affixes.
    await expect(style.fontFamily).toMatch(/^"?DM Sans"?/);
    await expect(style.fontOpticalSizing).toBe('auto');
    await expect(document.fonts.check('500 14px "DM Sans"')).toBe(true);
    await expect(getComputedStyle(item.querySelector('.sikat-dropdown__label')!).fontWeight).toBe(
      '500',
    );
    for (const affix of item.querySelectorAll('.sikat-dropdown__affix')) {
      await expect(getComputedStyle(affix).fontWeight).toBe('400');
    }
    for (const svg of item.querySelectorAll('.sikat-dropdown__icon > svg')) {
      await expect(svg.getBoundingClientRect().width).toBe(20);
    }
  },
};

/**
 * Controls mirror the Figma Dropdown component properties: "Show Scrollbar".
 * (Its other property, "Dropdown Item Group", is a slot — pass DropdownItems as
 * children.)
 */
/** The Figma Dropdown panel, opened by a Button trigger (useDropdown: click to toggle,
 * outside-click / Escape to close). */
function ButtonDropdown({ showScrollbar }: { showScrollbar: boolean }) {
  const { open, setOpen, toggle, rootRef } = useDropdown<HTMLDivElement>();
  const listId = useId();
  return (
    // Outer box reserves room for the open panel; the positioned root wraps only the
    // trigger so the panel (top: 100%) opens directly under the button.
    <div style={{ width: 600, height: 340 }}>
      <div ref={rootRef} style={{ position: 'relative' }}>
        <Button
          intent="default"
          variant="outline"
          trailingIcon={ChevronGlyph}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={toggle}
        >
          Dropdown
        </Button>
        {open ? (
          <Dropdown
            id={listId}
            aria-label="Dropdown"
            tabIndex={showScrollbar ? 0 : undefined}
            className={showScrollbar ? undefined : 'overflow-hidden'}
          >
            {Array.from({ length: 7 }, (_, i) => (
              <DropdownItem
                key={i}
                prefix="Prefix"
                suffix="Suffix"
                leadingIcon={CircleIcon}
                trailingIcon={CircleIcon}
                onSelect={() => setOpen(false)}
              >
                Dropdown
              </DropdownItem>
            ))}
          </Dropdown>
        ) : null}
      </div>
    </div>
  );
}

/** Portaled dropdown inside a table — escapes overflow clipping. */
function TableCellDropdown({ row }: { row: string }) {
  const { open, toggle, rootRef, panelRef, anchor, side, hSide } = useDropdown<HTMLDivElement>();
  const id = useId();
  return (
    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
      <div ref={rootRef} style={{ display: 'inline-flex' }}>
        <IconButton
          label="Actions"
          intent="default"
          variant="ghost"
          size="small"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
        >
          <Icon size={20}>more_vert</Icon>
        </IconButton>
        {open && anchor ? (
          <Dropdown
            ref={panelRef}
            id={id}
            role="menu"
            anchor={anchor}
            side={side}
            hSide={hSide}
            style={{ width: 160 }}
          >
            <DropdownItem onSelect={() => alert(`Edit ${row}`)}>Edit</DropdownItem>
            <DropdownItem onSelect={() => alert(`Duplicate ${row}`)}>Duplicate</DropdownItem>
            <DropdownItem onSelect={() => alert(`Delete ${row}`)}>Delete</DropdownItem>
          </Dropdown>
        ) : null}
      </div>
    </td>
  );
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const ROWS = [
  { name: 'Alpha Corp', status: 'active', date: '2026-01-15' },
  { name: 'Beta Ltd', status: 'pending', date: '2026-03-22' },
  { name: 'Gamma Inc', status: 'inactive', date: '2026-06-01' },
];

const th: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#292524',
  fontSize: 13,
};
const td: React.CSSProperties = { padding: '8px 12px', verticalAlign: 'middle' };

/** Portaled — Select, DatePicker, and action menu all escape the clipping table. */
export const InTable: Story = {
  render: () => (
    <div style={{ overflow: 'hidden', border: '1px solid #e7e5e4', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4' }}>
            <th style={th}>Name</th>
            <th style={{ ...th, width: 180 }}>Status</th>
            <th style={{ ...th, width: 200 }}>Date</th>
            <th style={{ ...th, width: 48 }} />
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.name} style={{ borderBottom: '1px solid #e7e5e4' }}>
              <td style={td}>{row.name}</td>
              <td style={td}>
                <Select size="md" defaultValue={row.status} options={STATUS_OPTIONS} />
              </td>
              <td style={td}>
                <DatePicker size="md" defaultValue={row.date} />
              </td>
              <TableCellDropdown row={row.name} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const PanelPlayground: StoryObj<{ showScrollbar: boolean }> = {
  name: 'Dropdown',
  args: { showScrollbar: true },
  argTypes: { showScrollbar: { name: 'Show Scrollbar', control: 'boolean' } },
  parameters: figmaControls(['Show Scrollbar']),
  render: ({ showScrollbar }) => <ButtonDropdown showScrollbar={showScrollbar} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Dropdown' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('listbox')).toBeNull();

    // Button opens the panel; picking an item closes it.
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByRole('option')).toHaveLength(7);
    await userEvent.click(canvas.getAllByRole('option')[2]);
    await expect(canvas.queryByRole('listbox')).toBeNull();

    // Escape closes too; leave it open for the docs.
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(canvas.getByRole('listbox')).toBeVisible();
  },
};
