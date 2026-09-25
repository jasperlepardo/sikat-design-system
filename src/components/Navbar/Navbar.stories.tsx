import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Navbar, navbarTypes, type NavbarType } from './Navbar';
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
};

export const Playground: StoryObj<NavbarPlaygroundArgs> = {
  args: { Type: 'app', app: '[App Name]' },
  argTypes: {
    Type: figmaSelect('Type', navbarTypes, ['App', 'Control Plane']),
    app: { name: 'App', control: 'text' },
  },
  parameters: figmaControls(['Type', 'App']),
  render: ({ Type, app, ...handlers }) => (
    <Navbar
      type={Type}
      appName={app}
      avatar={Type === 'app' ? AppAvatar : ControlPlaneAvatar}
      {...handlers}
    />
  ),
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

    await userEvent.click(canvas.getByRole('button', { name: 'Apps' }));
    await expect(args.onAppsClick).toHaveBeenCalledOnce();
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search' }), 'q');
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('q');
    await userEvent.click(canvas.getByRole('button', { name: 'Create' }));
    await expect(args.onCreateClick).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Sikat Tech Inc.' }));
    await expect(args.onOrganizationClick).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }));
    await expect(args.onNotificationsClick).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
    await expect(args.onSettingsClick).toHaveBeenCalledOnce();
  },
};

/** Figma Type=Control Plane: brand + avatar only. */
export const ControlPlane: StoryObj<typeof meta> = {
  args: { type: 'control-plane', avatar: ControlPlaneAvatar },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation').getBoundingClientRect().height).toBe(64);
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.queryByRole('searchbox')).toBeNull();
  },
};
