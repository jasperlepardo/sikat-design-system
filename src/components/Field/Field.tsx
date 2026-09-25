import {
  Children,
  isValidElement,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type LabelHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactElement,
  type OptionHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { fieldSizes, type FieldSize } from '../../tokens/generated/field.manifest';
import '../../styles/components/field.css'; // generated colors + sizing vars
import './field.css'; // structure

export { fieldSizes };
export type { FieldSize };

/* ------------------------------------------------------------- field shell */

/**
 * Figma's Text Field / Select / Multi Select anatomy — the adornments shared by
 * the shell-based controls: `leadingIcon`, `prefix`, `suffix`, `trailingIcon`
 * (Figma: Show Leading Icon / Prefix / Suffix / Show Trailing Icon).
 */
export interface FieldAdornments {
  /** Leading icon (20px, fg/quarternary). */
  leadingIcon?: ReactNode;
  /** Text before the value (text/caption), e.g. a currency or protocol. */
  prefix?: ReactNode;
  /** Text after the value (text/caption), e.g. a unit or domain. */
  suffix?: ReactNode;
  /** Trailing icon (20px, fg/quarternary). */
  trailingIcon?: ReactNode;
}

export type ShellState = {
  size: FieldSize;
  filled: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  /** Story/docs hook: force the Figma "Hover" look (`data-state="hover"`). */
  dataState?: string;
};

/**
 * Box that carries the field styling + state; the native control sits inside.
 * Internal building block (TextField / Select / MultiSelect) — not a public API.
 */
export function FieldShell({
  className,
  state,
  adornments,
  before,
  after,
  onClick,
  children,
}: {
  className?: string;
  onClick?: () => void;
  state: ShellState;
  adornments: FieldAdornments;
  before?: ReactNode;
  after?: ReactNode;
  children: ReactNode;
}) {
  const { leadingIcon, prefix, suffix, trailingIcon } = adornments;
  return (
    <span
      className={cn('sikat-field sikat-field--shell', className)}
      data-size={state.size}
      data-filled={state.filled || undefined}
      data-disabled={state.disabled || undefined}
      data-readonly={state.readOnly || undefined}
      data-invalid={state.invalid || undefined}
      data-state={state.dataState}
      onClick={onClick}
    >
      {leadingIcon ? <span className="sikat-field__icon">{leadingIcon}</span> : null}
      {prefix != null ? <span className="sikat-field__affix">{prefix}</span> : null}
      {before}
      {children}
      {suffix != null ? <span className="sikat-field__affix">{suffix}</span> : null}
      {trailingIcon ? <span className="sikat-field__icon">{trailingIcon}</span> : null}
      {after}
    </span>
  );
}

/** Tracks "has content" for a controlled or uncontrolled control. */
function useFilled(value: unknown, defaultValue: unknown) {
  const [hasText, setHasText] = useState(() => String(defaultValue ?? '') !== '');
  const filled = value !== undefined ? String(value) !== '' : hasText;
  const track = (next: string) => {
    if (value === undefined) setHasText(next !== '');
  };
  return [filled, track] as const;
}

/** Pulls the story-only `data-state` attribute off the rest props. */
function takeDataState<T extends object>(rest: T) {
  const { 'data-state': dataState, ...others } = rest as T & { 'data-state'?: string };
  return [dataState, others as T] as const;
}

const EditIcon = (
  <Icon size={20}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Icon>
);

export const ChevronDown = (
  <Icon size={20}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

/* ---------------------------------------------------------------- TextField */

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>, FieldAdornments {
  size?: FieldSize;
  invalid?: boolean;
}

/**
 * TextField — a themed text input (Figma Text Field). Use standalone or inside
 * <FormField>. Optional `leadingIcon` / `prefix` / `suffix` / `trailingIcon`.
 * Tracks whether it has content (`data-filled`, controlled or not) for Figma's
 * "has Content" states: primary border at rest, and on hover a tertiary fill with
 * a trailing edit (pencil) icon. `className` goes on the field box; the rest of
 * the props go on the `<input>`.
 */
export function TextField({
  size = 'md',
  invalid,
  className,
  value,
  defaultValue,
  onChange,
  leadingIcon,
  prefix,
  suffix,
  trailingIcon,
  ...rest
}: TextFieldProps) {
  const [filled, track] = useFilled(value, defaultValue);
  const [dataState, inputProps] = takeDataState(rest);
  return (
    <FieldShell
      className={className}
      state={{
        size,
        filled,
        disabled: inputProps.disabled,
        readOnly: inputProps.readOnly,
        invalid,
        dataState,
      }}
      adornments={{ leadingIcon, prefix, suffix, trailingIcon }}
      after={
        <span className="sikat-field__edit" aria-hidden="true">
          {EditIcon}
        </span>
      }
    >
      <input
        className="sikat-field__input"
        aria-invalid={invalid || undefined}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          track(e.currentTarget.value);
          onChange?.(e);
        }}
        {...inputProps}
      />
    </FieldShell>
  );
}

