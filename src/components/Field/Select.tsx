import { useId, useMemo, useRef, useState, isValidElement, Children } from 'react';
import type { ReactNode, OptionHTMLAttributes, ReactElement } from 'react';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { usePanelFocus } from '../../lib/usePanelFocus';
import { cn } from '../../lib/cn';
import { TextField } from './TextField';
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
  /** Short secondary text shown in the dropdown. */
  subLabel?: ReactNode;
  subLabelPlacement?: 'top' | 'inline';
  /** Third line shown below the label in the dropdown (body/xs, muted). */
  description?: ReactNode;
  /** Text before the label in the dropdown item (text/muted). */
  prefix?: ReactNode;
  /** Text after the label in the dropdown item (text/muted). */
  suffix?: ReactNode;
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
  /**
   * Autocomplete: the open panel starts with a search field sitting exactly
   * over the closed field; typing filters the options. Typing on the closed
   * field opens it with that text.
   */
  searchable?: boolean;
  /** Search field placeholder (searchable). Default: "Search". */
  searchPlaceholder?: string;
  /**
   * Replaces the default "No results" message when the search matches nothing.
   * Pass a function to receive a `close` callback — use it to dismiss the
   * dropdown before opening a modal or navigating away.
   */
  emptyContent?: ReactNode | ((close: () => void) => ReactNode);
  /** Always rendered at the bottom of the open dropdown, regardless of results. */
  footer?: ReactNode;
  /** Called whenever the search text changes (searchable). */
  onQueryChange?: (query: string) => void;
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

/** Indices of the options whose text contains `query` (case-insensitive). */
const matching = (options: SelectOption[], query: string) => {
  const q = query.trim().toLowerCase();
  return options.flatMap((o, i) => (!q || optionText(o).toLowerCase().includes(q) ? [i] : []));
};

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
  searchable,
  searchPlaceholder = 'Search',
  emptyContent,
  footer,
  onQueryChange,
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
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

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

  // Indices into `options` that are shown — all of them unless searching.
  const visible = useMemo(
    () => matching(options, searchable ? query : ''),
    [options, query, searchable],
  );

  const { open, setOpen, rootRef, panelRef, side, hSide, anchor } = useDropdown<HTMLDivElement>();
  const interactive = !disabled && !readOnly;

  const selectAt = (i: number) => {
    const o = options[visible[i]];
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

  const { activeIndex, setActiveIndex, onKeyDown, activeId } = useListbox({
    itemCount: visible.length,
    open,
    setOpen: (next) => interactive && setOpen(next),
    onActivate: selectAt,
    getItemId,
    isDisabled: (i) => !!options[visible[i]]?.disabled,
    // Searchable: typing goes to the search field instead of type-ahead.
    getItemText: searchable ? undefined : (i) => optionText(options[visible[i]]),
    selectedIndex: visible.indexOf(selectedIndex),
  });

  // Searchable: focus moves into the panel's search field and back.
  usePanelFocus(open && !!searchable, searchRef, triggerRef, () => setQuery(''));

  // Filter, and highlight the first enabled match.
  const search = (next: string) => {
    setQuery(next);
    onQueryChange?.(next);
    setActiveIndex(matching(options, next).findIndex((oi) => !options[oi].disabled));
  };

  const onTriggerKeyDown: typeof onKeyDown = (e) => {
    // Searchable: a printable key on the closed field opens it with that text.
    if (
      searchable &&
      !open &&
      e.key.length === 1 &&
      e.key !== ' ' &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      setOpen(true);
      search(e.key);
      return;
    }
    onKeyDown(e);
  };

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
          onKeyDown={interactive ? onTriggerKeyDown : undefined}
          {...aria}
        >
          {selectedOption ? (
            selectedOption.subLabel != null || selectedOption.description != null ? (
              <span className="sikat-field__multiline">
                {selectedOption.subLabel != null &&
                (selectedOption.subLabelPlacement ?? 'top') === 'top' ? (
                  <span className="sikat-field__sublabel">{selectedOption.subLabel}</span>
                ) : null}
                <span>{selectedOption.label ?? optionText(selectedOption)}</span>
                {selectedOption.subLabel != null &&
                selectedOption.subLabelPlacement === 'inline' ? (
                  <span className="sikat-field__sublabel">{selectedOption.subLabel}</span>
                ) : null}
                {selectedOption.description != null ? (
                  <span className="sikat-field__description">{selectedOption.description}</span>
                ) : null}
              </span>
            ) : (
              (selectedOption.label ?? optionText(selectedOption))
            )
          ) : (
            placeholder
          )}
        </button>
      </FieldShell>
      {name != null ? <input type="hidden" name={name} value={selected} /> : null}
      {open && anchor ? (
        <Dropdown
          ref={panelRef}
          id={listId}
          anchor={anchor}
          side={side}
          hSide={hSide}
          cover
          header={
            searchable ? (
              <TextField
                ref={searchRef}
                size={size}
                role="combobox"
                aria-label={searchPlaceholder}
                aria-autocomplete="list"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={activeId}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => search(e.currentTarget.value)}
                onKeyDown={(e) => {
                  // Tab: close and hand focus back to the trigger first, so the
                  // browser moves on to the field after it (the panel is portaled
                  // to the end of <body>).
                  if (e.key === 'Tab') {
                    triggerRef.current?.focus();
                    setOpen(false);
                    return;
                  }
                  onKeyDown(e);
                }}
              />
            ) : undefined
          }
        >
          {visible.length === 0
            ? ((typeof emptyContent === 'function'
                ? emptyContent(() => setOpen(false))
                : emptyContent) ?? <div className="sikat-dropdown__empty">No results</div>)
            : visible.map((oi, i) => {
                const o = options[oi];
                return (
                  <DropdownItem
                    key={o.value}
                    id={getItemId(i)}
                    selected={o.value === selected}
                    active={i === activeIndex}
                    disabled={o.disabled}
                    prefix={o.prefix}
                    suffix={o.suffix}
                    subLabel={o.subLabel}
                    subLabelPlacement={o.subLabelPlacement}
                    description={o.description}
                    onSelect={() => selectAt(i)}
                  >
                    {o.label ?? optionText(o)}
                  </DropdownItem>
                );
              })}
          {footer}
        </Dropdown>
      ) : null}
    </div>
  );
}
