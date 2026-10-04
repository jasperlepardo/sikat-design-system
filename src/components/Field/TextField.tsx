import { forwardRef, useRef, useState, type InputHTMLAttributes } from 'react';
import { Icon } from '../Icon/Icon';
import {
  FieldShell,
  useFilled,
  takeDataState,
  type FieldAdornments,
  type FieldSize,
} from './FieldShell';

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
 * a trailing edit (pencil) icon. A `suffix` (e.g. a unit) sits right after the
 * value — the input is as wide as its text — while trailing icons stay at the
 * right edge. `className` goes on the field box; the rest of the props go on
 * the `<input>`.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
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
  },
  ref,
) {
  const [filled, track, text] = useFilled(value, defaultValue);
  const [dataState, inputProps] = takeDataState(rest);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // A number input hides its text while it isn't a valid number yet ("-",
  // "1e") — `value` reads "". Those states add a character or two to the last
  // valid text, so size for that plus two digits instead of collapsing.
  const [badInput, setBadInput] = useState(false);
  const autosizeText = badInput ? `${text}00` : text || inputProps.placeholder || '';

  const input = (
    <input
      ref={(node) => {
        inputRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className="sikat-field__input"
      aria-invalid={invalid || undefined}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => {
        if (!e.currentTarget.validity.badInput) track(e.currentTarget.value);
        onChange?.(e);
      }}
      {...inputProps}
      onInput={(e) => {
        setBadInput(e.currentTarget.validity.badInput);
        inputProps.onInput?.(e);
      }}
    />
  );

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
      adornments={{ leadingIcon, prefix, trailingIcon }}
      onClick={
        suffix != null
          ? () => {
              if (document.activeElement !== inputRef.current) inputRef.current?.focus();
            }
          : undefined
      }
      after={
        <span className="sikat-field__edit" aria-hidden="true">
          <Icon size={20}>edit</Icon>
        </span>
      }
    >
      {suffix != null ? (
        <span className="sikat-field__value">
          <span className="sikat-field__autosize" data-value={autosizeText}>
            {input}
          </span>
          <span className="sikat-field__affix sikat-field__affix--suffix">{suffix}</span>
        </span>
      ) : (
        input
      )}
    </FieldShell>
  );
});
