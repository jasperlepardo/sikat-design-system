/**
 * Internal building blocks shared across field controls.
 * Not part of the public package API — import from here within the Field folder only.
 */
import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { fieldSizes, type FieldSize } from '../../tokens/generated/field.manifest';
import '../../styles/components/field.css';
import './field.css';

export { fieldSizes };
export type { FieldSize };

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

/** Box that carries the field styling + state; the native control sits inside. */
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
      {leadingIcon ? <span className="sikat-field__icon sikat-field__icon--leading">{leadingIcon}</span> : null}
      {prefix != null ? (
        <span className="sikat-field__affix sikat-field__affix--prefix">{prefix}</span>
      ) : null}
      {before}
      {children}
      {suffix != null ? (
        <span className="sikat-field__affix sikat-field__affix--suffix">{suffix}</span>
      ) : null}
      {trailingIcon ? <span className="sikat-field__icon sikat-field__icon--trailing">{trailingIcon}</span> : null}
      {after}
    </span>
  );
}

/** Tracks the text (and so "has content") of a controlled or uncontrolled control. */
export function useFilled(value: unknown, defaultValue: unknown) {
  const [uncontrolled, setUncontrolled] = useState(() => String(defaultValue ?? ''));
  const text = value !== undefined ? String(value ?? '') : uncontrolled;
  const track = (next: string) => {
    if (value === undefined) setUncontrolled(next);
  };
  return [text !== '', track, text] as const;
}

/** Pulls the story-only `data-state` attribute off the rest props. */
export function takeDataState<T extends object>(rest: T) {
  const { 'data-state': dataState, ...others } = rest as T & { 'data-state'?: string };
  return [dataState, others as T] as const;
}

export const ChevronDown = <Icon size={20}>expand_more</Icon>;

/** The small ✕ that `clearable` Select / Combobox show while a value is set. */
export function FieldClear({
  onClear,
  label = 'Clear selection',
}: {
  onClear: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="sikat-field__clear"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    >
      <Icon size={16}>close</Icon>
    </button>
  );
}
