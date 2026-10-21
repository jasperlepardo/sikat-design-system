import { useContext, useId, useState } from 'react';
import { Link } from '../Button/Link';
import { Icon } from '../Icon/Icon';
import { Dropdown } from '../Dropdown/Dropdown';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { cn } from '../../lib/cn';
import { FieldStateContext } from './FieldShell';
import { OptionItem, optionText, toOption, type FieldOption } from './options';

export type AffixSelectOption = FieldOption;

export interface AffixSelectProps {
  /** Options — plain strings or `FieldOption` objects (the same shape as Select's). */
  options: (string | AffixSelectOption)[];
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Disables the trigger. Also disabled while the parent field is disabled or read-only. */
  disabled?: boolean;
  /** Submitted with forms via a hidden input. */
  name?: string;
  /** Required: the field's label names the input, not this choice (e.g. "Unit"). */
  'aria-label': string;
  className?: string;
}

/**
 * Field.AffixSelect — a link-style dropdown for a TextField `prefix` / `suffix`
 * (e.g. a unit or currency): `<Field.Text suffix={<Field.AffixSelect … />} />`.
 * The trigger is a caption Link (the color and 20px line of a text affix) with a chevron; it opens
 * the Dropdown with the same keyboard model as Select (useDropdown +
 * useListbox). Follows the parent field's disabled / read-only state.
 */
export function AffixSelect({
  options: optionsProp,
  value,
  defaultValue,
  onValueChange,
  disabled: disabledProp,
  name,
  className,
  'aria-label': ariaLabel,
}: AffixSelectProps) {
  const id = useId();
  const listId = `${id}-listbox`;
  const getItemId = (i: number) => `${id}-opt-${i}`;
  const field = useContext(FieldStateContext);
  const disabled = disabledProp || field.disabled || field.readOnly;

  const options = optionsProp.map(toOption);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(
    () => defaultValue ?? options.find((o) => !o.disabled)?.value ?? '',
  );
  const selected = isControlled ? value : internal;
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const { open, setOpen, rootRef, panelRef, side, hSide, anchor } = useDropdown<HTMLSpanElement>();
  const trigger = () => rootRef.current?.querySelector<HTMLElement>('[role="combobox"]');

  const selectAt = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    if (!isControlled) setInternal(o.value);
    onValueChange?.(o.value);
    setOpen(false);
    trigger()?.focus();
  };

  const { activeIndex, onKeyDown, activeId } = useListbox({
    itemCount: options.length,
    open,
    setOpen: (next) => !disabled && setOpen(next),
    onActivate: selectAt,
    getItemId,
    isDisabled: (i) => !!options[i].disabled,
    getItemText: (i) => optionText(options[i]),
    selectedIndex,
  });

  return (
    // Clicks (incl. on the portaled items, which bubble through React) must not
    // reach the field shell, which would move focus to the input.
    <span
      ref={rootRef}
      className={cn('sikat-field-affix-select', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        intent="caption"
        role="combobox"
        // No href: it opens a list rather than navigating, so make it focusable.
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={activeId}
        disabled={disabled}
        trailingIcon={<Icon size={20}>expand_more</Icon>}
        onClick={() => setOpen(!open)}
        onKeyDown={disabled ? undefined : onKeyDown}
      >
        {selectedOption ? (selectedOption.label ?? optionText(selectedOption)) : null}
      </Link>
      {name != null ? <input type="hidden" name={name} value={selected} /> : null}
      {open && anchor ? (
        <Dropdown
          ref={panelRef}
          id={listId}
          anchor={anchor}
          side={side}
          hSide={hSide}
          // The trigger is a word or two wide — give the items room.
          style={{ width: Math.max(anchor.width, 120) }}
        >
          {options.map((o, i) => (
            <OptionItem
              key={o.value}
              option={o}
              id={getItemId(i)}
              selected={o.value === selected}
              active={i === activeIndex}
              onSelect={() => selectAt(i)}
            />
          ))}
        </Dropdown>
      ) : null}
    </span>
  );
}
