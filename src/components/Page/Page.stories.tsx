import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Page } from './Page';
import { Section } from '../Section/Section';
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

/** Dummy app data (the Figma Nav modules). */
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
  { id: 'erp', label: 'Sikat ERP' },
  { id: 'payments', label: 'Payments' },
  { id: 'console', label: 'Admin Console' },
];
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

/** Navbar on top + SideNav on the left + content: the full app layout. */
function AppShellDemo() {
  const [app, setApp] = useState('erp');
  const [org, setOrg] = useState('sikat');
  const [page, setPage] = useState('home');
  return (
    <Page>
      <Navbar
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
      <div style={{ display: 'flex', flex: 1 }}>
        <SideNav
          sections={NAV}
          activeId={page}
          onNavigate={setPage}
          style={{ position: 'sticky', top: 64, height: 'calc(100vh - 64px)', flex: 'none' }}
        />
        <main style={{ flex: 1, minWidth: 0 }}>
          <Section>
            <Section.Container>
              <h1 className="text-2xl font-semibold text-heading">{labelOf(page)}</h1>
              <p className="mt-2 text-body">Page content for “{labelOf(page)}”.</p>
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
    // Navbar on top, SideNav directly under it on the left.
    const bar = canvas.getByRole('navigation', { name: 'Main' }).getBoundingClientRect();
    await expect(sidebar.getBoundingClientRect().top).toBe(bar.bottom);
    await expect(sidebar.getBoundingClientRect().left).toBe(0);

    // Navigating in the SideNav updates the page.
    const side = within(sidebar);
    await userEvent.click(side.getByRole('button', { name: 'Sales' }));
    await userEvent.click(side.getByRole('button', { name: 'Customers' }));
    await expect(heading()).toHaveTextContent('Customers');
    await expect(side.getByRole('button', { name: 'Customers' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    // Navbar menus work alongside it.
    await userEvent.click(canvas.getByRole('combobox', { name: 'Apps' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Payments' }));
    await expect(canvas.getByText('Payments')).toBeInTheDocument();
  },
};
