import { Children, isValidElement, useContext, useId, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Link } from '../Button/Link';
import { Icon } from '../Icon/Icon';
import { Combobox, type ComboboxOption } from './Combobox';
import { FormLabel } from './FormLabel';
import { FieldShell, FieldClear, type FieldAdornments, type FieldSize } from './FieldShell';
import { cn } from '../../lib/cn';
import { type ListCardField } from '../List/List';
import { FieldOrientationCtx } from '../Form/fields';
import { Text, type TextProps } from '../Text/Text';

export interface CardFieldOption {
  value: string;
  label: string;
  icon?: ReactNode;
  fields?: ListCardField[];
  /** When set, the selected card's title renders as a `Link` to this URL. */
  href?: string;
  /**
   * Generic multi-level text stack, mirroring Table's `TableContent.texts`. Each
   * item renders as `<Text as="span">`. When set, it drives both the selected
   * view and the dropdown row, replacing the derived `label` + address lines
   * (`label` is still used for type-ahead/filtering; the option `href` is
   * ignored — wrap a level's children in `<Link>` yourself for a linked title).
   * A `<Link>`/`<Button>` renders as a real control in the selected view but is
   * flattened to plain text in dropdown rows, since the row itself is the
   * selector. In the selected view the `badge` appends to the first line.
   */
  texts?: TextProps[];
}

export interface CardFieldProps extends FieldAdornments {
  options: CardFieldOption[];
  /** The currently selected value. Empty string or undefined = nothing selected. */
  value?: string;
  /** Called with the picked value, or '' when the selection is cleared. */
  onValueChange?: (value: string) => void;
  /** Label rendered above the field using `FormLabel`. */
  label?: ReactNode;
  /** Muted text after the label (Figma "Sub Label"), e.g. "(optional)". */
  subLabel?: ReactNode;
  /** Info tooltip / lock reason — see FormLabel. */
  tooltip?: ReactNode;
  /** Adds the required marker (*) to the label. */
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  size?: FieldSize;
  /**
   * Always shown at the bottom of the open dropdown (e.g. a "+ New address"
   * button). Passed straight through to `Combobox.footer`.
   */
  footer?: ReactNode;
  /**
   * When provided, a pencil action appears on the selected view. Use it to
   * open a side panel for freeform editing of the selected value.
   */
  onEdit?: () => void;
  /** Accessible label for the edit action. Defaults to "Edit". */
  editLabel?: string;
  /** Icon for the edit action. Defaults to `<Icon size={16}>edit</Icon>`. */
  editIcon?: ReactNode;
  /**
   * Optional node shown inline after the selected value's label (e.g. a check
   * icon). Nothing is shown by default.
   */
  badge?: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/**
 * Unwrap `<Link>` / `<Button>` nodes to their children so a `texts` level that
 * renders a real link in the selected view shows as plain text in a dropdown
 * row — the row is already the selector (`role="option"`), so a nested
 * interactive link would hijack the click.
 */
function stripInteractive(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (isValidElement(child) && (child.type === Link || child.type === Button)) {
      return stripInteractive((child.props as { children?: ReactNode }).children);
    }
    return child;
  });
}

function toComboboxOption(opt: CardFieldOption): ComboboxOption {
  // When an option supplies a `texts` stack, mirror the selected view in the
  // dropdown row: render the levels as a column of `<Text>`. `text` keeps the
  // plain label for type-ahead + filtering since `label` is now a node.
  if (opt.texts && opt.texts.length > 0) {
    return {
      value: opt.value,
      text: opt.label,
      icon: opt.icon,
      label: (
        <span className="sikat-field__multiline">
          {opt.texts.map(({ children, ...rest }, i) => (
            <Text key={i} as="span" {...rest}>
              {stripInteractive(children)}
            </Text>
          ))}
        </span>
      ),
    };
  }
  const address =
    opt.fields
      ?.map((f) => (Array.isArray(f.value) ? f.value.join(' ') : String(f.value)))
      .filter(Boolean)
      .join(', ') ?? '';
  return {
    value: opt.value,
    label: opt.label,
    icon: opt.icon,
    description: address || undefined,
  };
}

