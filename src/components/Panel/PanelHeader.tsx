import {
  useState,
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
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

export const panelHeaderVariants = ['card', 'plain'] as const;
export type PanelHeaderVariant = (typeof panelHeaderVariants)[number];

/** @deprecated Use `panelHeaderVariants` — every slot now renders when passed. */
export const panelHeaderTypes = ['table', 'forms', 'details'] as const;
/** @deprecated Use `PanelHeaderVariant`. */
export type PanelHeaderType = (typeof panelHeaderTypes)[number];

export const panelHeaderIcons = {
  arrowDownward: <Icon size={20}>arrow_downward</Icon>,
  arrowUpward: <Icon size={20}>arrow_upward</Icon>,
  rotateRight: <Icon size={20}>rotate_right</Icon>,
  keyboardArrowDown: <Icon size={20}>keyboard_arrow_down</Icon>,
};

export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Chrome: `card` (secondary fill, rounded, bottom border) or `plain` (no fill,
   * radius or border — outline tabs carry the bottom line). Default: card.
   */
  variant?: PanelHeaderVariant;
  /**
   * @deprecated Use `variant`. Every slot now renders whenever it is passed;
   * `table` / `forms` map to `card`, `details` to `plain`.
   */
  type?: PanelHeaderType;
  /** Page title. */
  title?: ReactNode;
  /** Subcopy below the title. */
  subcopy?: ReactNode;
  /** Material Symbol name for the leading DecorativeIcon. */
  icon?: string;
  /** DecorativeIcon variant. Default: solid. */
  iconVariant?: DecorativeIconVariant;
  /** DecorativeIcon size in px. Default: 40. */
  iconSize?: number;
  /** Custom leading slot — overrides `icon` when provided. */
  leading?: ReactNode;
  /** Status badge after the title. */
  status?: ReactNode;
  /** Icon after the title / status. */
  titleIcon?: ReactNode;
  /** Operation icon buttons. */
  operations?: ReactNode;
  /** Core action buttons. */
  actions?: ReactNode;
  /** Tabs below the bar — they sit on the header's bottom edge. */
  tabs?: ReactNode;
  /** Show a search field centered between the title and the buttons (3 columns). */
  showSearch?: boolean;
  /** Search field placeholder. */
  searchPlaceholder?: string;
  /** Accessible name of the search field. Default: "Search". */
  searchLabel?: string;
  /** The search text, for a controlled search. Omit to let the header keep it. */
  searchValue?: string;
  /** Search input value changes. */
  onSearchChange?: (value: string) => void;
}

/**
 * PanelHeader — the top header of a `<Panel>`. Combines the decorative icon,
 * page title, subcopy, operation buttons, core actions, and tabs in one component.
 * Mirrors the Figma Header (Components › Headers, set 17447:35967).
 */
export function PanelHeader({
  variant,
  type,
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
  const resolvedVariant = variant ?? (type === 'details' ? 'plain' : 'card');
  const hasSearch = !!showSearch;
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
      data-variant={resolvedVariant}
      data-tabs={tabs != null || undefined}
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
              {status != null ? status : null}
              {titleIcon != null ? (
                <span className="sikat-panel-header__title-icon">{titleIcon}</span>
              ) : null}
            </div>
            {subcopy != null ? <p className="sikat-panel-header__subcopy">{subcopy}</p> : null}
          </div>
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
      {tabs != null ? <div className="sikat-panel-header__tabs">{tabs}</div> : null}
    </header>
  );
}
