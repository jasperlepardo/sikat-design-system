import { TextField } from './TextField';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Combobox } from './Combobox';
import { MultiSelect } from './MultiSelect';
import { DatePicker } from './DatePicker';
import { Autocomplete } from './Autocomplete';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { CardField } from './CardField';
import { ReadOnly } from './ReadOnly';
import { FormLabel } from './FormLabel';
import { FormField } from './FormField';

export { fieldSizes } from './FieldShell';
export type { FieldSize, FieldAdornments } from './FieldShell';

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

export { Combobox };
export type { ComboboxProps, ComboboxOption } from './Combobox';

export { MultiSelect };
export type { MultiSelectProps, MultiSelectOption } from './MultiSelect';

export { DatePicker };
export type { DatePickerProps } from './DatePicker';

export { Autocomplete };
export type { AutocompleteProps, AutocompleteSuggestion } from './Autocomplete';

export { CardField };
export type { CardFieldProps, CardFieldOption } from './CardField';

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
  Card: CardField,
  ReadOnly,
  Label: FormLabel,
  Group: FormField,
} as const;
