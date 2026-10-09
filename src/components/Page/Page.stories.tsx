import type { Meta, StoryObj } from '@storybook/react';
import { useState, type CSSProperties } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Page } from './Page';
import { useHoverIntent } from '../../lib/useHoverIntent';
import { Panel } from '../Panel/Panel';
import { PanelHeader, panelHeaderIcons } from '../Panel/PanelHeader';
import { Section } from '../Section/Section';
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs';
import { Alert } from '../Alert/Alert';
import { Card } from '../Card/Card';
import { IconButton } from '../Button/IconButton';
import { Button } from '../Button/Button';
import { Link } from '../Button/Link';
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

/** Story records for a page: three ids prefixed with the page's code (Customers → CUS-0041…). */
const recordsOf = (page: string) => {
  const code = (labelOf(page) ?? page).replace(/\W/g, '').slice(0, 3).toUpperCase();
  return [41, 42, 43].map((n) => `${code}-00${n}`);
};

/**
 * The trail App › Module › Page › Record. The app goes to its home page, the page
 * back to its list; modules aren't pages, so they're plain text. Ids carry their
 * level (`app:` / `page:`) so the navigate handler knows what was clicked.
 */
const trailOf = (app: string, page: string, record?: string): BreadcrumbItem[] => {
  const module = NAV.flatMap((s) => s.items).find((i) => i.items?.some((c) => c.id === page));
  return [
    { id: 'app:home', label: APPS.find((a) => a.id === app)?.label, href: `#${app}` },
    ...(module ? [{ id: `module:${module.id}`, label: module.label }] : []),
    {
      id: `page:${page}`,
      label: labelOf(page),
      href: record ? `#${app}/${page}` : undefined,
    },
    ...(record ? [{ id: `record:${record}`, label: record }] : []),
  ];
};

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
  return { navbar, sidenav, app, page, setPage };
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
                operations={
                  <>
                    <IconButton label="Filter" intent="default" variant="solid">
                      {CircleIcon}
                    </IconButton>
                    <IconButton label="Sort" intent="default" variant="solid">
                      {CircleIcon}
                    </IconButton>
                  </>
                }
                actions={
                  <>
                    <Button intent="default" variant="solid">
                      Button
                    </Button>
                    <Button
                      intent="primary"
                      variant="solid"
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
              <PanelHeader icon="info" iconVariant="subtle" title="Details" />
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

/**
 * Breadcrumbs above the Panel: App › Module › Page › Record. The app follows the
 * navbar's switcher, module and page follow the side nav, and opening a record
 * adds its id; ancestors navigate back.
 */
function AppShellWithBreadcrumbsDemo() {
  const { navbar, sidenav, app, page, setPage } = useAppShell();
  // The open record belongs to an app + page; switching either closes it.
  const [open, setOpen] = useState<{ at: string; id: string } | null>(null);
  const at = `${app}/${page}`;
  const record = open?.at === at ? open.id : undefined;
  return (
    <Page>
      {navbar}
      <div style={{ display: 'flex', flex: 1 }}>
        {sidenav}
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-2)',
          }}
        >
          <Breadcrumbs
            items={trailOf(app, page, record)}
            onNavigate={(item, e) => {
              e.preventDefault();
              setOpen(null);
              if (item.id === 'app:home') setPage('home');
            }}
          />
          <Panel style={{ flex: 1, minWidth: 0 }}>
            <PanelHeader
              icon="inventory_2"
              iconVariant="solid"
              title={record ?? labelOf(page) ?? 'Page Title'}
              actions={
                <Button intent="primary" variant="solid">
                  Button
                </Button>
              }
              tabs={record ? undefined : <Tabs variant="outline" items={panelTabs} />}
            />
            <Panel.Body>
              <Card>
                <Card.Header icon={SectionIcon}>{record ?? labelOf(page)}</Card.Header>
                <Card.Content>
                  {record ? (
                    <p className="text-body">Details for {record}.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {recordsOf(page).map((id) => (
                        <li key={id}>
                          <Link
                            href={`#${at}/${id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setOpen({ at, id });
                            }}
                          >
                            {id}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Content>
              </Card>
            </Panel.Body>
          </Panel>
        </main>
      </div>
    </Page>
  );
}

export const AppShellWithBreadcrumbs: Story = {
  render: () => <AppShellWithBreadcrumbsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const crumbs = () => within(canvas.getByRole('navigation', { name: 'Breadcrumb' }));
    const trail = () =>
      crumbs()
        .getAllByRole('listitem')
        .map((li) => li.textContent?.replace('chevron_right', ''));
    const side = within(canvas.getByRole('navigation', { name: 'Sidebar' }));
    await expect(trail()).toEqual(['CRM', 'Home']);

    // Side nav → App › Module › Page.
    await userEvent.click(side.getByRole('button', { name: 'Sales' }));
    await userEvent.click(side.getByRole('button', { name: 'Customers' }));
    await expect(trail()).toEqual(['CRM', 'Sales', 'Customers']);
    await expect(crumbs().getByText('Customers')).toHaveAttribute('aria-current', 'page');
    // The module isn't a page, so it isn't a link.
    await expect(crumbs().queryByRole('link', { name: 'Sales' })).toBeNull();

    // Opening a record adds its id; the page becomes a link back to the list.
    await userEvent.click(canvas.getByRole('link', { name: 'CUS-0042' }));
    await expect(trail()).toEqual(['CRM', 'Sales', 'Customers', 'CUS-0042']);
    await expect(crumbs().getByText('CUS-0042')).toHaveAttribute('aria-current', 'page');
    await userEvent.click(crumbs().getByRole('link', { name: 'Customers' }));
    await expect(trail()).toEqual(['CRM', 'Sales', 'Customers']);

    // The navbar's app switcher changes the first crumb.
    await userEvent.click(canvas.getByRole('combobox', { name: 'Apps' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Accounting' }));
    await expect(trail()?.[0]).toBe('Accounting');

    // The trail sits above the Panel.
    const panel = canvasElement.querySelector('.sikat-panel')!;
    await expect(
      canvas.getByRole('navigation', { name: 'Breadcrumb' }).getBoundingClientRect().bottom,
    ).toBeLessThanOrEqual(panel.getBoundingClientRect().top);

    // The app crumb goes to the app's home page.
    await userEvent.click(crumbs().getByRole('link', { name: 'Accounting' }));
    await expect(trail()).toEqual(['Accounting', 'Home']);
    await expect(side.getByRole('button', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};