/**
 * CardField — when a value is selected, shows a `FieldShell` with the selected
 * option's name (and address summary if `fields` are provided). When empty,
 * shows a `Combobox` whose dropdown options are multiline (name + address).
 * Picking an option switches to the filled view; clearing switches back.
 *
 * Supports all standard field chrome: label, subLabel, tooltip, hint, error,
 * required, disabled, readOnly, size, leadingIcon, prefix, suffix, trailingIcon.
 */
export function CardField({
  options,
  value,
  onValueChange,
  label,
  subLabel,
  tooltip,
  required,
  placeholder = 'Select…',
  disabled,
  readOnly,
  hint,
  error,
  size = 'md',
  footer,
  onEdit,
  editLabel = 'Edit',
  editIcon = <Icon size={16}>edit</Icon>,
  badge,
  className,
  id: idProp,
  leadingIcon,
  prefix,
  suffix,
  trailingIcon,
  leadingAlign,
  trailingAlign,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: CardFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const orientation = useContext(FieldOrientationCtx) ?? 'horizontal';
  const selected = value ? (options.find((o) => o.value === value) ?? null) : null;
  const interactive = !disabled && !readOnly;

  const describedBy =
    [hint ? hintId : undefined, error ? errorId : undefined, ariaDescribedby]
      .filter(Boolean)
      .join(' ') || undefined;

  const addressDesc = selected?.fields
    ?.map((f) => (Array.isArray(f.value) ? f.value.join(' ') : String(f.value)))
    .filter(Boolean)
    .join(', ');

  const content = selected ? (
    <FieldShell
      state={{
        size,
        filled: true,
        disabled,
        readOnly,
        invalid: !!error,
      }}
      adornments={{
        leadingIcon: selected.icon ?? leadingIcon,
        prefix,
        suffix,
        trailingIcon,
        leadingAlign,
        trailingAlign,
      }}
      after={
        interactive ? (
          <span className="sikat-field__actions">
            {onEdit ? (
              <IconButton
                type="button"
                label={editLabel}
                intent="default"
                variant="link"
                size="2xs"
                onClick={onEdit}
              >
                {editIcon}
              </IconButton>
            ) : null}
            <FieldClear reveal={false} onClear={() => onValueChange?.('')} />
          </span>
        ) : undefined
      }
    >
      <span className="sikat-field__display">
        {selected.texts && selected.texts.length > 0 ? (
          <span className="sikat-field__multiline">
            {selected.texts.map(({ children: textChildren, ...textRest }, i) => (
              <Text key={i} as="span" {...textRest}>
                {textChildren}
                {i === 0 && badge != null ? badge : null}
              </Text>
            ))}
          </span>
        ) : addressDesc ? (
          <span className="sikat-field__multiline">
            {/* Keeps the name (and badge) on one line, and the link only as wide
                as its text — the column would otherwise stretch it. */}
            <span className="sikat-field__title">
              {selected.href ? <Link href={selected.href}>{selected.label}</Link> : selected.label}
              {badge != null ? badge : null}
            </span>
            <span className="sikat-field__description">{addressDesc}</span>
          </span>
        ) : (
          <>
            {selected.href ? <Link href={selected.href}>{selected.label}</Link> : selected.label}
            {badge != null ? badge : null}
          </>
        )}
      </span>
    </FieldShell>
  ) : (
    <Combobox
      id={id}
      aria-label={label == null ? ariaLabel : undefined}
      aria-labelledby={label == null ? ariaLabelledby : undefined}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      options={options.map(toComboboxOption)}
      value={null}
      onValueChange={(v) => {
        if (v) onValueChange?.(v);
      }}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      invalid={!!error}
      size={size}
      leadingIcon={leadingIcon}
      prefix={prefix}
      suffix={suffix}
      trailingIcon={trailingIcon}
      leadingAlign={leadingAlign}
      trailingAlign={trailingAlign}
      footer={footer}
    />
  );

  const labelEl =
    label != null ? (
      <FormLabel
        htmlFor={selected ? undefined : id}
        required={required}
        subLabel={subLabel}
        tooltip={tooltip}
        disabled={disabled}
      >
        {label}
      </FormLabel>
    ) : null;

  return (
    <div className={cn('sikat-field-group', className)} data-orientation={orientation}>
      {labelEl}
      <div className="sikat-field__fieldset">
        {content}
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
