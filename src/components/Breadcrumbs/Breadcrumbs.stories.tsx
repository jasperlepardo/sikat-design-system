import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';
import { Panel } from '../Panel/Panel';
import { PanelHeader } from '../Panel/PanelHeader';
import { Button } from '../Button/Button';

const TRAIL: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'sales', label: 'Sales', href: '#sales' },
  { id: 'orders', label: 'Orders', href: '#orders' },
  { id: 'so-1042', label: 'SO-1042' },
];

const LONG_TRAIL: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'sikat', label: 'Sikat Tech Inc.', href: '#org' },
  { id: 'sales', label: 'Sales', href: '#sales' },
  { id: 'orders', label: 'Orders', href: '#orders' },
  { id: 'so-1042', label: 'SO-1042', href: '#so-1042' },
  { id: 'line-1', label: 'Line 1' },
];

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  // As with a router: handle the click instead of following the href.
  args: { items: TRAIL, maxItems: 4, onNavigate: fn((_, e) => e.preventDefault()) },
  argTypes: {
    maxItems: { control: { type: 'number', min: 2 } },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(4);
    await expect(canvas.getByText('SO-1042')).toHaveAttribute('aria-current', 'page');
    // The current page isn't a link; ancestors are, and report navigation.
    await expect(within(nav).getAllByRole('link')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('link', { name: 'Sales' }));
    await expect(args.onNavigate).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'sales' }),
      expect.anything(),
    );
  },
};

/** Past `maxItems`, the middle folds into "…"; clicking it shows the full trail. */
export const Collapsed: Story = {
  args: { items: LONG_TRAIL },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    // Home, …, SO-1042, Line 1.
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(4);
    await expect(canvas.queryByText('Sales')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Show 3 more' }));
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(LONG_TRAIL.length);
    await expect(canvas.getByRole('link', { name: 'Sales' })).toBeInTheDocument();
  },
};

/** Typical layout: the trail sits on the page, above the Panel. */
export const AbovePanel: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-2)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <Breadcrumbs {...args} />
      <Panel>
        <PanelHeader
          icon="receipt_long"
          title="SO-1042"
          subcopy="Sikat Tech · Paid"
          actions={
            <Button intent="primary" variant="solid" size="extra-large">
              Edit
            </Button>
          }
        />
        <Panel.Body>Order details…</Panel.Body>
      </Panel>
    </div>
  ),
};

const TRAILS: BreadcrumbItem[][] = [
  [
    { id: '/purchasing/dashboard', label: 'Purchasing', href: '#/purchasing/dashboard' },
    { id: '/purchasing/dashboard', label: 'Dashboard' },
  ],
  [
    { id: '/sales/dashboard', label: 'Sales', href: '#/sales/dashboard' },
    { id: '/sales/dashboard', label: 'Dashboard' },
  ],
];

/**
 * A module's first page: the module crumb and the page crumb share an id.
 * Switching trails must replace the crumbs, not pile them up.
 */
export const SharedIds: Story = {
  render: function Render(args) {
    const [n, setN] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'start' }}>
        <Breadcrumbs {...args} items={TRAILS[n % 2]} />
        <Button intent="default" variant="solid" size="small" onClick={() => setN(n + 1)}>
          Switch module
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (let i = 0; i < 3; i++) {
      await userEvent.click(canvas.getByRole('button', { name: 'Switch module' }));
      await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    }
  },
};
