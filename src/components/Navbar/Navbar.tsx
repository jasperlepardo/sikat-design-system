import { useId, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useDropdown } from '../../lib/useDropdown';
import { useListbox } from '../../lib/useListbox';
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { TextField } from '../Field/Field';
import sikatLogo from './assets/sikat-logo.svg';
import appsGlyph from './assets/apps.svg';
import searchGlyph from './assets/search-lg.svg';
import commandGlyph from './assets/keyboard-command-key.svg';
import plusGlyph from './assets/plus.svg';
import chevronGlyph from './assets/chevron-down.svg';
import notificationsGlyph from './assets/notifications.svg';
import settingsGlyph from './assets/settings.svg';
import './navbar.css';

export const navbarTypes = ['app', 'control-plane'] as const;
export type NavbarType = (typeof navbarTypes)[number];

/** An item in a Navbar menu (organization switcher / account menu). */
export interface NavbarMenuItem {
  id: string;
  label: ReactNode;
  /** Plain text for type-ahead (when `label` is a node). */
  text?: string;
  disabled?: boolean;
  /** Account menu: action to run when chosen. */
  onSelect?: () => void;
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Figma "Type": the full App bar, or the minimal Control Plane bar. */
  type?: NavbarType;
  /** Figma "App": the product name next to the logo. */
  appName?: ReactNode;
  /** Brand mark (defaults to the SIKAT logo). */
  logo?: ReactNode;
  /** Avatar / account slot at the far right (32px in App, 40px in Control Plane). */
  avatar?: ReactNode;
  /** App: the apps (grid) button next to the app name. */
  onAppsClick?: () => void;
  /** App: apps to switch between — turns the apps button into a dropdown. */
  apps?: NavbarMenuItem[];
  /** Current app `id` (marked in the apps dropdown). */
  appId?: string;
  onAppChange?: (id: string) => void;
  /** App: search field placeholder. */
  searchPlaceholder?: string;
  /** App: search input value changes. */
  onSearchChange?: (value: string) => void;
  /** App: the gradient "+" create button. */
  onCreateClick?: () => void;
  /** App: organization switcher label (defaults to the selected organization's). */
  organization?: ReactNode;
  onOrganizationClick?: () => void;
  /** App: organizations to switch between — turns the switcher into a dropdown. */
  organizations?: NavbarMenuItem[];
  /** Selected organization `id` (marked in the dropdown, shown on the button). */
  organizationId?: string;
  onOrganizationChange?: (id: string) => void;
  /** Account menu items — makes the avatar open a dropdown. */
  accountItems?: NavbarMenuItem[];
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

/**
 * A Figma icon asset drawn in `currentColor` (used as a mask, so the exact
 * geometry is kept while the parent's icon color token applies — as in Figma,
 * where the instance's icon-color variable overrides the asset fill).
 */
function Glyph({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="sikat-navbar__glyph"
      style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` }}
    />
  );
}

type MenuTriggerProps = {
  role: 'combobox';
  'aria-label': string;
  'aria-haspopup': 'listbox';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  'aria-activedescendant': string | undefined;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
};

/**
 * A trigger + Figma Dropdown (useDropdown + useListbox): click / Enter / Space /
 * arrows open, arrows / Home / End / type-ahead move, Enter / Space / click
 * choose, Escape / outside-click close; focus returns to the trigger. The panel
 * opens right-aligned under the trigger.
 */
function NavbarMenu({
  items,
  selectedId,
  label,
  align = 'end',
  onChoose,
  trigger,
}: {
  items: NavbarMenuItem[];
  selectedId?: string;
  label: string;
  /** Which trigger edge the panel lines up with. */
  align?: 'start' | 'end';
  onChoose: (item: NavbarMenuItem) => void;
  trigger: (props: MenuTriggerProps) => ReactNode;
}) {
  const baseId = useId();
  const listId = `${baseId}-menu`;
  const getItemId = (i: number) => `${baseId}-item-${i}`;
  const { open, setOpen, toggle, rootRef } = useDropdown<HTMLDivElement>();
  const choose = (i: number) => {
    const item = items[i];
    if (!item || item.disabled) return;
    onChoose(item);
    setOpen(false);
    rootRef.current?.querySelector<HTMLElement>('[aria-haspopup]')?.focus();
  };
  const { activeIndex, onKeyDown, activeId } = useListbox({
    itemCount: items.length,
    open,
    setOpen,
    onActivate: choose,
    getItemId,
    isDisabled: (i) => !!items[i]?.disabled,
    getItemText: (i) => items[i].text ?? (typeof items[i].label === 'string' ? items[i].label : ''),
    selectedIndex: items.findIndex((it) => it.id === selectedId),
  });
  return (
    <div ref={rootRef} className="sikat-navbar__menu" data-align={align}>
      {trigger({
        role: 'combobox',
        'aria-label': label,
        'aria-haspopup': 'listbox',
        'aria-expanded': open,
        'aria-controls': open ? listId : undefined,
        'aria-activedescendant': activeId,
        onClick: toggle,
        onKeyDown,
      })}
      {open ? (
        // The page's (light) theme, as the Figma Dropdown — not the navbar's dark.
        <Dropdown id={listId} aria-label={label} data-theme="light">
          {items.map((item, i) => (
            <DropdownItem
              key={item.id}
              id={getItemId(i)}
              selected={item.id === selectedId}
              active={i === activeIndex}
              disabled={item.disabled}
              onSelect={() => choose(i)}
            >
              {item.label}
            </DropdownItem>
          ))}
        </Dropdown>
      ) : null}
    </div>
  );
}

/**
 * Navbar — the Figma Navbar (Components › Navbar): a 64px dark app bar
 * (`bg/default-alt`, rendered in the Dark theme via `data-theme="dark"`) with the
 * brand mark + app name on the left. `type="app"` adds the apps button, a
 * centered search field with a gradient "+" create button, and on the right an
 * organization switcher, notifications / settings buttons and the avatar.
 * `type="control-plane"` shows only the brand and the avatar. Renders a `<nav>`,
 * so inside `<Page>` it sticks to the top.
 */
export function Navbar({
  type = 'app',
  appName = '[App Name]',
  logo,
  avatar,
  onAppsClick,
  apps,
  appId,
  onAppChange,
  searchPlaceholder = 'Search',
  onSearchChange,
  onCreateClick,
  organization,
  onOrganizationClick,
  organizations,
  organizationId,
  onOrganizationChange,
  accountItems,
  onNotificationsClick,
  onSettingsClick,
  className,
  'aria-label': ariaLabel = 'Main',
  ...rest
}: NavbarProps) {
  const isApp = type === 'app';
  const orgLabel =
    organization ?? organizations?.find((o) => o.id === organizationId)?.label ?? 'Sikat Tech Inc.';
  const avatarNode =
    avatar == null ? null : accountItems?.length ? (
      <NavbarMenu
        items={accountItems}
        label="Account"
        onChoose={(item) => item.onSelect?.()}
        trigger={(props) => (
          <button
            type="button"
            className="sikat-navbar__avatar sikat-navbar__avatar-btn"
            {...props}
          >
            {avatar}
          </button>
        )}
      />
    ) : (
      <span className="sikat-navbar__avatar">{avatar}</span>
    );
  return (
    <nav
      data-theme="dark"
      data-type={type}
      aria-label={ariaLabel}
      className={cn('sikat-navbar', className)}
      {...rest}
    >
      <div className="sikat-navbar__content">
        <div className="sikat-navbar__brand">
          <span className="sikat-navbar__logo">
            {logo ?? <img src={sikatLogo} alt="SIKAT" width={46.9795} height={48} />}
          </span>
          <span className="sikat-navbar__app">{appName}</span>
          {isApp ? (
            apps?.length ? (
              <NavbarMenu
                items={apps}
                selectedId={appId}
                label="Apps"
                align="start"
                onChoose={(item) => onAppChange?.(item.id)}
                trigger={({ onClick, ...props }) => (
                  <IconButton
                    label="Apps"
                    intent="default"
                    variant="solid"
                    size="medium"
                    onClick={() => {
                      onAppsClick?.();
                      onClick();
                    }}
                    {...props}
                  >
                    <Glyph src={appsGlyph} />
                  </IconButton>
                )}
              />
            ) : (
              <IconButton
                label="Apps"
                intent="default"
                variant="solid"
                size="medium"
                onClick={onAppsClick}
              >
                <Glyph src={appsGlyph} />
              </IconButton>
            )
          ) : null}
        </div>

        {isApp ? (
          <>
            <div className="sikat-navbar__center">
              <TextField
                className="sikat-navbar__search"
                size="xl"
                type="search"
                aria-label="Search"
                placeholder={searchPlaceholder}
                leadingIcon={<Glyph src={searchGlyph} />}
                trailingIcon={<Glyph src={commandGlyph} />}
                onChange={(e) => onSearchChange?.(e.currentTarget.value)}
              />
              <IconButton
                label="Create"
                intent="primary"
                variant="solid"
                size="large"
                className="sikat-navbar__create"
                onClick={onCreateClick}
              >
                <Glyph src={plusGlyph} />
              </IconButton>
            </div>
            <div className="sikat-navbar__end">
              {organizations?.length ? (
                <NavbarMenu
                  items={organizations}
                  selectedId={organizationId}
                  label="Organization"
                  onChoose={(item) => onOrganizationChange?.(item.id)}
                  trigger={({ onClick, ...props }) => (
                    <Button
                      intent="default"
                      variant="link"
                      size="medium"
                      trailingIcon={<Glyph src={chevronGlyph} />}
                      onClick={() => {
                        onOrganizationClick?.();
                        onClick();
                      }}
                      {...props}
                    >
                      {orgLabel}
                    </Button>
                  )}
                />
              ) : (
                <Button
                  intent="default"
                  variant="link"
                  size="medium"
                  trailingIcon={<Glyph src={chevronGlyph} />}
                  onClick={onOrganizationClick}
                >
                  {orgLabel}
                </Button>
              )}
              <span className="sikat-navbar__divider" aria-hidden="true" />
              <div className="sikat-navbar__actions">
                <IconButton
                  label="Notifications"
                  intent="default"
                  variant="solid"
                  size="medium"
                  onClick={onNotificationsClick}
                >
                  <Glyph src={notificationsGlyph} />
                </IconButton>
                <IconButton
                  label="Settings"
                  intent="default"
                  variant="solid"
                  size="medium"
                  onClick={onSettingsClick}
                >
                  <Glyph src={settingsGlyph} />
                </IconButton>
                {avatarNode}
              </div>
            </div>
          </>
        ) : (
          <div className="sikat-navbar__end">{avatarNode}</div>
        )}
      </div>
    </nav>
  );
}
