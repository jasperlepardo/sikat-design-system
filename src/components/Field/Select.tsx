import { useId, useMemo, useRef, useState, isValidElement, Children } from 'react';
import type { ReactNode, OptionHTMLAttributes, ReactElement } from 'react';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { cn } from '../../lib/cn';
import {
  FieldShell,
  FieldClear,
  ChevronDown,
  type FieldAdornments,
  type FieldSize,
} from './FieldShell';

export interface SelectOption {
  value: string;
  label?: ReactNode;
  /** Plain text for type-ahead + the closed display (when `label` is a node). */
  text?: string;
  disabled?: boolean;
}

export interface SelectProps extends FieldAdornments {
  /** Options. Alternatively pass `<option>` children (as with a native select). */
  options?: SelectOption[];
  /** `<option>` children; an empty-valued option acts as the placeholder. */
  children?: ReactNode;
  /** Controlled value (`''` = none). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown when nothing is selected (defaults to an empty-valued option's text). */
  placeholder?: string;
  /**
   * Show a ✕ while a value is set; clicking it resets to none and calls
   * `onValueChange('')`, so the `placeholder` shows again. Use for optional fields
   * instead of a "None" option.
   */
  clearable?: boolean;
  /** Submitted with forms via a hidden input. */
  name?: string;
  size?: FieldSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Figma Select has no read-only state of its own; mirrors Text Field's. */
  readOnly?: boolean;
  /** Applied to the trigger, so a `<label htmlFor>` / FormField labels it. */
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  /** Story/docs hook: force the Figma "Hover" look. */
  'data-state'?: string;
}

const optionText = (o: SelectOption) => o.text ?? (typeof o.label === 'string' ? o.label : o.value);

function parseOptionChildren(children: ReactNode) {
  const options: SelectOption[] = [];
  let placeholder: string | undefined;
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child) || child.type !== 'option') continue;
    const props = (child as ReactElement<OptionHTMLAttributes<HTMLOptionElement>>).props;
    const text = Children.toArray(props.children).join('');
    const value = props.value != null ? String(props.value) : text;
    if (value === '') placeholder = text;
    else options.push({ value, label: props.children, text, disabled: props.disabled });
  }
  return { options, placeholder };
}

/**
 * Select — the Figma Select field (shared field box, trailing chevron) opening the
 * Figma Dropdown as its option list. Built on the Popover/Listbox foundation
 * (useDropdown + useListbox + Dropdown): click / Enter / Space / ↑↓ to open,
 * ↑↓ Home End + type-ahead to move, Enter / Space / click to choose, Escape or
 * outside-click to close. Pass `options` or native-style `<option>` children.
 */
export function Select({
  options: optionsProp,
  children,
  value,
  defaultValue,
  onValueChange,
  placeholder: placeholderProp,
  clearable,
  name,
  size = 'md',
  invalid,
  disabled,
  readOnly,
  id: idProp,
  className,
  leadingIcon,
  prefix,
  suffix,
  trailingIcon,
  'data-state': dataState,
  ...aria
}: SelectProps) {
  const reactId = useId();
  const id = idProp ?? reactId;
  const listId = `${id}-listbox`;
  const getItemId = (i: number) => `${id}-opt-${i}`;
  const triggerRef = useRef<HTMLButtonElement>(null);

  const parsed = useMemo(() => parseOptionChildren(children), [children]);
  const options = optionsProp ?? parsed.options;
  const placeholder = placeholderProp ?? parsed.placeholder;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(
    () =>
      defaultValue ?? (placeholder == null ? (options.find((o) => !o.disabled)?.value ?? '') : ''),
  );
  const selected = isControlled ? value : internal;
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const { open, setOpen, rootRef, panelRef, side, hSide, anchor } = useDropdown<HTMLDivElement>();
  const interactive = !disabled && !readOnly;

  const selectAt = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    if (!isControlled) setInternal(o.value);
    onValueChange?.(o.value);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const clear = () => {
    if (!isControlled) setInternal('');
    onValueChange?.('');
    setOpen(false);
    triggerRef.current?.focus();
  };

  const { activeIndex, onKeyDown, activeId } = useListbox({
    itemCount: options.length,
    open,
    setOpen: (next) => interactive && setOpen(next),
    onActivate: selectAt,
    getItemId,
    isDisabled: (i) => !!options[i]?.disabled,
    getItemText: (i) => optionText(options[i]),
    selectedIndex,
  });

  return (
    <div ref={rootRef} className="sikat-select">
      <FieldShell
        className={cn('sikat-field--select', className)}
        state={{ size, filled: selectedOption != null, disabled, readOnly, invalid, dataState }}
        adornments={{ leadingIcon, prefix, suffix, trailingIcon }}
        after={
          <>
            {clearable && interactive && selectedOption ? <FieldClear onClear={clear} /> : null}
            <span className="sikat-field__icon sikat-field__chevron" aria-hidden="true">
              {ChevronDown}
            </span>
          </>
        }
        onClick={() => {
          if (!interactive) return;
          triggerRef.current?.focus();
          setOpen(!open);
        }}
      >
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          className="sikat-field__input"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={activeId}
          aria-invalid={invalid || undefined}
          aria-readonly={readOnly || undefined}
          disabled={disabled}
          onKeyDown={interactive ? onKeyDown : undefined}
          {...aria}
        >
          {selectedOption ? (selectedOption.label ?? optionText(selectedOption)) : placeholder}
        </button>
      </FieldShell>
      {name != null ? <input type="hidden" name={name} value={selected} /> : null}
      {open && anchor ? (
        <Dropdown ref={panelRef} id={listId} anchor={anchor} side={side} hSide={hSide}>
          {options.map((o, i) => (
            <DropdownItem
              key={o.value}
              id={getItemId(i)}
              selected={o.value === selected}
              active={i === activeIndex}
              disabled={o.disabled}
              onSelect={() => selectAt(i)}
            >
              {o.label ?? optionText(o)}
            </DropdownItem>
          ))}
        </Dropdown>
      ) : null}
    </div>
  );
}
