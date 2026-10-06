import type { Meta, StoryObj } from '@storybook/react';
import { useState, type CSSProperties } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Page } from './Page';
import { useHoverIntent } from '../../lib/useHoverIntent';
import { Panel } from '../Panel/Panel';
import { PanelHeader, panelHeaderIcons } from '../Panel/PanelHeader';
import { Section } from '../Section/Section';
import { Alert } from '../Alert/Alert';
import { Card } from '../Card/Card';
import { IconButton } from '../Button/IconButton';
import { Button } from '../Button/Button';
import { Tabs } from '../Tabs/Tabs';
import { Icon } from '../Icon/Icon';
import { Navbar, type NavbarMenuItem } from '../Navbar/Navbar';
import { SideNav, SideNavIcon, type SideNavItem, type SideNavSection } from '../SideNav/SideNav';
import avatarProfile from '../Navbar/assets/avatar-profile.jpg';
import home from '../SideNav/assets/home.svg';
import inventory2 from '../SideNav/assets/inventory-2.svg';
import discount from '../SideNav/assets/discount.svg';
import shoppingCart from '../SideNav/assets/shopping-cart.svg';
import widgets from '../SideNav/assets/widgets.svg';
import accountTree from '../SideNav/assets/account-tree.svg';
import importContacts from '../SideNav/assets/import-contacts.svg';

