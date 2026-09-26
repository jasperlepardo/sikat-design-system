import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { DecorativeIcon, type DecorativeIconVariant } from '../DecorativeIcon/DecorativeIcon';
import './panel-header.css';

export const panelHeaderTypes = ['table', 'forms'] as const;
export type PanelHeaderType = (typeof panelHeaderTypes)[number];

export const panelHeaderIcons = {
  arrowDownward:    <Icon size={20}>arrow_downward</Icon>,
  arrowUpward:      <Icon size={20}>arrow_upward</Icon>,
  rotateRight:      <Icon size={20}>rotate_right</Icon>,
  keyboardArrowDown: <Icon size={20}>keyboard_arrow_down</Icon>,
};

export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Visual layout: table (title + subcopy + tabs) or forms (single row). */
  type?: PanelHeaderType;
  /** Page title. */
  title?: ReactNode;
  /** Subcopy below the title (table type only). */
  subcopy?: ReactNode;
  /** Material Symbol name for the leading DecorativeIcon. */
  icon?: string;
  /** DecorativeIcon variant. Default: solid. */
  iconVariant?: DecorativeIconVariant;
  /** DecorativeIcon size in px. Default: 48. */
  iconSize?: number;
  /** Custom leading slot — overrides `icon` when provided. */
  leading?: ReactNode;
  /** Status badge (forms type only). */
  status?: ReactNode;
  /** Icon after the title (forms type only). */
  titleIcon?: ReactNode;
  /** Operation icon buttons. */
  operations?: ReactNode;
  /** Core action buttons. */
  actions?: ReactNode;
  /** Tabs below the bar (table type only). */
  tabs?: ReactNode;
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
  iconSize = 48,
  leading,
  status,
  titleIcon,
  operations,
  actions,
  tabs,
  className,
  ...rest
}: PanelHeaderProps) {
  const isTable = type === 'table';
  const leadingContent = leading ?? (icon
    ? <DecorativeIcon variant={iconVariant} icon={icon} size={iconSize} />
    : null);

  return (
    <header data-type={type} className={cn('sikat-panel-header', className)} {...rest}>
      <div className="sikat-panel-header__bar">
        <div className="sikat-panel-header__start">
          {leadingContent != null ? (
            <div className="sikat-panel-header__leading">{leadingContent}</div>
          ) : null}
          <div className="sikat-panel-header__titles">
            <div className="sikat-panel-header__title-row">
              {title != null ? <h1 className="sikat-panel-header__title">{title}</h1> : null}
              {!isTable && status != null ? status : null}
            </div>
            {isTable && subcopy != null ? (
              <p className="sikat-panel-header__subcopy">{subcopy}</p>
            ) : null}
          </div>
          {!isTable && titleIcon != null ? (
            <span className="sikat-panel-header__title-icon">{titleIcon}</span>
          ) : null}
        </div>
        {operations != null || actions != null ? (
          <div className="sikat-panel-header__end">
            {operations != null ? (
              <div className="sikat-panel-header__group">{operations}</div>
            ) : null}
            {operations != null && actions != null ? (
              <span className="sikat-panel-header__divider" aria-hidden="true" />
            ) : null}
            {actions != null ? (
              <div className="sikat-panel-header__group">{actions}</div>
            ) : null}
          </div>
        ) : null}
      </div>
      {isTable && tabs != null ? (
        <div className="sikat-panel-header__tabs">{tabs}</div>
      ) : null}
    </header>
  );
}
