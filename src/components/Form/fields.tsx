import { createContext, useContext, type JSX, type ReactNode } from 'react';
import {
  Checkbox,
  FormField,
  ReadOnly as DSReadOnly,
  Select,
  Textarea,
  TextField,
} from '../Field/Field';
import type { FormFieldProps } from '../Field/Field';
import { Combobox } from '../Field/Combobox';
import { DatePicker } from '../Field/DatePicker';
import { Form } from './Form';

export interface FieldOptions {
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  /** Show lock icon on the label. Defaults to `true` when `disabled` or `readOnly` is set. */
  lock?: boolean;
  type?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Dropdowns: show a ✕ that empties an optional field. */
  clearable?: boolean;
  /** `vertical` puts the label in a column beside the control (the design system's naming); default stacks it above. */
  orientation?: 'horizontal' | 'vertical' | 'responsive';
}

/** Keys of T whose values are V (ignoring undefined). */
export type KeysOf<T, V> = { [K in keyof T]-?: NonNullable<T[K]> extends V ? K : never }[keyof T];

export type Option = { value: string; label: string };

type Orientation = 'horizontal' | 'vertical' | 'responsive';

/**
 * Set by Fields/FieldStack so that bind() fields and CtxFormField inherit the group orientation
 * without needing to pass it on every field individually.
 */
export const FieldOrientationCtx = createContext<Orientation | null>(null);

/** A FormField that inherits orientation from the enclosing Fields/FieldStack context. */
export function CtxFormField(props: FormFieldProps) {
  const ctxO = useContext(FieldOrientationCtx);
  return <FormField {...props} orientation={props.orientation ?? ctxO ?? 'horizontal'} />;
}

function ApplyOrientation({ o, fn }: { o: FieldOptions; fn: (opts: FieldOptions) => JSX.Element }) {
  const ctxO = useContext(FieldOrientationCtx);
  const orientation: Orientation = o.orientation ?? ctxO ?? 'horizontal';
  return fn({ orientation, ...o });
}

const NONE_LABEL = '— None —';
const isNone = (v: string | null | undefined) => !v || v === NONE_LABEL;
const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

/**
 * An optional dropdown clears with the field's ✕ (`clearable`), not a "— None —" option.
 * A "— None —" or blank option still passed in is dropped and makes the field clearable; its
 * wording, if it isn't just "None" (e.g. "Use the rules"), becomes the placeholder.
 */
export function emptyState(
  options: Option[],
  value: string | undefined,
  o: { placeholder?: string; clearable?: boolean },
  fallback: string,
) {
  const none = options.find((opt) => isNone(opt.value));
  const clearable = o.clearable ?? Boolean(none);
  const noneText = none?.label && none.label !== NONE_LABEL ? none.label : 'None';
  return {
    options: options.filter((opt) => !isNone(opt.value)),
    value: isNone(value) ? '' : value!,
    clearable,
    placeholder: o.placeholder ?? (none ? noneText : clearable ? 'None' : fallback),
    display: isNone(value) ? '—' : options.find((opt) => opt.value === value)?.label || '—',
  };
}

/**
 * Field builders bound to one object, so a tab reads as a list of fields:
 * `f.text('name', 'Name', { required: true })`.
 *
 * Returns a `field` helper in addition to the named builders — use it to add
 * custom field types (e.g. a master-data lookup) that reuse the same lock/readOnly
 * logic: `f.field(key, label, o, (p) => <MyControl {...p} />)`.
 *
 * All fields inherit the orientation from the nearest Fields/FieldStack ancestor via
 * FieldOrientationCtx; pass `orientation` in options to override per-field.
 */
