/**
 * Internal building blocks shared across field controls.
 * Not part of the public package API — import from here within the Field folder only.
 */
import { createContext, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../Button/IconButton';
import { fieldSizes, type FieldSize } from '../../tokens/generated/field.manifest';
import '../../styles/components/field.css';
import './field.css';

export { fieldSizes };
export type { FieldSize };

/**
 * Vertical placement of a leading/trailing adornment within the field.
 * `center` (default), `top`, or `bottom`. The adornment keeps whatever size it
 * declares; when it's taller than a standard row the field grows to contain it,
 * keeping its block padding — alignment then positions it within that height.
 */
export type AdornmentAlign = 'top' | 'center' | 'bottom';

export interface FieldAdornments {
  /**
   * Leading adornment. A plain `<Icon>` renders at fg/quarternary; you can also
   * pass a `<DecorativeIcon>`, an avatar/`<Image>`, or any node — size it on the
   * node itself (the slot no longer forces a glyph size).
   */
  leadingIcon?: ReactNode;
  /** Text before the value (text/caption), e.g. a currency or protocol. */
  prefix?: ReactNode;
  /** Text after the value (text/caption), e.g. a unit or domain. */
  suffix?: ReactNode;
  /** Trailing adornment — same accepted content as `leadingIcon`. */
  trailingIcon?: ReactNode;
  /** Vertical alignment of the leading adornment. Default `center`. */
  leadingAlign?: AdornmentAlign;
  /** Vertical alignment of the trailing adornment. Default `center`. */
  trailingAlign?: AdornmentAlign;
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

/** The enclosing field's state, for interactive adornments (e.g. AffixSelect). */
export const FieldStateContext = createContext<{ disabled?: boolean; readOnly?: boolean }>({});

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
  const { leadingIcon, prefix, suffix, trailingIcon, leadingAlign, trailingAlign } = adornments;
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
      <FieldStateContext.Provider value={{ disabled: state.disabled, readOnly: state.readOnly }}>
        {leadingIcon ? (
          <span className="sikat-field__icon sikat-field__icon--leading" data-align={leadingAlign}>
            {leadingIcon}
          </span>
        ) : null}
        {prefix != null ? (
          <span className="sikat-field__affix sikat-field__affix--prefix">{prefix}</span>
        ) : null}
        {before}
        {children}
        {suffix != null ? (
          <span className="sikat-field__affix sikat-field__affix--suffix">{suffix}</span>
        ) : null}
        {trailingIcon ? (
          <span
            className="sikat-field__icon sikat-field__icon--trailing"
            data-align={trailingAlign}
          >
            {trailingIcon}
          </span>
        ) : null}
        {after}
      </FieldStateContext.Provider>
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

/**
 * The ✕ that clears a field (`clearable` Select / Combobox, CardField, search
 * boxes): a 2xs link IconButton. The wrapper only reveals it on hover / focus;
 * pass `reveal={false}` when a parent (CardField's actions) already does that.
 */
export function FieldClear({
  onClear,
  label = 'Clear selection',
  reveal = true,
}: {
  onClear: () => void;
  label?: string;
  reveal?: boolean;
}) {
  const button = (
    <IconButton
      label={label}
      intent="default"
      variant="link"
      size="2xs"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    >
      <Icon size={16}>close</Icon>
    </IconButton>
  );
  return reveal ? <span className="sikat-field__clear">{button}</span> : button;
}
