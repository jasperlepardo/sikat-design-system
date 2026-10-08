import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Navbar,
  navbarThemes,
  navbarTypes,
  type NavbarMenuItem,
  type NavbarTheme,
  type NavbarType,
} from './Navbar';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import { useHoverIntent } from '../../lib/useHoverIntent';
import { SideNav, SideNavIcon, type SideNavSection } from '../SideNav/SideNav';
import home from '../SideNav/assets/home.svg';
import inventory2 from '../SideNav/assets/inventory-2.svg';
import shoppingCart from '../SideNav/assets/shopping-cart.svg';
import widgets from '../SideNav/assets/widgets.svg';
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

/** Apps for the app selector; the App control names the bar until one is picked. */
const APPS: NavbarMenuItem[] = [
  'CRM',
  'Sales',
  'Purchase',
  'Inventory',
  'Manufacturing',
  'Project',
  'Service',
  'Banking',
  'Accounting',
  'Human Resource',
  'Reports',
].map((label) => ({ id: label.toLowerCase().replace(/\s+/g, '-'), label }));

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
    onSideNavToggle: fn(),
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
  Theme?: NavbarTheme;
  app: string;
  onSideNavToggle: () => void;
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
  Theme,
  app,
  onOrganizationChange,
  onAppChange,
  onAccountAction,
  onSideNavToggle,
  ...handlers
}: NavbarPlaygroundArgs) {
  const [sideNavExpanded, setSideNavExpanded] = useState(true);
  const [org, setOrg] = useState('sikat');
  const [appId, setAppId] = useState<string>();
  return (
    <Navbar
      type={Type}
      theme={Theme}
      sideNavExpanded={sideNavExpanded}
      onSideNavToggle={() => {
        setSideNavExpanded((v) => !v);
        onSideNavToggle();
      }}
      appName={APPS.find((a) => a.id === appId)?.label ?? app}
      apps={APPS}
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
    Theme: { name: 'Theme', options: navbarThemes, control: 'inline-radio' },
    app: { name: 'App', control: 'text' },
  },
  parameters: figmaControls(['Type', 'Theme', 'App']),
  render: (args) => <PlaygroundNavbar {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(nav.getBoundingClientRect().height).toBe(64);
    // Logo: 40px tall (12px padding-y keeps the bar at 64px).
    const logo = nav.querySelector('.sikat-navbar__logo svg')!.getBoundingClientRect();
    await expect(Math.round(logo.height)).toBe(40);
    // No `theme`: the bar follows the page's theme.
    await expect(nav).not.toHaveAttribute('data-theme');
    await expect(canvas.getByText('[App Name]')).toBeInTheDocument();
    // Search = Figma Field, size mode "Extra Large": 520×40, 8px radius (--rounded-lg).
    const field = canvasElement.querySelector('.sikat-navbar__search')!;
    const box = field.getBoundingClientRect();
    await expect([box.width, box.height]).toEqual([520, 40]);
    await expect(getComputedStyle(field).borderRadius).toBe('8px');

    // Side-nav toggle: first in the bar, flips aria-expanded.
    const toggle = canvas.getByRole('button', { name: 'Toggle side navigation' });
    await expect(nav.querySelector('button')).toBe(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(toggle);
    await expect(args.onSideNavToggle).toHaveBeenCalledOnce();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);

    // App selector = Figma Dropdown, left-aligned; the chosen app becomes the name.
    const appsTrigger = canvas.getByRole('combobox', { name: 'Apps' });
    await userEvent.click(appsTrigger);
    await expect(args.onAppsClick).toHaveBeenCalledOnce();
    const appList = canvas.getByRole('listbox', { name: 'Apps' });
    await expect(within(appList).getAllByRole('option')).toHaveLength(APPS.length);
    await expect(Math.round(appList.getBoundingClientRect().left)).toBe(
      Math.round(appsTrigger.getBoundingClientRect().left),
    );
    await userEvent.keyboard('m{Enter}');
    await expect(args.onAppChange).toHaveBeenLastCalledWith('manufacturing');
    await expect(canvas.getByText('Manufacturing')).toBeInTheDocument();
    await expect(appsTrigger).toHaveFocus();
    const search = canvas.getByRole('searchbox', { name: 'Search' });
    await userEvent.type(search, 'q');
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('q');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(search).toHaveValue('');
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('');
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
    onSideNavToggle: undefined,
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
    await expect(size('Toggle side navigation')).toEqual([32, 32]);
    await expect(size('Apps')).toEqual([32, 32]);
    await expect(size('Create')).toEqual([36, 36]);
    await expect(size('Notifications')).toEqual([32, 32]);
    await expect(size('Settings')).toEqual([32, 32]);
    await expect(size('Sikat Tech Inc.')).toEqual([134, 32]);
  },
};

const SIDE_NAV: SideNavSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: <SideNavIcon src={home} /> },
      { id: 'inventory', label: 'Inventory', icon: <SideNavIcon src={inventory2} /> },
      { id: 'sales', label: 'Sales', icon: <SideNavIcon src={shoppingCart} /> },
      { id: 'reports', label: 'Reports', icon: <SideNavIcon src={widgets} /> },
    ],
  },
];

