import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Navbar, navbarTypes, type NavbarMenuItem, type NavbarType } from './Navbar';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import avatarProfile from './assets/avatar-profile.jpg';
import avatarControlPlane from './assets/avatar-control-plane.png';
import avatarControlPlaneTop from './assets/avatar-control-plane-overlay.png';

/** Figma's avatar images: App uses one photo; Control Plane stacks two layers. */
const AppAvatar = <img src={avatarProfile} alt="Account" />;
const ControlPlaneAvatar = (
  <span style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
    {[avatarControlPlane, avatarControlPlaneTop].map((src, i) => (
      <img
        key={src}
        src={src}
        alt={i === 1 ? 'Account' : ''}
        style={{ position: 'absolute', inset: 0 }}
      />
    ))}
  </span>
);

/** Dummy organizations for the switcher dropdown. */
const ORGANIZATIONS: NavbarMenuItem[] = [
  { id: 'sikat', label: 'Sikat Tech Inc.' },
  { id: 'acme', label: 'Acme Corp' },
  { id: 'globex', label: 'Globex Industries' },
];

/** Dummy apps for the app selector (the current app comes from the App control). */
const OTHER_APPS: NavbarMenuItem[] = [
  { id: 'ledger', label: 'Ledger' },
  { id: 'payments', label: 'Payments' },
  { id: 'reports', label: 'Reports' },
  { id: 'console', label: 'Admin Console' },
];

/** Dummy account menu; actions log to the Actions panel. */
const accountItems = (onAction: (id: string) => void): NavbarMenuItem[] =>
  ['Profile', 'Account settings', 'Sign out'].map((label) => {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    return { id, label, onSelect: () => onAction(id) };
  });

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onAppsClick: fn(),
    onCreateClick: fn(),
    onOrganizationClick: fn(),
    onNotificationsClick: fn(),
    onSettingsClick: fn(),
    onSearchChange: fn(),
    onOrganizationChange: fn(),
    onAppChange: fn(),
  },
} satisfies Meta<typeof Navbar>;

export default meta;

/**
 * Controls mirror the Figma Navbar component properties 1:1 — same names,
 * options and defaults (args keyed by the Figma property names).
 */
type NavbarPlaygroundArgs = {
  Type: NavbarType;
  app: string;
  onAppsClick: () => void;
  onCreateClick: () => void;
  onOrganizationClick: () => void;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  onSearchChange: (value: string) => void;
  onOrganizationChange: (id: string) => void;
  onAppChange: (id: string) => void;
  onAccountAction: (id: string) => void;
};

/** Stateful demo: the switcher keeps the chosen organization. */
function PlaygroundNavbar({
  Type,
  app,
  onOrganizationChange,
  onAppChange,
  onAccountAction,
  ...handlers
}: NavbarPlaygroundArgs) {
  const [org, setOrg] = useState('sikat');
  const [appId, setAppId] = useState('current');
  const apps = [{ id: 'current', label: app }, ...OTHER_APPS];
  return (
    <Navbar
      type={Type}
      appName={apps.find((a) => a.id === appId)?.label}
      apps={apps}
      appId={appId}
      onAppChange={(id) => {
        setAppId(id);
        onAppChange(id);
      }}
      avatar={Type === 'app' ? AppAvatar : ControlPlaneAvatar}
      organizations={ORGANIZATIONS}
      organizationId={org}
      onOrganizationChange={(id) => {
        setOrg(id);
        onOrganizationChange(id);
      }}
      accountItems={accountItems(onAccountAction)}
      {...handlers}
    />
  );
}