/* ----------------------------------------------------------------- FormLabel */

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children?: ReactNode;
}

export function FormLabel({ required, className, children, ...rest }: FormLabelProps) {
  return (
    <label className={cn('sikat-field__label', className)} {...rest}>
      {children}
      {required ? <span className="sikat-field__required"> *</span> : null}
    </label>
  );
}

/* ----------------------------------------------------------------- FormField */

export interface FormFieldProps {
  /**
   * Figma "Orientation": `horizontal` (default) stacks the label above the
   * control; `vertical` puts the label in a fixed 200px column beside it.
   */
  orientation?: 'horizontal' | 'vertical';
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  /** Render-prop receiving the wired a11y props for the control. */
  children: (controlProps: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    invalid?: boolean;
  }) => ReactNode;
}

/**
 * FormField — composes a label, control, and hint/error text, wiring `id`,
 * `aria-describedby`, and `aria-invalid` for you via a render prop.
 */
export function FormField({
  orientation = 'horizontal',
  label,
  hint,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = cn(hint ? hintId : undefined, error ? errorId : undefined) || undefined;

  return (
    <div className={cn('sikat-field-group', className)} data-orientation={orientation}>
      {label ? (
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      ) : null}
      <div className="sikat-field__fieldset">
        {children({
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : undefined,
          invalid: !!error,
        })}
        {error ? (
          <p id={errorId} className="sikat-field__error">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="sikat-field__hint">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Textarea */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/**
 * Textarea — a themed multi-line input (Figma Textarea): one line of text with
 * 48px of room below it by default. Use standalone or inside <FormField>.
 */
export function Textarea({
  invalid,
  className,
  rows = 1,
  value,
  defaultValue,
  onChange,
  ...rest
}: TextareaProps) {
  const [filled, track] = useFilled(value, defaultValue);
  return (
    <textarea
      rows={rows}
      className={cn('sikat-field sikat-field--multiline', className)}
      data-size="md"
      data-filled={filled || undefined}
      aria-invalid={invalid || undefined}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => {
        track(e.currentTarget.value);
        onChange?.(e);
      }}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------- Select */

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

/** `<option>` children → options (+ the empty-valued option's text as placeholder). */
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
 * Optional `leadingIcon` / `prefix` / `suffix` / `trailingIcon`. `className` goes
 * on the field box; `id` / `aria-*` go on the trigger (FormField-compatible).
 */
export function Select({
  options: optionsProp,
  children,
  value,
  defaultValue,
  onValueChange,
  placeholder: placeholderProp,
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
  // Like a native <select>: with no placeholder option and no default, the first
  // enabled option starts selected.
  const [internal, setInternal] = useState(
    () =>
      defaultValue ?? (placeholder == null ? (options.find((o) => !o.disabled)?.value ?? '') : ''),
  );
  const selected = isControlled ? value : internal;
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const { open, setOpen, rootRef } = useDropdown<HTMLDivElement>();
  const interactive = !disabled && !readOnly;

  const selectAt = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    if (!isControlled) setInternal(o.value);
    onValueChange?.(o.value);
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
          <span className="sikat-field__icon sikat-field__chevron" aria-hidden="true">
            {ChevronDown}
          </span>
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
      {open ? (
        <Dropdown id={listId}>
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

/* ----------------------------------------------------------------- Checkbox */

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Inline label rendered after the box. */
  children?: ReactNode;
}

/** Checkbox — a native checkbox with an optional inline label. */
export function Checkbox({ children, className, disabled, ...rest }: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input type="checkbox" disabled={disabled} className="size-4 accent-primary" {...rest} />
      {children != null ? <span className="text-sm text-body">{children}</span> : null}
    </label>
  );
}

/* -------------------------------------------------------------------- Radio */

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Inline label rendered after the dot. */
  children?: ReactNode;
}

/** Radio — a native radio with an optional inline label. */
export function Radio({ children, className, disabled, ...rest }: RadioProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input type="radio" disabled={disabled} className="size-4 accent-primary" {...rest} />
      {children != null ? <span className="text-sm text-body">{children}</span> : null}
    </label>
  );
}
