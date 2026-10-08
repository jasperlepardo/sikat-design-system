import { useState, Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { DecorativeIcon, type DecorativeIconVariant } from '../DecorativeIcon/DecorativeIcon';
import { TextField } from '../Field/TextField';
import { FieldClear } from '../Field/FieldShell';
import './panel-header.css';

/** Forces data-size="large" on all direct button children in the panel header. */
function withLargeSize(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child, { size: 'large' } as Record<string, unknown>);
  });
}

export const panelHeaderTypes = ['table', 'forms', 'details'] as const;
export type PanelHeaderType = (typeof panelHeaderTypes)[number];

export const panelHeaderIcons = {
  arrowDownward: <Icon size={20}>arrow_downward</Icon>,
  arrowUpward: <Icon size={20}>arrow_upward</Icon>,
  rotateRight: <Icon size={20}>rotate_right</Icon>,
  keyboardArrowDown: <Icon size={20}>keyboard_arrow_down</Icon>,
};

export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Visual layout: `table` (icon, title + subcopy, tabs), `forms` (single row:
   * prev/next, title + status + icon), or `details` (forms' row plus subcopy and tabs).
   */
  type?: PanelHeaderType;
  /** Page title. */
  title?: ReactNode;
  /** Subcopy below the title (table and details). */
  subcopy?: ReactNode;
  /** Material Symbol name for the leading DecorativeIcon. */
  icon?: string;
  /** DecorativeIcon variant. Default: solid. */
  iconVariant?: DecorativeIconVariant;
  /** DecorativeIcon size in px. Default: 40. */
  iconSize?: number;
  /** Custom leading slot — overrides `icon` when provided. */
  leading?: ReactNode;
  /** Status badge (forms and details). */
  status?: ReactNode;
  /** Icon after the title / status (forms and details). */
  titleIcon?: ReactNode;
  /** Operation icon buttons. */
  operations?: ReactNode;
  /** Core action buttons. */
  actions?: ReactNode;
  /** Tabs below the bar (table and details). */
  tabs?: ReactNode;
  /** Table: show a search field centered between the title and the buttons (3 columns). */
  showSearch?: boolean;
  /** Table: search field placeholder. */
  searchPlaceholder?: string;
  /** Table: accessible name of the search field. Default: "Search". */
  searchLabel?: string;
  /** Table: the search text, for a controlled search. Omit to let the header keep it. */
  searchValue?: string;
  /** Table: search input value changes. */
  onSearchChange?: (value: string) => void;
}

/**
 * PanelHeader — the top header of a `<Panel>`. Combines the decorative icon,
 * page title, subcopy, operation buttons, core actions, and tabs in one component.
 * Mirrors the Figma Header (Components › Headers, set 17447:35967).
 */
export function PanelHeader({
  type = 'table',
  title,
  subcopy,
  icon,
  iconVariant = 'solid',
  iconSize = 40,
  leading,
  status,
  titleIcon,
  operations,
  actions,
  tabs,
  showSearch,
  searchPlaceholder = 'Search',
  searchLabel = 'Search',
  searchValue,
  onSearchChange,
  className,
  ...rest
}: PanelHeaderProps) {
  const isForms = type === 'forms';
  const isDetails = type === 'details';
  const showStatusRow = isForms || isDetails;
  const showSubcopy = !isForms;
  const showTabs = !isForms;
  const hasSearch = type === 'table' && !!showSearch;
  const [ownQuery, setOwnQuery] = useState('');
  const query = searchValue ?? ownQuery;
  const updateQuery = (next: string) => {
    setOwnQuery(next);
    onSearchChange?.(next);
  };
  const leadingContent =
    leading ?? (icon ? <DecorativeIcon variant={iconVariant} icon={icon} size={iconSize} /> : null);

  return (
    <header
      data-type={type}
      data-search={hasSearch || undefined}
      className={cn('sikat-panel-header', className)}
      {...rest}
    >
      <div className="sikat-panel-header__bar">
        <div className="sikat-panel-header__start">
          {leadingContent != null ? (
            <div className="sikat-panel-header__leading">{leadingContent}</div>
          ) : null}
          <div className="sikat-panel-header__titles">
            <div className="sikat-panel-header__title-row">
              {title != null ? <h1 className="sikat-panel-header__title">{title}</h1> : null}
              {showStatusRow && status != null ? status : null}
              {isDetails && titleIcon != null ? (
                <span className="sikat-panel-header__title-icon">{titleIcon}</span>
              ) : null}
            </div>
            {showSubcopy && subcopy != null ? (
              <p className="sikat-panel-header__subcopy">{subcopy}</p>
            ) : null}
          </div>
          {isForms && titleIcon != null ? (
            <span className="sikat-panel-header__title-icon">{titleIcon}</span>
          ) : null}
        </div>
        {hasSearch ? (
          <div className="sikat-panel-header__center">
            <TextField
              className="sikat-panel-header__search"
              size="xl"
              type="search"
              aria-label={searchLabel}
              placeholder={searchPlaceholder}
              leadingIcon={<Icon size={20}>search</Icon>}
              value={query}
              onChange={(e) => updateQuery(e.currentTarget.value)}
              trailingIcon={
                query ? <FieldClear label="Clear search" onClear={() => updateQuery('')} /> : null
              }
            />
          </div>
        ) : null}
        {operations != null || actions != null || hasSearch ? (
          <div className="sikat-panel-header__end">
            {operations != null ? (
              <div className="sikat-panel-header__group">{withLargeSize(operations)}</div>
            ) : null}
            {operations != null && actions != null ? (
              <span className="sikat-panel-header__divider" aria-hidden="true" />
            ) : null}
            {actions != null ? (
              <div className="sikat-panel-header__group">{withLargeSize(actions)}</div>
            ) : null}
          </div>
        ) : null}
      </div>
      {showTabs && tabs != null ? <div className="sikat-panel-header__tabs">{tabs}</div> : null}
    </header>
  );
}
