import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type LabelHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
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
      className={cn('jspr-field jspr-field--shell', className)}
      data-size={state.size}
      data-filled={state.filled || undefined}
      data-disabled={state.disabled || undefined}
      data-readonly={state.readOnly || undefined}
      data-invalid={state.invalid || undefined}
      data-state={state.dataState}
      onClick={onClick}
    >
      {leadingIcon ? <span className="jspr-field__icon">{leadingIcon}</span> : null}
      {prefix != null ? <span className="jspr-field__affix">{prefix}</span> : null}
      {before}
      {children}
      {suffix != null ? <span className="jspr-field__affix">{suffix}</span> : null}
      {trailingIcon ? <span className="jspr-field__icon">{trailingIcon}</span> : null}
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
        <span className="jspr-field__edit" aria-hidden="true">
          {EditIcon}
        </span>
      }
    >
      <input
        className="jspr-field__input"
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
    <label className={cn('jspr-field__label', className)} {...rest}>
      {children}
      {required ? <span className="jspr-field__required"> *</span> : null}
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
    <div className={cn('jspr-field-group', className)} data-orientation={orientation}>
      {label ? (
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      ) : null}
      <div className="jspr-field__fieldset">
        {children({
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : undefined,
          invalid: !!error,
        })}
        {error ? (
          <p id={errorId} className="jspr-field__error">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="jspr-field__hint">
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
      className={cn('jspr-field jspr-field--multiline', className)}
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

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'prefix'>, FieldAdornments {
  size?: FieldSize;
  invalid?: boolean;
  /** Figma Select has no read-only state of its own; mirrors Text Field's. */
  readOnly?: boolean;
}

/**
 * Select — a themed native select (Figma Select) with a trailing chevron. Pass
 * <option>s as children; an empty-valued first option acts as the placeholder.
 * Optional `leadingIcon` / `prefix` / `suffix` / `trailingIcon`. `className`
 * goes on the field box; the rest of the props go on the `<select>`.
 */
export function Select({
  size = 'md',
  invalid,
  readOnly,
  className,
  children,
  value,
  defaultValue,
  onChange,
  leadingIcon,
  prefix,
  suffix,
  trailingIcon,
  ...rest
}: SelectProps) {
  const [filled, track] = useFilled(value, defaultValue);
  const [dataState, selectProps] = takeDataState(rest);
  return (
    <FieldShell
      className={cn('jspr-field--select', className)}
      state={{ size, filled, disabled: selectProps.disabled, readOnly, invalid, dataState }}
      adornments={{ leadingIcon, prefix, suffix, trailingIcon }}
      after={
        <span className="jspr-field__icon jspr-field__chevron" aria-hidden="true">
          {ChevronDown}
        </span>
      }
    >
      <select
        className="jspr-field__input"
        aria-invalid={invalid || undefined}
        aria-readonly={readOnly || undefined}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          track(e.currentTarget.value);
          onChange?.(e);
        }}
        {...selectProps}
      >
        {children}
      </select>
    </FieldShell>
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