export const Playground: StoryObj<NavbarPlaygroundArgs> = {
  args: { Type: 'app', app: '[App Name]', onAccountAction: fn() },
  argTypes: {
    Type: figmaSelect('Type', navbarTypes, ['App', 'Control Plane']),
    app: { name: 'App', control: 'text' },
  },
  parameters: figmaControls(['Type', 'App']),
  render: (args) => <PlaygroundNavbar {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(nav.getBoundingClientRect().height).toBe(64);
    await expect(nav).toHaveAttribute('data-theme', 'dark');
    await expect(canvas.getByText('[App Name]')).toBeInTheDocument();
    // Search = Figma Field, size mode "Extra Large": 520×40, 12px radius.
    const field = canvasElement.querySelector('.sikat-navbar__search')!;
    const box = field.getBoundingClientRect();
    await expect([box.width, box.height]).toEqual([520, 40]);
    await expect(getComputedStyle(field).borderRadius).toBe('12px');

    // App selector = Figma Dropdown, left-aligned; the chosen app becomes the name.
    const appsTrigger = canvas.getByRole('combobox', { name: 'Apps' });
    await userEvent.click(appsTrigger);
    await expect(args.onAppsClick).toHaveBeenCalledOnce();
    const appList = canvas.getByRole('listbox', { name: 'Apps' });
    await expect(within(appList).getByRole('option', { name: '[App Name]' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(Math.round(appList.getBoundingClientRect().left)).toBe(
      Math.round(appsTrigger.getBoundingClientRect().left),
    );
    await userEvent.keyboard('l{Enter}');
    await expect(args.onAppChange).toHaveBeenLastCalledWith('ledger');
    await expect(canvas.getByText('Ledger')).toBeInTheDocument();
    await expect(appsTrigger).toHaveFocus();
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search' }), 'q');
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('q');
    await userEvent.click(canvas.getByRole('button', { name: 'Create' }));
    await expect(args.onCreateClick).toHaveBeenCalledOnce();
    // Organization switcher = Figma Dropdown; the chosen org shows on the button.
    const org = canvas.getByRole('combobox', { name: 'Organization' });
    await expect(org).toHaveTextContent('Sikat Tech Inc.');
    await userEvent.click(org);
    await expect(args.onOrganizationClick).toHaveBeenCalledOnce();
    const orgList = canvas.getByRole('listbox', { name: 'Organization' });
    await expect(within(orgList).getByRole('option', { name: 'Sikat Tech Inc.' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.click(within(orgList).getByRole('option', { name: 'Acme Corp' }));
    await expect(args.onOrganizationChange).toHaveBeenLastCalledWith('acme');
    await expect(org).toHaveTextContent('Acme Corp');
    await expect(org).toHaveFocus();
    await expect(canvas.queryByRole('listbox')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }));
    await expect(args.onNotificationsClick).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
    await expect(args.onSettingsClick).toHaveBeenCalledOnce();

    // Avatar opens the account menu; keyboard pick runs the item's action.
    const account = canvas.getByRole('combobox', { name: 'Account' });
    await userEvent.click(account);
    await expect(canvas.getByRole('listbox', { name: 'Account' })).toBeVisible();
    await userEvent.keyboard('{End}{Enter}');
    await expect(args.onAccountAction).toHaveBeenLastCalledWith('sign-out');
    await expect(account).toHaveFocus();

    // Leave the org menu open for the docs.
    await userEvent.click(org);
  },
};

/** Figma Type=Control Plane: brand + avatar only. */
export const ControlPlane: StoryObj<typeof meta> = {
  args: {
    type: 'control-plane',
    avatar: ControlPlaneAvatar,
    accountItems: accountItems(fn()),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation').getBoundingClientRect().height).toBe(64);
    // Only the avatar (account menu) is interactive.
    await expect(canvas.queryByRole('button')).toBeNull();
    await userEvent.click(canvas.getByRole('combobox', { name: 'Account' }));
    await expect(canvas.getAllByRole('option')).toHaveLength(3);
    await expect(canvas.queryByRole('searchbox')).toBeNull();
  },
};

/** Narrower than Figma's 1440px page: only the search shrinks; nothing overlaps. */
export const Narrow: StoryObj<typeof meta> = {
  args: { avatar: AppAvatar },
  render: (args) => (
    <div style={{ width: 1000 }}>
      <Navbar {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = [
      ...canvasElement.querySelectorAll(
        '.sikat-navbar__logo, .sikat-navbar__app, nav button, .sikat-navbar__search, .sikat-navbar__avatar',
      ),
    ].filter((el) => !el.closest('.sikat-navbar__search') || el.matches('.sikat-navbar__search'));
    const boxes = items.map((el) => el.getBoundingClientRect());
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const [a, b] = [boxes[i], boxes[j]];
        await expect(a.right <= b.left + 0.5 || b.right <= a.left + 0.5).toBe(true);
      }
    const search = canvasElement.querySelector('.sikat-navbar__search')!.getBoundingClientRect();
    await expect(search.width).toBeLessThan(520);
    // Buttons hug their content (Figma): squares stay square, nothing is squeezed.
    const size = (name: string) => {
      const r = within(canvasElement).getByRole('button', { name }).getBoundingClientRect();
      return [Math.round(r.width), r.height];
    };
    await expect(size('Apps')).toEqual([32, 32]);
    await expect(size('Create')).toEqual([36, 36]);
    await expect(size('Notifications')).toEqual([32, 32]);
    await expect(size('Settings')).toEqual([32, 32]);
    await expect(size('Sikat Tech Inc.')).toEqual([134, 32]);
  },
};
