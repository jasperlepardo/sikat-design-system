import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Table, type TableSort } from './Table';
import { Button } from '../Button/Button';
import { Link } from '../Button/Link';
import { Icon } from '../Icon/Icon';
import { Card } from '../Card/Card';
import { Panel } from '../Panel/Panel';
import { PanelHeader } from '../Panel/PanelHeader';
import { Text } from '../Text/Text';

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

type Order = {
  id: string;
  product: string;
  customer: string;
  email: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  amount: string;
  note: string;
};

const ORDERS: Order[] = [
  { id: 'SO-1042', product: 'Steel bolts',   customer: 'Sikat Tech', email: 'ops@sikat.ph',     status: 'Paid',    amount: '12,450.00', note: 'Net 30' },
  { id: 'SO-1043', product: 'Copper wire',   customer: 'Acme Corp',  email: 'buy@acme.com',     status: 'Pending', amount: '3,980.50',  note: 'COD'    },
  { id: 'SO-1044', product: 'PVC pipes',     customer: 'Globex',     email: 'ap@globex.io',     status: 'Overdue', amount: '870.00',    note: 'Net 15' },
  { id: 'SO-1045', product: 'Hex nuts',      customer: 'Umbrella',   email: 'po@umbrella.com',  status: 'Paid',    amount: '5,200.00',  note: 'Net 60' },
  { id: 'SO-1046', product: 'Angle bars',    customer: 'Initech',    email: 'buy@initech.com',  status: 'Pending', amount: '9,100.00',  note: 'Net 30' },
  { id: 'SO-1047', product: 'Sheet metal',   customer: 'Hooli',      email: 'ops@hooli.com',    status: 'Overdue', amount: '1,340.00',  note: 'COD'    },
  { id: 'SO-1048', product: 'Welding rods',  customer: 'Dunder',     email: 'ap@dunder.com',    status: 'Paid',    amount: '7,830.00',  note: 'Net 60' },
  { id: 'SO-1049', product: 'Safety gloves', customer: 'Pied Piper', email: 'po@piedpiper.com', status: 'Pending', amount: '2,120.00',  note: 'Net 15' },
];

const statusIntent = (s: Order['status']) =>
  s === 'Paid' ? 'success' : s === 'Pending' ? 'warning' : 'danger';

/** Visible height of a body row — excludes the 2px transparent top border. */
const visibleRowHeight = (row: HTMLElement) =>
  row.getBoundingClientRect().height -
  parseFloat(getComputedStyle(row.querySelector('td')!).borderTopWidth);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { columns: [], rows: [], getRowId: () => '' },
} satisfies Meta<typeof Table>;

export default meta;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

type PlaygroundArgs = {
  onRowAction: (row: Order) => void;
  onColumnSettings: () => void;
  onPageChange: (page: number) => void;
};

