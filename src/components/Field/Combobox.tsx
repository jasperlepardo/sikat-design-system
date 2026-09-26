import { useId, useMemo, useState, type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
import { FieldShell, type FieldSize } from './Field';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';

export interface ComboboxOption {
  value: string;
  label?: ReactNode;
  /** Plain text for filtering + the closed display (when `label` is a node). */
  text?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Controlled selected value (`null` = none). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
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
  size = 'md',
  invalid,
  disabled,
  readOnly,
  id: idProp,
  className,
  ...aria
}: ComboboxProps) {
  const reactId = useId();
  const id = idProp ?? reactId;
  const listId = `${id}-listbox`;
  const getItemId = (i: number) => `${id}-opt-${i}`;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const selected = isControlled ? value : internal;

  const { open, setOpen, rootRef } = useDropdown<HTMLDivElement>();
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
    <div ref={rootRef} style={{ position: 'relative' }}>
      <FieldShell
        className={className}
        state={{ size, filled: selectedOption != null, disabled, readOnly, invalid }}
        adornments={{}}
        after={ChevronIcon}
      >
        <input
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
      {open ? (
        <Dropdown id={listId}>
          {filtered.length === 0 ? (
            <div style={{ padding: '8px 12px', fontSize: 14, color: 'var(--color-text-muted)' }}>
              No results
            </div>
          ) : (
            filtered.map((o, i) => (
              <DropdownItem
                key={o.value}
                id={getItemId(i)}
                selected={o.value === selected}
                active={i === activeIndex}
                disabled={o.disabled}
                onSelect={() => selectAt(i)}
              >
                {o.label ?? optText(o)}
              </DropdownItem>
            ))
          )}
        </Dropdown>
      ) : null}
    </div>
  );
}
