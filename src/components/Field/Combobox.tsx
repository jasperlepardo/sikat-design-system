import { useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
import { FieldClear, FieldShell, type FieldSize } from './FieldShell';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';

export interface ComboboxOption {
  value: string;
  label?: ReactNode;
  /** Plain text for filtering + the closed display (when `label` is a node). */
  text?: string;
  subLabel?: ReactNode;
  subLabelPlacement?: 'top' | 'inline';
  /** Third line shown below the label in the dropdown (body/xs, muted). */
  description?: ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Controlled selected value (`null` = none). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /**
   * Show a ✕ while a value is set; clicking it resets to none and calls
   * `onValueChange(null)`, so the `placeholder` shows again. Use for optional
   * fields instead of a "None" option.
   */
  clearable?: boolean;
  size?: FieldSize;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Applied to the input, so a `<label htmlFor>` focuses it. */
  id?: string;
  className?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-invalid'?: boolean;
  /** Replaces the default "No results" message when the filtered list is empty.
   *  Pass a function to receive a `close` callback — use it to dismiss the dropdown
   *  before opening a modal or navigating away. */
  emptyContent?: ReactNode | ((close: () => void) => ReactNode);
  /** Always rendered at the bottom of the open dropdown, regardless of results. */
  footer?: ReactNode;
  /** Called whenever the filter query changes (the raw text the user is typing). */
  onQueryChange?: (query: string) => void;
}

const optText = (o: ComboboxOption) => o.text ?? (typeof o.label === 'string' ? o.label : o.value);

const ChevronIcon = (
  <span className="sikat-field__icon sikat-field__chevron" aria-hidden="true">
    <Icon size={16}>expand_more</Icon>
  </span>
);

/**
 * Combobox — a searchable, single-select combobox built on the Popover/Listbox
 * foundation (useDropdown + useListbox + Dropdown). Uses the Field shell for
 * consistent styling. Type to filter; ↑/↓ + Enter to choose; Escape to close.
 */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  clearable,
  size = 'md',
  invalid,
  disabled,
  readOnly,
  id: idProp,
  className,
  emptyContent,
  footer,
  onQueryChange,
  ...aria
}: ComboboxProps) {
  const reactId = useId();
  const id = idProp ?? reactId;
  const listId = `${id}-listbox`;
  const getItemId = (i: number) => `${id}-opt-${i}`;
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const selected = isControlled ? value : internal;

  const { open, setOpen, rootRef, panelRef, side, hSide, anchor } = useDropdown<HTMLDivElement>();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => optText(o).toLowerCase().includes(q)) : options;
  }, [options, query]);

  const selectedOption = options.find((o) => o.value === selected) ?? null;
  const display = open ? query : selectedOption ? optText(selectedOption) : '';

  const commit = (next: string | null) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };
  const selectAt = (i: number) => {
    const o = filtered[i];
    if (!o || o.disabled) return;
    commit(o.value);
    setQuery('');
    setOpen(false);
  };
  const clear = () => {
    commit(null);
    setQuery('');
    // Refocus so keyboard users stay in the field (focus opens the list to pick again).
    inputRef.current?.focus();
  };

  const { activeIndex, onKeyDown, activeId } = useListbox({
    itemCount: filtered.length,
    open,
    setOpen,
    onActivate: selectAt,
    getItemId,
    isDisabled: (i) => !!filtered[i]?.disabled,
    selectedIndex: filtered.findIndex((o) => o.value === selected),
  });

  return (
    <div ref={rootRef} className={cn('sikat-combobox', className)}>
      <FieldShell
        state={{ size, filled: selectedOption != null, disabled, readOnly, invalid }}
        adornments={{}}
        after={
          <>
            {clearable && !disabled && !readOnly && selectedOption ? (
              <FieldClear onClear={clear} />
            ) : null}
            {ChevronIcon}
          </>
        }
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          className="sikat-field__input"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-invalid={invalid || undefined}
          autoComplete="off"
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={display}
          onChange={(e) => {
            setQuery(e.target.value);
            onQueryChange?.(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (!disabled) {
              setQuery('');
              setOpen(true);
            }
          }}
          onClick={() => {
            if (!disabled) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          {...aria}
        />
      </FieldShell>
      {open && anchor ? (
        <Dropdown ref={panelRef} id={listId} anchor={anchor} side={side} hSide={hSide}>
          {filtered.length === 0
            ? ((typeof emptyContent === 'function'
                ? emptyContent(() => setOpen(false))
                : emptyContent) ?? (
                <div
                  style={{ padding: '8px 12px', fontSize: 14, color: 'var(--color-text-muted)' }}
                >
                  No results
                </div>
              ))
            : filtered.map((o, i) => (
                <DropdownItem
                  key={o.value}
                  id={getItemId(i)}
                  selected={o.value === selected}
                  active={i === activeIndex}
                  disabled={o.disabled}
                  subLabel={o.subLabel}
                  subLabelPlacement={o.subLabelPlacement}
                  description={o.description}
                  onSelect={() => selectAt(i)}
                >
                  {o.label ?? optText(o)}
                </DropdownItem>
              ))}
          {footer}
        </Dropdown>
      ) : null}
    </div>
  );
}