/** Full-featured: selection, sort, row actions, header actions, pagination. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { onRowAction: fn(), onColumnSettings: fn(), onPageChange: fn() },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    return (
      <Card style={{ width: 860 }}>
        <Table
          caption="Orders"
          getRowId={(r) => r.id}
          rows={ORDERS.slice(0, 4)}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          rowActions={(row) => [{ type: 'button', icon: <Icon size={20}>more_horiz</Icon>, label: `Actions for row ${row.id}`, onClick: () => args.onRowAction(row) }]}
          headerActions={[{ type: 'button', icon: <Icon size={20}>tune</Icon>, label: 'Column settings', onClick: args.onColumnSettings }]}
          pagination={{ page, pageSize: 10, total: 89, onPageChange: (p) => { setPage(p); args.onPageChange(p); } }}
          columns={[
            { key: 'id',       header: 'Order',    cell: (r) => <Table.Content onClick={() => {}}>{r.id}</Table.Content> },
            { key: 'product',  header: 'Product',  cell: (r) => <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content> },
            { key: 'customer', header: 'Customer', cell: (r) => <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.customer}</Table.Content> },
            { key: 'status',   header: 'Status',   cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
            { key: 'amount',   header: 'Amount',   align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
          ]}
        />
      </Card>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Orders' });
    for (const th of within(table).getAllByRole('columnheader'))
      await expect(th.clientHeight).toBe(36);

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select row SO-1042' }));
    await expect(within(table).getAllByRole('row')[1]).toHaveAttribute('data-selected', 'true');
    const all = canvas.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
    await expect(all.indeterminate).toBe(true);

    await userEvent.click(canvas.getByRole('button', { name: 'Actions for row SO-1043' }));
    await expect(args.onRowAction).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'SO-1043' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Column settings' }));
    await expect(args.onColumnSettings).toHaveBeenCalledOnce();
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(2);
  },
};

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

/** Sortable columns — clicking a header cycles asc → desc → off. */
export const Sorting: StoryObj<typeof meta> = {
  render: () => {
    const [sort, setSort] = useState<TableSort | null>(null);
    const rows = useMemo(() => {
      if (!sort) return ORDERS.slice(0, 4);
      const dir = sort.direction === 'asc' ? 1 : -1;
      return [...ORDERS.slice(0, 4)].sort((x, y) => {
        const a = x[sort.key as keyof Order];
        const b = y[sort.key as keyof Order];
        return (a > b ? 1 : a < b ? -1 : 0) * dir;
      });
    }, [sort]);
    return (
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        rows={rows}
        sort={sort}
        onSortChange={setSort}
        columns={[
          { key: 'id',       header: 'Order',    sortable: true },
          { key: 'product',  header: 'Product',  sortable: true },
          { key: 'customer', header: 'Customer', sortable: true },
          { key: 'status',   header: 'Status',   cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
          { key: 'amount',   header: 'Amount',   sortable: true, align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
        ]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader', { name: /Customer/ });
    const firstCustomer = () => within(canvas.getAllByRole('row')[1]).getAllByRole('cell')[2];
    await userEvent.click(canvas.getByRole('button', { name: 'Sort by Customer' }));
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(firstCustomer()).toHaveTextContent('Acme Corp');
    await userEvent.click(canvas.getByRole('button', { name: 'Sort by Customer' }));
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(firstCustomer()).toHaveTextContent('Umbrella');
    await userEvent.click(canvas.getByRole('button', { name: 'Sort by Customer' }));
    await expect(header).not.toHaveAttribute('aria-sort');
  },
};

// ---------------------------------------------------------------------------
// Scroll
// ---------------------------------------------------------------------------

/** Wider than its container — the scroll indicator thumb tracks horizontal scroll. */
export const Scroll: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 480 }}>
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        rows={ORDERS.slice(0, 4)}
        scroll
        selectable
        columns={[
          { key: 'id',       header: 'Order' },
          { key: 'product',  header: 'Product' },
          { key: 'customer', header: 'Customer' },
          { key: 'status',   header: 'Status',  cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
          { key: 'amount',   header: 'Amount',  align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
          { key: 'note',     header: 'Terms' },
        ]}
        rowActions={[{ type: 'button', icon: <Icon size={20}>more_horiz</Icon>, label: 'Row actions', onClick: () => {} }]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const thumb = canvasElement.querySelector<HTMLElement>('.sikat-table__scroll-thumb');
    await expect(thumb).not.toBeNull();
    await expect(thumb!.style.left).toBe('0%');
    const scroller = canvasElement.querySelector<HTMLElement>('.sikat-table__scroller')!;
    scroller.scrollLeft = scroller.scrollWidth;
    await new Promise((r) => setTimeout(r, 50));
    await expect(parseFloat(thumb!.style.left) + parseFloat(thumb!.style.width)).toBeCloseTo(100, 0);
  },
};

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

/** `layout="scroll"` — table height-capped at `min(60dvh, 36rem)`; rows scroll vertically. */
export const LayoutScroll: StoryObj<typeof meta> = {
  name: 'Layout · Scroll',
  render: () => (
    <Card>
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        rows={ORDERS}
        layout="scroll"
        columns={[
          { key: 'id',       header: 'Order',    cell: (r) => <Table.Content onClick={() => {}}>{r.id}</Table.Content> },
          { key: 'product',  header: 'Product',  cell: (r) => <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content> },
          { key: 'customer', header: 'Customer', cell: (r) => <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.customer}</Table.Content> },
          { key: 'status',   header: 'Status',   cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
          { key: 'amount',   header: 'Amount',   align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
        ]}
      />
    </Card>
  ),
};

/** `layout="fill"` — table grows to fill its flex container; rows scroll under a sticky header.
 *  The parent must constrain the height (flex column with `overflow: hidden`). */
export const LayoutFill: StoryObj<typeof meta> = {
  name: 'Layout · Fill',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: 320, overflow: 'hidden' }}>
      <Card style={{ flex: '0 1 auto', minHeight: 0 }}>
        <Table
          caption="Orders"
          getRowId={(r) => r.id}
          rows={ORDERS}
          layout="fill"
          columns={[
            { key: 'id',       header: 'Order',    cell: (r) => <Table.Content onClick={() => {}}>{r.id}</Table.Content> },
            { key: 'product',  header: 'Product',  cell: (r) => <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content> },
            { key: 'customer', header: 'Customer', cell: (r) => <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.customer}</Table.Content> },
            { key: 'status',   header: 'Status',   cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
            { key: 'amount',   header: 'Amount',   align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
          ]}
        />
      </Card>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Footer row
// ---------------------------------------------------------------------------

/** `footerRow` — a full-width row in `<tfoot>` for add-a-line inputs or aggregate footers. */
export const FooterRow: StoryObj<typeof meta> = {
  render: () => (
    <Table
      caption="Orders"
      getRowId={(r) => r.id}
      rows={ORDERS.slice(0, 3)}
      footerRow={
        <Button intent="default" variant="ghost" size="medium" leadingIcon={<Icon size={20}>add</Icon>}>
          Add line item
        </Button>
      }
      columns={[
        { key: 'id',      header: 'Order' },
        { key: 'product', header: 'Product' },
        { key: 'status',  header: 'Status', cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
        { key: 'amount',  header: 'Amount', align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
      ]}
    />
  ),
};

// ---------------------------------------------------------------------------
// Cell types
// ---------------------------------------------------------------------------

/** All Table.Content, Table.Status, Table.Amount, and Table.Actions variants together. */
export const CellTypes: StoryObj<typeof meta> = {
  name: 'Cell · All Types',
  render: () => {
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (id: string) =>
      setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
    return (
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        rows={ORDERS.slice(0, 4)}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        rowActions={(row) => [{ type: 'button', icon: <Icon size={20}>more_horiz</Icon>, label: `Actions for row ${row.id}`, onClick: () => {} }]}
        columns={[
          { key: 'drag',   header: 'Reorder', srOnlyHeader: true, cell: () => <Table.Actions items={[{ type: 'drag' }]} /> },
          { key: 'expand', header: 'Expand',  srOnlyHeader: true, cell: (r) => <Table.Actions items={[{ type: 'expand', expanded: expanded.includes(r.id), onToggle: () => toggle(r.id) }]} /> },
          { key: 'id',       header: 'Order',    cell: (r) => <Table.Content onClick={() => {}}>{r.id}</Table.Content> },
          { key: 'product',  header: 'Product',  cell: (r) => <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content> },
          { key: 'customer', header: 'Customer', cell: (r) => <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.customer}</Table.Content> },
          { key: 'status',   header: 'Status',   cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
          { key: 'amount',   header: 'Amount',   align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
          { key: 'note',     header: 'Terms',    cell: (r) => <Table.Content subcopy="Payment terms">{r.note}</Table.Content> },
          {
            key: 'cta', header: 'Actions',
            cell: () => (
              <Table.Actions>
                <Button intent="default" variant="ghost" size="medium" leadingIcon={<Icon size={20}>edit</Icon>}>Edit</Button>
                <Button intent="default" variant="ghost" size="medium" leadingIcon={<Icon size={20}>delete</Icon>}>Delete</Button>
              </Table.Actions>
            ),
          },
        ]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvas.getAllByRole('row').slice(1);
    for (const r of rows) await expect(Math.round(visibleRowHeight(r))).toBe(60);
    const expand = within(rows[1]).getByRole('button', { name: 'Expand row' });
    await userEvent.click(expand);
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expect(within(rows[0]).getByRole('button', { name: 'SO-1042' })).toBeInTheDocument();
    await expect(within(rows[2]).getByText('Overdue')).toBeInTheDocument();
    await expect(within(rows[0]).getByText('PHP')).toBeInTheDocument();
  },
};

// ---------------------------------------------------------------------------
// Table.Content variants
// ---------------------------------------------------------------------------

/** Table.Content — link (onClick / href), media, decorative icon, user avatar, subcopy, text stack, inline link. */
export const TableContentVariants: StoryObj<typeof meta> = {
  name: 'Cell · Content',
  render: () => (
    <Table
      caption="Content variants"
      getRowId={(r) => r.id}
      rows={ORDERS.slice(0, 3)}
      columns={[
        { key: 'button',  header: 'Button link',   cell: (r) => <Table.Content onClick={() => {}}>{r.id}</Table.Content> },
        { key: 'href',    header: 'Anchor link',    cell: (r) => <Table.Content href="#">{r.id}</Table.Content> },
        { key: 'media',   header: 'Media icon',     cell: (r) => <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content> },
        { key: 'decicon', header: 'Decorative icon',cell: (r) => <Table.Content decorativeIcon={{ icon: 'package_2', intent: 'primary', variant: 'subtle' }}>{r.product}</Table.Content> },
        { key: 'user',    header: 'User avatar',    cell: (r) => <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.customer}</Table.Content> },
        { key: 'subcopy', header: 'Subcopy',        cell: (r) => <Table.Content subcopy="Payment terms">{r.note}</Table.Content> },
        { key: 'texts',   header: 'Text stack',     cell: (r) => (
          <Table.Content texts={[
            { variant: 'caption', tone: 'muted', children: 'Order' },
            { variant: 'small', weight: 'semibold', children: r.id },
            { variant: 'caption', tone: 'muted', children: r.product },
          ]} />
        )},
        { key: 'inline',  header: 'Inline link',    cell: (r) => (
          <Table.Content subcopy={<Text variant="caption" as="span">Ref: <Link href="#" intent="primary">{r.id}</Link></Text>}>
            {r.product}
          </Table.Content>
        )},
      ]}
    />
  ),
};

// ---------------------------------------------------------------------------
// Avatar variants
// ---------------------------------------------------------------------------

type Person = { id: string; name: string; email: string; avatarSrc?: string };
const PEOPLE: Person[] = [
  { id: '1', name: 'Juan dela Cruz', email: 'ops@sikat.ph'  },
  { id: '2', name: 'Maria Santos',   email: 'buy@acme.com'  },
  { id: '3', name: 'Pedro Reyes',    email: 'ap@globex.io'  },
];

/** Avatar — intent, variant, shape, icon, and photo (avatarSrc) options via the `avatar` prop. */
export const AvatarVariants: StoryObj<typeof meta> = {
  name: 'Cell · Avatar',
  render: () => (
    <Table
      caption="Avatar variants"
      getRowId={(r) => r.id}
      rows={PEOPLE}
      columns={[
        { key: 'default',  header: 'Primary / Subtle (default)', cell: (r) => <Table.Content initials={r.name.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.name}</Table.Content> },
        { key: 'neutral',  header: 'Default / Subtle',           cell: (r) => <Table.Content avatar={{ intent: 'default', variant: 'subtle' }} initials={r.name.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.name}</Table.Content> },
        { key: 'solid',    header: 'Primary / Solid',            cell: (r) => <Table.Content avatar={{ intent: 'primary', variant: 'solid' }} initials={r.name.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.name}</Table.Content> },
        { key: 'outline',  header: 'Outline',                    cell: (r) => <Table.Content avatar={{ variant: 'outline' }} initials={r.name.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.name}</Table.Content> },
        { key: 'rounded',  header: 'Rounded',                    cell: (r) => <Table.Content avatar={{ shape: 'rounded' }} initials={r.name.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.name}</Table.Content> },
        { key: 'icon',     header: 'Icon',                       cell: (r) => <Table.Content avatar={{ icon: 'person' }} subcopy={r.email}>{r.name}</Table.Content> },
      ]}
    />
  ),
};

// ---------------------------------------------------------------------------
// Cell · Status / Amount / Actions
// ---------------------------------------------------------------------------

/** Table.Status — all intents. */
export const CellStatus: StoryObj<typeof meta> = {
  name: 'Cell · Status',
  render: () => (
    <div style={{ display: 'flex', gap: 8, padding: 12 }}>
      <Table.Status intent="success">Paid</Table.Status>
      <Table.Status intent="warning">Pending</Table.Status>
      <Table.Status intent="danger">Overdue</Table.Status>
      <Table.Status intent="primary">Processing</Table.Status>
      <Table.Status intent="default">Draft</Table.Status>
    </div>
  ),
};

/** Table.Amount — currency badge + bold value; omit `currency` to hide the badge. */
export const CellAmount: StoryObj<typeof meta> = {
  name: 'Cell · Amount',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
      <Table.Amount currency="PHP">12,450.00</Table.Amount>
      <Table.Amount currency="USD">3,980.50</Table.Amount>
      <Table.Amount>870.00</Table.Amount>
    </div>
  ),
};

/** Table.Actions — drag handle, expand toggle, and icon button item types. */
export const CellActions: StoryObj<typeof meta> = {
  name: 'Cell · Actions',
  render: () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div style={{ display: 'flex', gap: 24, padding: 12, alignItems: 'center' }}>
        <Table.Actions items={[{ type: 'drag' }]} />
        <Table.Actions items={[{ type: 'expand', expanded, onToggle: () => setExpanded((e) => !e) }]} />
        <Table.Actions items={[
          { type: 'button', icon: <Icon size={20}>edit</Icon>,   label: 'Edit',   onClick: () => {} },
          { type: 'button', icon: <Icon size={20}>delete</Icon>, label: 'Delete', onClick: () => {} },
        ]} />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Tree rows
// ---------------------------------------------------------------------------

type TreeOrder = { id: string; name: string; qty: string; amount: string; children?: TreeOrder[] };

const TREE: TreeOrder[] = [
  {
    id: 'SO-1042', name: 'Sikat Tech', qty: '3', amount: '12,450.00',
    children: [
      { id: 'SO-1042-1', name: 'Steel bolts', qty: '2', amount: '8,000.00',
        children: [
          { id: 'LOT-A', name: 'Lot A', qty: '1', amount: '5,000.00' },
          { id: 'LOT-B', name: 'Lot B', qty: '1', amount: '3,000.00' },
        ],
      },
      { id: 'SO-1042-2', name: 'Hex nuts', qty: '1', amount: '4,450.00' },
    ],
  },
  {
    id: 'SO-1043', name: 'Acme Corp', qty: '1', amount: '3,980.50',
    children: [{ id: 'SO-1043-1', name: 'Copper wire', qty: '1', amount: '3,980.50' }],
  },
  { id: 'SO-1044', name: 'Globex', qty: '1', amount: '870.00' },
];

const TREE_EXPANDABLE_IDS = (() => {
  const ids: string[] = [];
  const collect = (rows: TreeOrder[]) => {
    for (const r of rows) { if (r.children?.length) { ids.push(r.id); collect(r.children); } }
  };
  collect(TREE);
  return ids;
})();

/** Tree grid — `getSubRows` nests rows; expand chevron in first column; cascading selection. */
export const TreeRows: StoryObj<{ onRowAction: (row: TreeOrder) => void }> = {
  args: { onRowAction: fn() },
  parameters: { docs: { source: { type: 'code', code: '// See Table.stories.tsx → TreeRows' } } },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>(['SO-1042', 'SO-1042-1']);
    const allExpanded = TREE_EXPANDABLE_IDS.every((id) => expanded.includes(id));
    return (
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        getSubRows={(r) => r.children}
        expandedIds={expanded}
        onExpandedChange={setExpanded}
        rows={TREE}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        rowActions={(row) => [{ type: 'button', icon: <Icon size={20}>more_horiz</Icon>, label: `Actions for row ${row.id}`, onClick: () => args.onRowAction(row) }]}
        columns={[
          {
            key: 'id',
            header: 'Order',
            headerIcon: (
              <Button
                intent="default"
                variant="link"
                size="2xs"
                aria-label={allExpanded ? 'Collapse all rows' : 'Expand all rows'}
                onClick={() => setExpanded(allExpanded ? [] : TREE_EXPANDABLE_IDS)}
                leadingIcon={<Icon size={20}>{allExpanded ? 'collapse_all' : 'expand_all'}</Icon>}
              />
            ),
          },
          { key: 'name',   header: 'Name' },
          { key: 'qty',    header: 'Qty' },
          { key: 'amount', header: 'Amount', align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
        ]}
      />
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('treegrid', { name: 'Orders' });
    const bodyRows = () => within(grid).getAllByRole('row').slice(1);
    const row = (id: string) => grid.querySelector<HTMLElement>(`tr[data-row-id="${id}"]`)!;

    await expect(bodyRows()).toHaveLength(7);
    await expect(row('LOT-A')).toHaveAttribute('aria-level', '3');
    const indent = (id: string) =>
      parseFloat(getComputedStyle(row(id).querySelector('.sikat-table__tree')!).paddingLeft);
    await expect(indent('LOT-A')).toBeGreaterThan(indent('SO-1042'));

    const expand = canvas.getByRole('button', { name: 'Expand row SO-1043' });
    await userEvent.click(expand);
    await expect(row('SO-1043')).toHaveAttribute('aria-expanded', 'true');
    await expect(bodyRows()).toHaveLength(8);

    const chevron = canvas.getByRole('button', { name: 'Collapse row SO-1043' });
    chevron.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(bodyRows()).toHaveLength(7);
    await userEvent.keyboard('{ArrowRight}');
    await expect(bodyRows()).toHaveLength(8);
    await userEvent.keyboard('{ArrowRight}');
    await expect(document.activeElement).toBe(
      canvas.getByRole('checkbox', { name: 'Select row SO-1043-1' }),
    );

    const check = (id: string) =>
      canvas.getByRole('checkbox', { name: `Select row ${id}` }) as HTMLInputElement;
    await userEvent.click(check('SO-1042'));
    for (const id of ['SO-1042-1', 'LOT-A', 'LOT-B', 'SO-1042-2'])
      await expect(check(id).checked).toBe(true);
    await userEvent.click(check('LOT-B'));
    await expect(check('SO-1042-1').indeterminate).toBe(true);
    await expect(check('SO-1042').indeterminate).toBe(true);
    await userEvent.click(check('LOT-B'));
    await expect(check('SO-1042').checked).toBe(true);

    await userEvent.click(canvas.getByRole('button', { name: 'Actions for row LOT-A' }));
    await expect(args.onRowAction).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'LOT-A' }));
  },
};

// ---------------------------------------------------------------------------
// In Panel
// ---------------------------------------------------------------------------

/** Table inside a Panel with PanelHeader — typical production layout. */
export const InPanel: StoryObj<PlaygroundArgs> = {
  args: { onRowAction: fn(), onColumnSettings: fn(), onPageChange: fn() },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    return (
      <div style={{ padding: 8, background: 'var(--color-bg-secondary)' }}>
        <Panel>
          <PanelHeader
            icon="table_rows"
            iconVariant="solid"
            title="Orders"
            actions={<Button intent="primary" variant="solid" size="extra-large">New Order</Button>}
          />
          <Panel.Body>
            <Card>
              <Table
                caption="Orders"
                getRowId={(r) => r.id}
                rows={ORDERS.slice(0, 4)}
                selectable
                selectedIds={selected}
                onSelectionChange={setSelected}
                rowActions={(row) => [{ type: 'button', icon: <Icon size={20}>more_horiz</Icon>, label: `Actions for row ${row.id}`, onClick: () => args.onRowAction(row) }]}
                headerActions={[{ type: 'button', icon: <Icon size={20}>tune</Icon>, label: 'Column settings', onClick: args.onColumnSettings }]}
                pagination={{ page, pageSize: 10, total: 89, onPageChange: (p) => { setPage(p); args.onPageChange(p); } }}
                columns={[
                  { key: 'id',       header: 'Order',    cell: (r) => <Table.Content onClick={() => {}}>{r.id}</Table.Content> },
                  { key: 'product',  header: 'Product',  cell: (r) => <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content> },
                  { key: 'customer', header: 'Customer', cell: (r) => <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>{r.customer}</Table.Content> },
                  { key: 'status',   header: 'Status',   cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status> },
                  { key: 'amount',   header: 'Amount',   align: 'end', cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount> },
                ]}
              />
            </Card>
          </Panel.Body>
        </Panel>
      </div>
    );
  },
};
