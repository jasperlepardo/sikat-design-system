import { useContext, useId, type ReactNode } from 'react';
import { IconButton } from '../Button/IconButton';
import { Link } from '../Button/Link';
import { Icon } from '../Icon/Icon';
import { List } from '../List/List';
import { Combobox, type ComboboxOption } from './Combobox';
import { FormLabel } from './FormLabel';
import { type ListCardField } from '../List/List';
import { FieldOrientationCtx } from '../Form/fields';

export interface CardFieldOption {
  value: string;
  label: string;
  icon?: ReactNode;
  fields?: ListCardField[];
  /** When set, the selected card's title renders as a `Link` to this URL. */
  href?: string;
}

export interface CardFieldProps {
  options: CardFieldOption[];
  /** The currently selected value. Empty string or undefined = nothing selected. */
  value?: string;
  /** Called with the picked value, or '' when the selection is cleared. */
  onValueChange?: (value: string) => void;
  /** Label rendered above the field using `FormLabel`. */
  label?: ReactNode;
  /** Adds the required marker (*) to the label. */
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /**
   * Always shown at the bottom of the open dropdown (e.g. a "+ New address"
   * button). Passed straight through to `Combobox.footer`.
   */
  footer?: ReactNode;
  /**
   * When provided, a pencil action appears on the selected card. Use it to
   * open a side panel for freeform editing of the address text.
   */
  onEdit?: () => void;
  /** Accessible label for the edit action. Defaults to "Edit". */
  editLabel?: string;
  /** Icon for the edit action. Defaults to `<Icon size={16}>edit</Icon>`. */
  editIcon?: ReactNode;
  /**
   * Shown after the selected card's title. Defaults to a check icon; pass
   * `null` to hide it.
   */
  badge?: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

function toComboboxOption(opt: CardFieldOption): ComboboxOption {
  const address =
    opt.fields
      ?.map((f) => (Array.isArray(f.value) ? f.value.join(' ') : String(f.value)))
      .filter(Boolean)
      .join(', ') ?? '';
  return { value: opt.value, label: opt.label, description: address || undefined };
}

/**
 * CardField — when a value is selected, shows a `List.Card` with full detail
 * and a clear (✕) action. When empty, shows a standard `Combobox` whose
 * dropdown options are multiline (name + full address). Picking an option
 * switches to the card view; clearing the card switches back to the combobox.
 */
export function CardField({
  options,
  value,
  onValueChange,
  label,
  required,
  placeholder = 'Select…',
  disabled,
  readOnly,
  footer,
  onEdit,
  editLabel = 'Edit',
  editIcon = <Icon size={16}>edit</Icon>,
  badge = <Icon size={12}>check</Icon>,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: CardFieldProps) {
  const comboboxId = useId();
  const orientation = useContext(FieldOrientationCtx) ?? 'horizontal';
  const selected = value ? (options.find((o) => o.value === value) ?? null) : null;
  const interactive = !disabled && !readOnly;

  const labelEl =
    label != null ? (
      <FormLabel
        htmlFor={selected ? undefined : comboboxId}
        required={required}
        disabled={disabled}
      >
        {label}
      </FormLabel>
    ) : null;

  const content = selected ? (
    <List.Group>
      <List.Card
        title={selected.href ? <Link href={selected.href}>{selected.label}</Link> : selected.label}
        icon={selected.icon}
        badge={badge}
        fields={selected.fields}
        data-selected
        actions={
          interactive ? (
            <div style={{ display: 'flex', gap: 'var(--spacing-1, 4px)' }}>
              {onEdit ? (
                <IconButton
                  type="button"
                  label={editLabel}
                  intent="default"
                  variant="link"
                  size="extra-small"
                  onClick={onEdit}
                >
                  {editIcon}
                </IconButton>
              ) : null}
              <IconButton
                type="button"
                label="Clear selection"
                intent="default"
                variant="link"
                size="extra-small"
                onClick={() => onValueChange?.('')}
              >
                <Icon size={16}>close</Icon>
              </IconButton>
            </div>
          ) : undefined
        }
      />
    </List.Group>
  ) : (
    <Combobox
      id={comboboxId}
      aria-label={label == null ? ariaLabel : undefined}
      aria-labelledby={label == null ? ariaLabelledby : undefined}
      aria-describedby={ariaDescribedby}
      options={options.map(toComboboxOption)}
      value={null}
      onValueChange={(v) => {
        if (v) onValueChange?.(v);
      }}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      footer={footer}
    />
  );

  if (!labelEl) return content;

  return (
    <div className="sikat-field-group" data-orientation={orientation}>
      {labelEl}
      {content}
    </div>
  );
}
