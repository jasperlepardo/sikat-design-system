// Base Design System — public entry.
// Importing this module also injects the compiled CSS (tokens + utilities).
import './styles/tailwind.css';

export { Button, buttonIntents, buttonStyles, buttonSizes } from './components/Button/Button';
export type {
  ButtonProps,
  ButtonIntent,
  ButtonStyle,
  ButtonSize,
} from './components/Button/Button';

export { Text, textVariants } from './components/Text/Text';
export type { TextProps, TextVariant, TextWeight, TextTone } from './components/Text/Text';

export { Icon } from './components/Icon/Icon';
export type { IconProps } from './components/Icon/Icon';

export { DecorativeIcon, decorativeIconVariants } from './components/DecorativeIcon/DecorativeIcon';
export type { DecorativeIconProps, DecorativeIconVariant } from './components/DecorativeIcon/DecorativeIcon';

export { Link, linkIntents } from './components/Button/Link';
export type { LinkProps, LinkIntent } from './components/Button/Link';

export { Badge, badgeIntents, badgeStyles, badgeSizes } from './components/Badge/Badge';
export type { BadgeProps, BadgeIntent, BadgeStyle, BadgeSize } from './components/Badge/Badge';
export { BadgeCounter, badgeCounterIntents, badgeCounterStyles } from './components/Badge/Badge';
export type { BadgeCounterProps, BadgeCounterIntent, BadgeCounterStyle } from './components/Badge/Badge';

export { Card } from './components/Card/Card';
export type { CardProps, CardSlotProps, CardHeaderProps } from './components/Card/Card';

export { Panel } from './components/Panel/Panel';
export type { PanelProps, PanelSlotProps } from './components/Panel/Panel';


export { Alert, alertIntents, alertStyles } from './components/Alert/Alert';
export type {
  AlertProps,
  AlertIntent,
  AlertStyle,
  AlertRootProps,
  AlertIconProps,
  AlertSlotProps,
  AlertActionProps,
  AlertCloseProps,
} from './components/Alert/Alert';

export {
  IconButton,
  iconButtonIntents,
  iconButtonStyles,
  iconButtonSizes,
} from './components/Button/IconButton';
export type {
  IconButtonProps,
  IconButtonIntent,
  IconButtonStyle,
  IconButtonSize,
} from './components/Button/IconButton';

export { Divider } from './components/Divider/Divider';
export type { DividerProps } from './components/Divider/Divider';

export {
  ButtonGroup,
  buttonGroupOrientations,
  buttonGroupAligns,
} from './components/Button/ButtonGroup';
export type {
  ButtonGroupProps,
  ButtonGroupOrientation,
  ButtonGroupAlign,
} from './components/Button/ButtonGroup';

export {
  TextField,
  Textarea,
  Select,
  Checkbox,
  Radio,
  FormField,
  FormLabel,
} from './components/Field/Field';
export type {
  TextFieldProps,
  TextareaProps,
  SelectProps,
  SelectOption,
  CheckboxProps,
  RadioProps,
  FormFieldProps,
  FormLabelProps,
} from './components/Field/Field';

export { Navbar, navbarTypes } from './components/Navbar/Navbar';
export type { NavbarProps, NavbarType, NavbarMenuItem } from './components/Navbar/Navbar';

export { SideNav, SideNavIcon, sideNavOrientations } from './components/SideNav/SideNav';
export type {
  SideNavProps,
  SideNavItem,
  SideNavSection,
  SideNavOrientation,
} from './components/SideNav/SideNav';

export { Tabs, tabsVariants } from './components/Tabs/Tabs';
export type { TabsProps, TabItem, TabsVariant } from './components/Tabs/Tabs';

export {
  PanelHeader,
  panelHeaderIcons,
  panelHeaderTypes,
} from './components/Panel/PanelHeader';
export type { PanelHeaderProps, PanelHeaderType } from './components/Panel/PanelHeader';

export { Table } from './components/Table/Table';
export {
  TableLink,
  TableMedia,
  TableSubcontent,
  TableUser,
  TableStatus,
  TableAmount,
  TableActions,
  TableDragHandle,
  TableExpand,
} from './components/Table/TableCells';
export type {
  TableProps,
  TableColumn,
  TableSort,
  TableSortDirection,
  TablePagination,
} from './components/Table/Table';

export { Page } from './components/Page/Page';
export type { PageProps } from './components/Page/Page';

export {
  Section,
  Row,
  Column,
  sectionPaddingY,
  columnVariants,
} from './components/Section/Section';
export type {
  SectionProps,
  SectionContainerProps,
  RowProps,
  ColumnProps,
  SectionPaddingY,
  ColumnVariant,
} from './components/Section/Section';

export { Form } from './components/Form/Form';
export type {
  FormProps,
  FormSectionProps,
  FormFieldsetProps,
  FormHeaderProps,
  FormGroupProps,
  FormHeadingLevel,
} from './components/Form/Form';

export { Image, imageRatios } from './components/Image/Image';
export type { ImageProps, ImageRatio } from './components/Image/Image';

export { OTP } from './components/OTP/OTP';
export type { OTPProps } from './components/OTP/OTP';

export { Dropdown, DropdownItem } from './components/Dropdown/Dropdown';
export type { DropdownProps, DropdownItemProps } from './components/Dropdown/Dropdown';

export { Combobox } from './components/Field/Combobox';
export type { ComboboxProps, ComboboxOption } from './components/Field/Combobox';

export { MultiSelect } from './components/Field/MultiSelect';
export type { MultiSelectProps, MultiSelectOption } from './components/Field/MultiSelect';

export { Autocomplete } from './components/Field/Autocomplete';
export type {
  AutocompleteProps,
  AutocompleteSuggestion,
} from './components/Field/Autocomplete';

export { DatePicker } from './components/Field/DatePicker';
export type { DatePickerProps } from './components/Field/DatePicker';

export { Footer } from './components/Footer/Footer';
export type { FooterProps, FooterContainerProps } from './components/Footer/Footer';

export { useDropdown } from './lib/useDropdown';
export { useListbox } from './lib/useListbox';
export type { UseListboxOptions, UseListboxResult } from './lib/useListbox';

export { List, ListGroup, ListItem, listVariants } from './components/List/List';
export type {
  ListProps,
  ListGroupProps,
  ListItemProps,
  ListContentProps,
  ListSlotProps,
  ListSectionProps,
  ListHeaderProps,
  ListVariant,
  ListHeadingLevel,
} from './components/List/List';

export { cn } from './lib/cn';
export type { ClassValue } from './lib/cn';

export {
  getThemeMode,
  setThemeMode,
  initTheme,
  resolveTheme,
  useTheme,
  themeScript,
  THEME_STORAGE_KEY,
} from './lib/theme';
export type { ThemeMode } from './lib/theme';

export * from './tokens';