export function bind<T>(obj: T, update: (patch: Partial<T>) => void) {
  const patch = (key: keyof T, value: unknown) => update({ [key]: value } as Partial<T>);

  const field = (
    key: keyof T,
    label: ReactNode,
    o: FieldOptions,
    control: (p: object) => ReactNode,
  ): JSX.Element => {
    const render = (opts: FieldOptions): JSX.Element => {
      const showLock = opts.lock ?? (!!opts.disabled || !!opts.readOnly);
      return (
        <FormField
          key={String(key)}
          orientation={opts.orientation}
          label={label}
          required={opts.required}
          disabled={showLock}
          error={opts.error}
          tooltip={opts.hint}
          className={opts.className}
        >
          {(p) => control({ ...p, disabled: opts.disabled })}
        </FormField>
      );
    };
    return <ApplyOrientation o={o} fn={render} />;
  };

  return {
    /** Expose the field helper so callers can build custom field types with the same lock/readOnly logic. */
    field,

    text: (key: KeysOf<T, string>, label: ReactNode, o: FieldOptions = {}) =>
      field(key, label, o, (p) => (
        <TextField
          {...p}
          type={o.type}
          placeholder={o.placeholder}
          readOnly={o.readOnly}
          prefix={o.prefix}
          suffix={o.suffix}
          value={(obj[key] as string | undefined) ?? ''}
          onChange={(e) => patch(key, e.currentTarget.value)}
        />
      )),

    num: (key: KeysOf<T, number>, label: ReactNode, o: FieldOptions = {}) =>
      field(key, label, o, (p) => (
        <TextField
          {...p}
          type="number"
          min={0}
          readOnly={o.readOnly}
          prefix={o.prefix}
          suffix={o.suffix}
          value={String(obj[key] ?? 0)}
          onChange={(e) => patch(key, Number(e.currentTarget.value))}
        />
      )),

    pick: (
      key: KeysOf<T, string>,
      label: ReactNode,
      values: readonly string[],
      o: FieldOptions = {},
    ) => {
      const e = emptyState(toOptions(values), obj[key] as string | undefined, o, 'Select…');
      return field(key, label, o, (p) => (
        <Select
          {...p}
          options={e.options}
          disabled={o.disabled}
          readOnly={o.readOnly}
          placeholder={e.placeholder}
          clearable={e.clearable}
          value={e.value}
          onValueChange={(v) => patch(key, v ?? '')}
        />
      ));
    },

    /** A select whose options show a label but store a value (e.g. a partner id). */
    choose: (key: KeysOf<T, string>, label: ReactNode, options: Option[], o: FieldOptions = {}) => {
      const e = emptyState(options, obj[key] as string | undefined, o, 'Select…');
      return field(key, label, o, (p) => (
        <Select
          {...p}
          options={e.options}
          disabled={o.disabled}
          readOnly={o.readOnly}
          placeholder={e.placeholder}
          clearable={e.clearable}
          value={e.value}
          onValueChange={(v) => patch(key, v ?? '')}
        />
      ));
    },

    /** Like `choose`, but searchable: for options drawn from another table. */
    lookup: (key: KeysOf<T, string>, label: ReactNode, options: Option[], o: FieldOptions = {}) => {
      const e = emptyState(options, obj[key] as string | undefined, o, 'Search…');
      return field(key, label, o, (p) => (
        <Combobox
          {...p}
          options={e.options}
          disabled={o.disabled}
          readOnly={o.readOnly}
          placeholder={e.placeholder}
          clearable={e.clearable}
          value={e.value}
          onValueChange={(v) => patch(key, v ?? '')}
        />
      ));
    },

    date: (key: KeysOf<T, string>, label: ReactNode, o: FieldOptions = {}) =>
      field(key, label, o, (p) => (
        <DatePicker
          {...p}
          readOnly={o.readOnly}
          value={(obj[key] as string | undefined) || null}
          onValueChange={(v) => patch(key, v)}
        />
      )),

    area: (key: KeysOf<T, string>, label: ReactNode, o: FieldOptions & { rows?: number } = {}) =>
      field(key, label, o, (p) => (
        <Textarea
          {...p}
          rows={o.rows ?? 3}
          placeholder={o.placeholder}
          readOnly={o.readOnly}
          value={(obj[key] as string | undefined) ?? ''}
          onChange={(e) => patch(key, e.currentTarget.value)}
        />
      )),

    check: (
      key: KeysOf<T, boolean>,
      label: ReactNode,
      o: { disabled?: boolean; readOnly?: boolean } = {},
    ) => (
      <Checkbox
        key={String(key)}
        checked={Boolean(obj[key])}
        disabled={o.disabled || !!o.readOnly}
        onChange={(e) => patch(key, e.currentTarget.checked)}
      >
        {label}
      </Checkbox>
    ),
  };
}

/** A read-only value shown like a field (system-calculated values). Use inside a field grid. */
export function ReadOnlyField({
  label,
  value,
  hint,
  error,
  subLabel,
  subLabelPlacement,
  description,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  error?: string;
  subLabel?: ReactNode;
  subLabelPlacement?: 'top' | 'inline';
  description?: ReactNode;
}) {
  const ctxO = useContext(FieldOrientationCtx);
  return (
    <FormField
      label={label}
      disabled
      tooltip={hint}
      error={error}
      orientation={ctxO ?? 'horizontal'}
    >
      <DSReadOnly
        value={value}
        subLabel={subLabel}
        subLabelPlacement={subLabelPlacement}
        description={description}
      />
    </FormField>
  );
}

/** Responsive field grid. Fields inside inherit `orientation="horizontal"`. */
export function Fields({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <FieldOrientationCtx.Provider value="horizontal">
      <Form.Group columns={cols}>{children}</Form.Group>
    </FieldOrientationCtx.Provider>
  );
}

/** Side-label field column. Fields inside inherit `orientation="responsive"`. */
export function FieldStack({ children }: { children: ReactNode }) {
  return (
    <FieldOrientationCtx.Provider value="responsive">
      <Form.Group orientation="responsive">{children}</Form.Group>
    </FieldOrientationCtx.Provider>
  );
}

/** A flex row for checkboxes (flags) under a field grid. */
export function Flags({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-x-6 gap-y-3">{children}</div>;
}
