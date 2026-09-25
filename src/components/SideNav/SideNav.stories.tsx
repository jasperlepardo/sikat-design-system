import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  SideNav,
  SideNavIcon,
  sideNavOrientations,
  type SideNavItem,
  type SideNavOrientation,
  type SideNavSection,
} from './SideNav';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';
import home from './assets/home.svg';
import inventory2 from './assets/inventory-2.svg';
import discount from './assets/discount.svg';
import shoppingCart from './assets/shopping-cart.svg';
import widgets from './assets/widgets.svg';
import accountTree from './assets/account-tree.svg';
import importContacts from './assets/import-contacts.svg';

const sub = (prefix: string, labels: string[]): SideNavItem[] =>
  labels.map((label) => ({ id: `${prefix}/${label.toLowerCase().replace(/\W+/g, '-')}`, label }));

/** The Figma Side Navigation Bar content (modules + their Submenus). */
const SECTIONS: SideNavSection[] = [
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
        items: sub('procurement', [
          'Purchase Request',
          'RFQs',
          'Purchase Orders',
          'Receiving',
          'Vendor Invoices',
          'Payables',
          'Returns',
        ]),
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: <SideNavIcon src={widgets} />,
        items: sub('inventory', [
          'Stock',
          'Warehouse',
          'Transfers',
          'Counts',
          'Adjustments',
          'Issuance',
          'Tracking',
        ]),
      },
      {
        id: 'accounting',
        label: 'Accounting',
        icon: <SideNavIcon src={accountTree} />,
        items: sub('accounting', [
          'General Ledger',
          'Accounts Receivable',
          'Accounts Payable',
          'Cash & Bank',
          'Inventory Accounting',
          'Fixed Assets',
          'Period Close',
        ]),
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    items: [
      // Figma shows these as modules (chevron) without a Submenu — dummy sub-items.
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

const MODULES = ['default', 'sales', 'procurement', 'inventory', 'accounting', 'item'] as const;

const meta = {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { sections: SECTIONS, onNavigate: fn() },
} satisfies Meta<typeof SideNav>;

export default meta;

/**
 * Controls mirror the Figma Side Navigation Bar properties 1:1 — Orientation and
 * Active Module (the module whose Submenu is open).
 */
type SideNavPlaygroundArgs = {
  Orientation: SideNavOrientation;
  activeModule: (typeof MODULES)[number];
  onNavigate: (id: string) => void;
};

function PlaygroundSideNav({ Orientation, activeModule, onNavigate }: SideNavPlaygroundArgs) {
  const [activeId, setActiveId] = useState<string>();
  const [openId, setOpenId] = useState<string | null>(
    activeModule === 'default' ? null : activeModule,
  );
  return (
    <div style={{ height: 1016 }}>
      <SideNav
        key={`${Orientation}-${activeModule}`}
        sections={SECTIONS}
        orientation={Orientation}
        activeId={activeId}
        openId={openId}
        onOpenChange={setOpenId}
        onNavigate={(id) => {
          setActiveId(id);
          onNavigate(id);
        }}
      />
    </div>
  );
}

export const Playground: StoryObj<SideNavPlaygroundArgs> = {
  args: { Orientation: 'expanded', activeModule: 'default', onNavigate: fn() },
  argTypes: {
    Orientation: figmaSelect('Orientation', sideNavOrientations, ['Expanded', 'Compact']),
    activeModule: figmaSelect('Active Module', MODULES, [
      'Default',
      'Sales',
      'Procurement',
      'Inventory',
      'Accounting',
      'Item',
    ]),
  },
  parameters: figmaControls(['Orientation', 'Active Module']),
  render: (args) => <PlaygroundSideNav {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Sidebar' });
    await expect(nav.getBoundingClientRect().width).toBe(260);
    const row = (name: string) => canvas.getByRole('button', { name });
    await expect(row('Home').getBoundingClientRect().height).toBe(36);

    // A module opens its Submenu (one at a time); picking a sub-item makes it Active.
    await userEvent.click(row('Sales'));
    await expect(row('Sales')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(row('Invoices'));
    await expect(args.onNavigate).toHaveBeenLastCalledWith('sales/invoices');
    await expect(row('Invoices')).toHaveAttribute('aria-current', 'page');
    await userEvent.click(row('Procurement'));
    await expect(row('Sales')).toHaveAttribute('aria-expanded', 'false');
    await expect(row('Sales')).toHaveAttribute('data-active', 'true');
    await expect(canvas.queryByRole('button', { name: 'Invoices' })).toBeNull();

    // A leaf is Active on its own; the open module stays open.
    await userEvent.click(row('Home'));
    await expect(row('Home')).toHaveAttribute('aria-current', 'page');
    await expect(row('Procurement')).toHaveAttribute('aria-expanded', 'true');
  },
};

/** Figma Active Module = Sales: the Sales Submenu open, a sub-item current. */
export const SalesOpen: StoryObj<typeof meta> = {
  args: { activeId: 'sales/sales-order' },
  render: (args) => (
    <div style={{ height: 720 }}>
      <SideNav {...args} />
    </div>
  ),
};

/** Figma Orientation = Compact: the icon rail. */
export const Compact: StoryObj<typeof meta> = {
  args: { orientation: 'compact', activeId: 'procurement/rfqs' },
  render: (args) => (
    <div style={{ height: 720 }}>
      <SideNav {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation').getBoundingClientRect().width).toBe(120);
    await expect(canvas.getByRole('button', { name: 'Procurement' })).toHaveAttribute(
      'data-active',
      'true',
    );
    await expect(canvas.queryByText('Operations')).toBeNull();
    await expect(canvas.queryByRole('button', { name: 'RFQs' })).toBeNull();
    // Labels aren't truncated (Figma lets "Configurations" overflow the column).
    const label = within(canvas.getByRole('button', { name: 'Configurations' })).getByText(
      'Configurations',
    );
    await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
  },
};