const meta = {
  title: 'Layout/Page',
  component: Page,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shell: Story = {
  render: () => (
    <Page style={{ minHeight: 320 }}>
      <Navbar type="control-plane" />
      <Section>
        <Section.Container>
          <p className="text-body">Body content — the footer pins to the bottom on short pages.</p>
        </Section.Container>
      </Section>
      <footer className="bg-secondary px-6 py-4 text-sm text-muted">Pinned Footer</footer>
    </Page>
  ),
};

const sub = (prefix: string, labels: string[]): SideNavItem[] =>
  labels.map((label) => ({ id: `${prefix}/${label.toLowerCase().replace(/\W+/g, '-')}`, label }));

const NAV: SideNavSection[] = [
  {
    id: 'core',
    items: [
      { id: 'home', label: 'Home', icon: <SideNavIcon src={home} /> },
      {
        id: 'item',
        label: 'Item',
        icon: <SideNavIcon src={inventory2} />,
        items: sub('item', ['Items']),
      },
      {
        id: 'sales',
        label: 'Sales',
        icon: <SideNavIcon src={discount} />,
        items: sub('sales', [
          'Customers',
          'Quotations',
          'Sales Order',
          'Invoices',
          'Sales Receipt',
          'Returns',
        ]),
      },
      {
        id: 'procurement',
        label: 'Procurement',
        icon: <SideNavIcon src={shoppingCart} />,
        items: sub('procurement', ['Purchase Request', 'RFQs', 'Purchase Orders', 'Receiving']),
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: <SideNavIcon src={widgets} />,
        items: sub('inventory', ['Stock', 'Warehouse', 'Transfers']),
      },
      {
        id: 'accounting',
        label: 'Accounting',
        icon: <SideNavIcon src={accountTree} />,
        items: sub('accounting', ['General Ledger', 'Accounts Receivable', 'Accounts Payable']),
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    items: [
      {
        id: 'reporting',
        label: 'Reporting',
        icon: <SideNavIcon src={importContacts} />,
        items: sub('reporting', ['Dashboards', 'Exports']),
      },
      {
        id: 'configurations',
        label: 'Configurations',
        icon: <SideNavIcon src={inventory2} />,
        items: sub('configurations', ['General', 'Users & Roles']),
      },
    ],
  },
];

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
const ORGS: NavbarMenuItem[] = [
  { id: 'sikat', label: 'Sikat Tech Inc.' },
  { id: 'acme', label: 'Acme Corp' },
];
const ACCOUNT: NavbarMenuItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Account settings' },
  { id: 'sign-out', label: 'Sign out' },
];

const labelOf = (id: string) =>
  NAV.flatMap((s) => s.items.flatMap((i) => [i, ...(i.items ?? [])])).find((i) => i.id === id)
    ?.label;

const CircleIcon = <Icon size={20}>radio_button_unchecked</Icon>;
const SectionIcon = <Icon size={24}>art_track</Icon>;

const panelTabs = [
  { value: 'all', label: 'All', icon: CircleIcon, badge: '+9' },
  { value: 'active', label: 'Active', icon: CircleIcon },
];

/** Navbar on top + SideNav on the left + content: the full app layout. */
function AppShellDemo() {
  const { navbar, sidenav, page } = useAppShell();
  return (
    <Page>
      {navbar}
      <div style={{ display: 'flex', flex: 1 }}>
        {sidenav}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Section>
            <Section.Container>
              <h1 className="text-2xl font-semibold text-heading">{labelOf(page)}</h1>
              <p className="mt-2 text-body">Page content for "{labelOf(page)}".</p>
            </Section.Container>
          </Section>
        </main>
      </div>
    </Page>
  );
}

export const AppShell: Story = {
  render: () => <AppShellDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole('navigation', { name: 'Sidebar' });
    const heading = () => canvas.getByRole('heading', { level: 1 });
    await expect(heading()).toHaveTextContent('Home');
    const bar = canvas.getByRole('navigation', { name: 'Main' }).getBoundingClientRect();
    await expect(sidebar.getBoundingClientRect().top).toBe(bar.bottom);
    await expect(sidebar.getBoundingClientRect().left).toBe(0);
    const side = within(sidebar);
    await userEvent.click(side.getByRole('button', { name: 'Sales' }));
    await userEvent.click(side.getByRole('button', { name: 'Customers' }));
    await expect(heading()).toHaveTextContent('Customers');
    await expect(side.getByRole('button', { name: 'Customers' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    // The navbar's toggle slides the sidebar out; the content takes its space.
    const main = canvasElement.querySelector('main')!;
    const toggle = canvas.getByRole('button', { name: 'Toggle side navigation' });
    await expect(toggle).toHaveAttribute('aria-controls', sidebar.id);
    await expect(sidebar.getBoundingClientRect().width).toBe(280);
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(sidebar).not.toBeVisible());
    await waitFor(() => expect(main.getBoundingClientRect().left).toBe(0));
    // Hovering the toggle peeks it over the content (which stays put).
    await userEvent.hover(toggle);
    await waitFor(() => expect(sidebar.getBoundingClientRect().left).toBe(0));
    await expect(sidebar).toBeVisible();
    await expect(main.getBoundingClientRect().left).toBe(0);
    await expect(getComputedStyle(sidebar).boxShadow).toContain('rgba(0, 0, 0, 0.25)');
    await userEvent.unhover(toggle);
    await waitFor(() => expect(sidebar).not.toBeVisible());
    // Clicking pins it back in.
    await userEvent.click(toggle);
    await expect(sidebar).toBeVisible();
    await waitFor(() => expect(main.getBoundingClientRect().left).toBe(280));
    await userEvent.click(canvas.getByRole('combobox', { name: 'Apps' }));
    await expect(canvas.getAllByRole('option')).toHaveLength(APPS.length);
    await userEvent.click(canvas.getByRole('option', { name: 'Accounting' }));
    const navbar = within(canvas.getByRole('navigation', { name: 'Main' }));
    await expect(navbar.getByText('Accounting')).toBeInTheDocument();
  },
};

/**
 * Shared app-shell state. The navbar's toggle slides the side nav out (the
 * content reflows) and back in; while it's out, hovering the toggle peeks it
 * over the content, and moving into the panel keeps it open.
 */
function useAppShell() {
  const [app, setApp] = useState('crm');
  const [org, setOrg] = useState('sikat');
  const [page, setPage] = useState('home');
  const [navExpanded, setNavExpanded] = useState(true);
  const peek = useHoverIntent();
  const navbar = (
    <Navbar
      onSideNavToggle={() => {
        setNavExpanded((v) => !v);
        peek.reset();
      }}
      onSideNavToggleHover={peek.onHover}
      sideNavExpanded={navExpanded}
      sideNavId="app-sidenav"
      appName={APPS.find((a) => a.id === app)?.label}
      apps={APPS}
      appId={app}
      onAppChange={setApp}
      organizations={ORGS}
      organizationId={org}
      onOrganizationChange={setOrg}
      avatar={<img src={avatarProfile} alt="Account" />}
      accountItems={ACCOUNT}
    />
  );
  const sidenav = (
    <SideNav
      id="app-sidenav"
      collapsed={!navExpanded}
      peek={peek.hovering}
      onMouseEnter={() => peek.onHover(true)}
      onMouseLeave={() => peek.onHover(false)}
      sections={NAV}
      activeId={page}
      onNavigate={setPage}
      style={
        {
          '--sidenav-width': '280px',
          position: 'sticky',
          top: 64,
          height: 'calc(100vh - 64px)',
          flex: 'none',
        } as CSSProperties
      }
    />
  );
  return { navbar, sidenav, page };
}

/** Full app shell with an alert — mirrors the Figma Page/Default variant. */
function AppShellWithAlertDemo() {
  const { navbar, sidenav, page } = useAppShell();
  const [alertVisible, setAlertVisible] = useState(true);
  return (
    <Page>
      {navbar}
      <div style={{ display: 'flex', flex: 1 }}>
        {sidenav}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          {alertVisible && (
            <Alert
              intent="success"
              variant="solid"
              horizontal
              title="Title"
              onClose={() => setAlertVisible(false)}
              actions={
                <>
                  <Alert.Action href="#">Button</Alert.Action>
                  <Alert.Action href="#">Button</Alert.Action>
                </>
              }
            >
              Message
            </Alert>
          )}
          <div style={{ display: 'flex', flex: 1, gap: 8, padding: 8, alignItems: 'stretch' }}>
            <Panel style={{ flex: 1, minWidth: 0 }}>
              <PanelHeader
                icon="inventory_2"
                iconVariant="solid"
                title={labelOf(page) ?? 'Page Title'}
                subcopy="Subcopy"
                operations={
                  <>
                    <IconButton label="Filter" intent="default" variant="solid" size="extra-large">
                      {CircleIcon}
                    </IconButton>
                    <IconButton label="Sort" intent="default" variant="solid" size="extra-large">
                      {CircleIcon}
                    </IconButton>
                  </>
                }
                actions={
                  <>
                    <Button intent="default" variant="solid" size="extra-large">
                      Button
                    </Button>
                    <Button
                      intent="primary"
                      variant="solid"
                      size="extra-large"
                      trailingIcon={panelHeaderIcons.keyboardArrowDown}
                    >
                      Button
                    </Button>
                  </>
                }
                tabs={<Tabs variant="outline" items={panelTabs} />}
              />
              <Panel.Body>
                <Card>
                  <Card.Header icon={SectionIcon}>{labelOf(page) ?? 'Details'}</Card.Header>
                  <Card.Content>
                    <p className="text-body">Page content for "{labelOf(page)}".</p>
                  </Card.Content>
                </Card>
              </Panel.Body>
            </Panel>
          </div>
        </div>
      </div>
    </Page>
  );
}

export const AppShellWithAlert: Story = {
  render: () => <AppShellWithAlertDemo />,
};

/** Two-panel layout with an alert — mirrors the Figma Page/Variant2. */
function AppShellWithAlertTwoPanelDemo() {
  const { navbar, sidenav, page } = useAppShell();
  const [alertVisible, setAlertVisible] = useState(true);
  return (
    <Page>
      {navbar}
      <div style={{ display: 'flex', flex: 1 }}>
        {sidenav}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          {alertVisible && (
            <Alert
              intent="success"
              variant="solid"
              horizontal
              title="Title"
              onClose={() => setAlertVisible(false)}
              actions={
                <>
                  <Alert.Action href="#">Button</Alert.Action>
                  <Alert.Action href="#">Button</Alert.Action>
                </>
              }
            >
              Message
            </Alert>
          )}
          <div style={{ display: 'flex', flex: 1, gap: 8, padding: 8, alignItems: 'stretch' }}>
            <Panel style={{ flex: 'none', width: 400 }}>
              <PanelHeader
                icon="inventory_2"
                iconVariant="solid"
                title={labelOf(page) ?? 'Page Title'}
                subcopy="Subcopy"
                operations={
                  <>
                    <IconButton label="Filter" intent="default" variant="solid" size="extra-large">
                      {CircleIcon}
                    </IconButton>
                    <IconButton label="Sort" intent="default" variant="solid" size="extra-large">
                      {CircleIcon}
                    </IconButton>
                  </>
                }
                actions={
                  <Button
                    intent="primary"
                    variant="solid"
                    size="extra-large"
                    trailingIcon={panelHeaderIcons.keyboardArrowDown}
                  >
                    Button
                  </Button>
                }
                tabs={<Tabs variant="outline" items={panelTabs} />}
              />
              <Panel.Body>
                <Card>
                  <Card.Header icon={SectionIcon}>{labelOf(page) ?? 'Records'}</Card.Header>
                  <Card.Content>
                    <p className="text-body">Primary panel content.</p>
                  </Card.Content>
                </Card>
              </Panel.Body>
            </Panel>
            <Panel style={{ flex: 1, minWidth: 0 }}>
              <PanelHeader
                icon="info"
                iconVariant="subtle"
                title="Details"
                subcopy="Secondary panel"
              />
              <Panel.Body>
                <Card>
                  <Card.Header icon={SectionIcon}>Details</Card.Header>
                  <Card.Content>
                    <p className="text-body">Secondary panel content.</p>
                  </Card.Content>
                </Card>
              </Panel.Body>
            </Panel>
          </div>
        </div>
      </div>
    </Page>
  );
}

export const AppShellWithAlertTwoPanel: Story = {
  render: () => <AppShellWithAlertTwoPanelDemo />,
};
