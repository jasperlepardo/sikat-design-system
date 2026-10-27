import { TextField } from './TextField';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Combobox } from './Combobox';
import { MultiSelect } from './MultiSelect';
import { DatePicker } from './DatePicker';
import { Autocomplete } from './Autocomplete';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Toggle } from './Toggle';
import { CardField } from './CardField';
import { AffixSelect } from './AffixSelect';
import { ReadOnly } from './ReadOnly';
import { FormLabel } from './FormLabel';
import { FormField } from './FormField';

export { fieldSizes } from './FieldShell';
export type { FieldSize, FieldAdornments, AdornmentAlign } from './FieldShell';
export type { FieldOption } from './options';

export { TextField };
export type { TextFieldProps } from './TextField';

export { ReadOnly };
export type { ReadOnlyProps } from './ReadOnly';

export { FormLabel };
export type { FormLabelProps } from './FormLabel';

export { FormField };
export type { FormFieldProps } from './FormField';

export { Textarea };
export type { TextareaProps } from './Textarea';

export { Select };
export type { SelectProps, SelectOption } from './Select';

export { Checkbox };
export type { CheckboxProps } from './Checkbox';

export { Radio };
export type { RadioProps } from './Radio';

export { Toggle, toggleShapes } from './Toggle';
export type { ToggleProps, ToggleShape } from './Toggle';

export { Combobox };
export type { ComboboxProps, ComboboxOption } from './Combobox';

export { MultiSelect };
export type { MultiSelectProps, MultiSelectOption } from './MultiSelect';

export { DatePicker };
export type { DatePickerProps } from './DatePicker';
export { DateFormatProvider, useDateFormat } from './DateFormat';
export type { DateFormatter, DateFormatProviderProps } from './DateFormat';

export { Autocomplete };
export type { AutocompleteProps, AutocompleteSuggestion } from './Autocomplete';

export { CardField };
export type { CardFieldProps, CardFieldOption } from './CardField';

export { AffixSelect };
export type { AffixSelectProps, AffixSelectOption } from './AffixSelect';

/** Namespace for all field controls. Use standalone named imports or access via `Field.*`. */
export const Field = {
  Text: TextField,
  Textarea,
  Select,
  Combobox,
  MultiSelect,
  DatePicker,
  Autocomplete,
  Checkbox,
  Radio,
  Toggle,
  Card: CardField,
  AffixSelect,
  ReadOnly,
  Label: FormLabel,
  Group: FormField,
} as const;