/**
 * Navbar + SideNav. `mode="compact"`: the toggle swaps to the compact rail;
 * `mode="slide"`: the expanded bar slides out and back in, and while it's out,
 * hovering the toggle peeks it over the content.
 */
function WithSideNavDemo({
  mode = 'compact',
  ...args
}: Partial<NavbarPlaygroundArgs> & { mode?: 'compact' | 'slide' }) {
  const [expanded, setExpanded] = useState(true);
  const [page, setPage] = useState('home');
  const { hovering: peek, onHover: hover, reset } = useHoverIntent();
  const slide = mode === 'slide';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 480, overflow: 'hidden' }}>
      <Navbar
        appName="CRM"
        avatar={AppAvatar}
        sideNavExpanded={expanded}
        sideNavId="navbar-story-sidenav"
        onSideNavToggle={() => {
          setExpanded((v) => !v);
          reset();
          args.onSideNavToggle?.();
        }}
        onSideNavToggleHover={slide ? hover : undefined}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <SideNav
          id="navbar-story-sidenav"
          orientation={slide || expanded ? 'expanded' : 'compact'}
          collapsed={slide && !expanded}
          peek={peek}
          onMouseEnter={slide ? () => hover(true) : undefined}
          onMouseLeave={slide ? () => hover(false) : undefined}
          sections={SIDE_NAV}
          activeId={page}
          onNavigate={setPage}
        />
        <main style={{ flex: 1, minWidth: 0, padding: 24 }} className="text-body">
          Side nav is {expanded ? 'expanded' : 'collapsed'}.
        </main>
      </div>
    </div>
  );
}

export const WithSideNav: StoryObj<typeof meta> = {
  render: (args) => <WithSideNavDemo onSideNavToggle={args.onSideNavToggle} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole('navigation', { name: 'Sidebar' });
    const toggle = canvas.getByRole('button', { name: 'Toggle side navigation' });
    await expect(toggle).toHaveAttribute('aria-controls', sidebar.id);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(sidebar).toHaveAttribute('data-orientation', 'expanded');
    const wide = sidebar.getBoundingClientRect().width;

    // Collapse to the compact rail.
    await userEvent.click(toggle);
    await expect(args.onSideNavToggle).toHaveBeenCalledOnce();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(sidebar).toHaveAttribute('data-orientation', 'compact');
    await expect(sidebar.getBoundingClientRect().width).toBeLessThan(wide);
    await expect(canvas.getByText('Side nav is collapsed.')).toBeInTheDocument();

    // And back.
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(sidebar).toHaveAttribute('data-orientation', 'expanded');
    await expect(sidebar.getBoundingClientRect().width).toBe(wide);
  },
};

/** The expanded side nav slides out to the left and back in; the content reflows. */
export const WithSlidingSideNav: StoryObj<typeof meta> = {
  render: (args) => <WithSideNavDemo mode="slide" onSideNavToggle={args.onSideNavToggle} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole('navigation', { name: 'Sidebar' });
    const main = canvasElement.querySelector('main')!;
    const toggle = canvas.getByRole('button', { name: 'Toggle side navigation' });
    await expect(sidebar).toBeVisible();
    const start = main.getBoundingClientRect().left;
    await expect(start).toBe(sidebar.getBoundingClientRect().right);

    // Slide out: stays expanded, ends off-screen and hidden; content takes the space.
    await userEvent.click(toggle);
    await expect(args.onSideNavToggle).toHaveBeenCalledOnce();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(sidebar).toHaveAttribute('data-orientation', 'expanded');
    await expect(sidebar).toHaveAttribute('data-collapsed');
    await waitFor(() => expect(sidebar).not.toBeVisible());
    await expect(sidebar.getBoundingClientRect().right).toBeLessThanOrEqual(0);
    await expect(main.getBoundingClientRect().left).toBe(0);
    await expect(canvas.getByText('Side nav is collapsed.')).toBeInTheDocument();

    // Hovering the toggle peeks the bar over the content (the content doesn't move);
    // moving into the panel keeps it open, leaving both closes it.
    await userEvent.hover(toggle);
    await expect(sidebar).toHaveAttribute('data-peek');
    await waitFor(() => expect(sidebar.getBoundingClientRect().left).toBe(0));
    await expect(sidebar).toBeVisible();
    await expect(main.getBoundingClientRect().left).toBe(0);
    await userEvent.unhover(toggle);
    await userEvent.hover(sidebar);
    await new Promise((r) => setTimeout(r, 250));
    await expect(sidebar).toHaveAttribute('data-peek');
    await userEvent.unhover(sidebar);
    await waitFor(() => expect(sidebar).not.toHaveAttribute('data-peek'));
    await waitFor(() => expect(sidebar).not.toBeVisible());

    // Clicking pins it: slides back in and the content reflows.
    await userEvent.click(toggle);
    await expect(sidebar).not.toHaveAttribute('data-collapsed');
    await expect(sidebar).toBeVisible();
    await waitFor(() => expect(main.getBoundingClientRect().left).toBe(start));
  },
};
