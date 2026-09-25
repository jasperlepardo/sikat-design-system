import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
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
  /** App: search field placeholder. */
  searchPlaceholder?: string;
  /** App: search input value changes. */
  onSearchChange?: (value: string) => void;
  /** App: the gradient "+" create button. */
  onCreateClick?: () => void;
  /** App: organization switcher label. */
  organization?: ReactNode;
  onOrganizationClick?: () => void;
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
  searchPlaceholder = 'Search',
  onSearchChange,
  onCreateClick,
  organization = 'Sikat Tech Inc.',
  onOrganizationClick,
  onNotificationsClick,
  onSettingsClick,
  className,
  'aria-label': ariaLabel = 'Main',
  ...rest
}: NavbarProps) {
  const isApp = type === 'app';
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
            <IconButton
              label="Apps"
              intent="default"
              variant="solid"
              size="medium"
              onClick={onAppsClick}
            >
              <Glyph src={appsGlyph} />
            </IconButton>
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
              <Button
                intent="default"
                variant="link"
                size="medium"
                trailingIcon={<Glyph src={chevronGlyph} />}
                onClick={onOrganizationClick}
              >
                {organization}
              </Button>
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
                {avatar != null ? <span className="sikat-navbar__avatar">{avatar}</span> : null}
              </div>
            </div>
          </>
        ) : (
          <div className="sikat-navbar__end">
            {avatar != null ? <span className="sikat-navbar__avatar">{avatar}</span> : null}
          </div>
        )}
      </div>
    </nav>
  );
}
