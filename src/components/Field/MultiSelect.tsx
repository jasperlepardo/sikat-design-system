import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { Dropdown } from '../Dropdown/Dropdown';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { fieldLabelText, usePanelFocus } from '../../lib/usePanelFocus';
import { OptionItem, optionText, type FieldOption } from './options';
import { FieldShell, ChevronDown, type FieldAdornments } from './FieldShell';

export type MultiSelectOption = FieldOption;

export interface MultiSelectProps extends FieldAdornments {
  options: MultiSelectOption[];
  /** Controlled selected values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Applied to the input, so a `<label htmlFor>` focuses it. */
  id?: string;
  className?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * MultiSelect — a searchable multi-value combobox on the Popover/Listbox
 * foundation, styled as the Figma Multi Select (the shared field box, 36px, with
 * a trailing chevron). Type to filter; ↑/↓ + Enter toggles options (the menu stays
 * open); picked values become removable chips (Figma Badge, Default / Solid /
 * Extra Small); Backspace on an empty query removes the last chip. Like Select,
 * the open panel covers the field and starts with the search field. Optional
 * `leadingIcon` / `prefix` / `suffix` / `trailingIcon`. Control-only and
 * FormField-compatible (the input takes the `id`).
 */
export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder,
  invalid,
  disabled,
  readOnly,
  id: idProp,
  className,
  leadingIcon,
  prefix,
  suffix,
  trailingIcon,
  leadingAlign,
  trailingAlign,
  ...aria
}: MultiSelectProps) {
  const reactId = useId();
  const id = idProp ?? reactId;
  const listId = `${id}-listbox`;
  const getItemId = (i: number) => `${id}-opt-${i}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = isControlled ? value : internal;

  const { open, setOpen, rootRef, panelRef, side, hSide, anchor } = useDropdown<HTMLDivElement>();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => optionText(o).toLowerCase().includes(q)) : options;
  }, [options, query]);

  const commit = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };
  const toggle = (val: string) =>
    commit(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

  const toggleAt = (i: number) => {
    const o = filtered[i];
    if (!o || o.disabled) return;
    toggle(o.value);
    setQuery('');
  };

  const { activeIndex, onKeyDown, activeId } = useListbox({
    itemCount: filtered.length,
    open,
    setOpen,
    onActivate: toggleAt,
    getItemId,
    isDisabled: (i) => !!filtered[i]?.disabled,
    closeOnActivate: false,
  });

  usePanelFocus(open, searchRef, inputRef, () => setQuery(''));

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (readOnly) return;
    if (e.key === 'Backspace' && query === '' && selected.length) {
      commit(selected.slice(0, -1));
      return;
    }
    onKeyDown(e);
  };

  const selectedOptions = selected
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is MultiSelectOption => o != null);

  /**
   * The field — chips + text input. Rendered twice: closed in place, and again
   * as the open panel's header (sitting exactly over it), so the chips stay
   * visible and removable while picking.
   */
  const renderField = (inPanel: boolean) => {
    const ref = inPanel ? searchRef : inputRef;
    return (
      <FieldShell
        className="sikat-field--wrap"
        state={{ size: 'md', filled: selectedOptions.length > 0, disabled, readOnly, invalid }}
        adornments={{ leadingIcon, prefix, suffix, trailingIcon, leadingAlign, trailingAlign }}
        after={
          <span
            className="sikat-field__icon sikat-field__icon--trailing sikat-field__chevron"
            aria-hidden="true"
          >
            {ChevronDown}
          </span>
        }
        onClick={() => {
          if (disabled || readOnly) return;
          ref.current?.focus();
          if (!inPanel) setOpen(true);
        }}
      >
        <span className="sikat-field__chips">
          {selectedOptions.map((o) => (
            <span key={o.value} className="sikat-field__chip">
              <span className="sikat-field__chip-label">{o.label ?? optionText(o)}</span>
              <button
                type="button"
                aria-label={`Remove ${optionText(o)}`}
                className="sikat-field__chip-remove"
                disabled={disabled || readOnly}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggle(o.value);
                }}
              >
                <Icon size={12}>close</Icon>
              </button>
            </span>
          ))}
          <input
            ref={ref}
            id={inPanel ? undefined : id}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            aria-invalid={invalid || undefined}
            aria-readonly={readOnly || undefined}
            autoComplete="off"
            disabled={disabled}
            readOnly={readOnly}
            placeholder={selectedOptions.length === 0 ? placeholder : undefined}
            value={query}
            className="sikat-field__input"
            style={{ minWidth: '4rem' }}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onKeyDown={
              inPanel
                ? (e) => {
                    // Tab: close and hand focus back to the field first, so
                    // the browser moves on to the field after it.
                    if (e.key === 'Tab') {
                      inputRef.current?.focus();
                      setOpen(false);
                      return;
                    }
                    handleKeyDown(e);
                  }
                : handleKeyDown
            }
            {...aria}
            aria-label={
              inPanel
                ? (aria['aria-label'] ?? fieldLabelText(inputRef, placeholder))
                : aria['aria-label']
            }
          />
        </span>
      </FieldShell>
    );
  };

  return (
    <div ref={rootRef} className={cn('sikat-multiselect', className)}>
      {renderField(false)}
      {open && anchor ? (
        <Dropdown
          ref={panelRef}
          id={listId}
          multiselectable
          anchor={anchor}
          side={side}
          hSide={hSide}
          cover
          header={renderField(true)}
        >
          {filtered.length === 0 ? (
            <div className="sikat-dropdown__empty">No results</div>
          ) : (
            filtered.map((o, i) => (
              <OptionItem
                key={o.value}
                option={o}
                id={getItemId(i)}
                selected={selected.includes(o.value)}
                active={i === activeIndex}
                onSelect={() => toggleAt(i)}
                trailingIcon={selected.includes(o.value) ? <Icon size={20}>check</Icon> : undefined}
              />
            ))
          )}
        </Dropdown>
      ) : null}
    </div>
  );
}
