import type { Meta, StoryObj } from '@storybook/react';
import { useId, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Dropdown, DropdownItem } from './Dropdown';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { Button } from '../Button/Button';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

const OPTIONS = ['Apple', 'Banana', 'Cherry', 'Dragonfruit', 'Elderberry'];

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
        className="w-full justify-between"
        role="combobox"
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

const CircleIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

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
};

/**
 * Controls mirror the Figma Dropdown component properties: "Show Scrollbar".
 * (Its other property, "Dropdown Item Group", is a slot — pass DropdownItems as
 * children.)
 */
export const PanelPlayground: StoryObj<{ showScrollbar: boolean }> = {
  name: 'Dropdown',
  args: { showScrollbar: true },
  argTypes: { showScrollbar: { name: 'Show Scrollbar', control: 'boolean' } },
  parameters: figmaControls(['Show Scrollbar']),
  render: ({ showScrollbar }) => (
    <div style={{ position: 'relative', width: 600, height: 280 }}>
      <Dropdown className={showScrollbar ? undefined : 'overflow-hidden'}>
        {['Dropdown', 'Dropdown', 'Dropdown', 'Dropdown', 'Dropdown', 'Dropdown', 'Dropdown'].map(
          (l, i) => (
            <DropdownItem
              key={i}
              prefix="Prefix"
              suffix="Suffix"
              leadingIcon={CircleIcon}
              trailingIcon={CircleIcon}
            >
              {l}
            </DropdownItem>
          ),
        )}
      </Dropdown>
    </div>
  ),
};
