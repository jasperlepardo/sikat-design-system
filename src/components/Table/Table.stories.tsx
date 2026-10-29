import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Table } from './Table';
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
  {
    id: 'SO-1042',
    product: 'Steel bolts',
    customer: 'Sikat Tech',
    email: 'ops@sikat.ph',
    status: 'Paid',
    amount: '12,450.00',
    note: 'Net 30',
  },
  {
    id: 'SO-1043',
    product: 'Copper wire',
    customer: 'Acme Corp',
    email: 'buy@acme.com',
    status: 'Pending',
    amount: '3,980.50',
    note: 'COD',
  },
  {
    id: 'SO-1044',
    product: 'PVC pipes',
    customer: 'Globex',
    email: 'ap@globex.io',
    status: 'Overdue',
    amount: '870.00',
    note: 'Net 15',
  },
  {
    id: 'SO-1045',
    product: 'Hex nuts',
    customer: 'Umbrella',
    email: 'po@umbrella.com',
    status: 'Paid',
    amount: '5,200.00',
    note: 'Net 60',
  },
  {
    id: 'SO-1046',
    product: 'Angle bars',
    customer: 'Initech',
    email: 'buy@initech.com',
    status: 'Pending',
    amount: '9,100.00',
    note: 'Net 30',
  },
  {
    id: 'SO-1047',
    product: 'Sheet metal',
    customer: 'Hooli',
    email: 'ops@hooli.com',
    status: 'Overdue',
    amount: '1,340.00',
    note: 'COD',
  },
  {
    id: 'SO-1048',
    product: 'Welding rods',
    customer: 'Dunder',
    email: 'ap@dunder.com',
    status: 'Paid',
    amount: '7,830.00',
    note: 'Net 60',
  },
  {
    id: 'SO-1049',
    product: 'Safety gloves',
    customer: 'Pied Piper',
    email: 'po@piedpiper.com',
    status: 'Pending',
    amount: '2,120.00',
    note: 'Net 15',
  },
];

const statusIntent = (s: Order['status']) =>
  s === 'Paid' ? 'success' : s === 'Pending' ? 'warning' : 'danger';

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
          rowActions={(row) => [
            {
              type: 'button',
              icon: <Icon size={20}>more_horiz</Icon>,
              label: `Actions for row ${row.id}`,
              onClick: () => args.onRowAction(row),
            },
          ]}
          headerActions={[
            {
              type: 'button',
              icon: <Icon size={20}>tune</Icon>,
              label: 'Column settings',
              onClick: args.onColumnSettings,
            },
          ]}
          pagination={{
            page,
            pageSize: 10,
            total: 89,
            onPageChange: (p) => {
              setPage(p);
              args.onPageChange(p);
            },
          }}
          columns={[
            {
              key: 'id',
              header: 'Order',
              cell: (r) => <Table.Content href="#">{r.id}</Table.Content>,
            },
            {
              key: 'product',
              header: 'Product',
              cell: (r) => (
                <Table.Content media={<Icon size={24}>inventory_2</Icon>}>
                  {r.product}
                </Table.Content>
              ),
            },
            {
              key: 'customer',
              header: 'Customer',
              cell: (r) => (
                <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>
                  {r.customer}
                </Table.Content>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
            },
            {
              key: 'amount',
              header: 'Amount',
              align: 'end',
              cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
            },
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
    await expect(args.onRowAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'SO-1043' }),
    );
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

/** Built-in sorting — `sortRows` reorders rows, clicking a header cycles asc → desc → off.
 *  Uncontrolled: the Table owns sort state (no `sort`/`onSortChange` wiring needed). */
export const Sorting: StoryObj<typeof meta> = {
  render: () => (
    <Table
      caption="Orders"
      getRowId={(r) => r.id}
      rows={ORDERS.slice(0, 4)}
      sortRows
      columns={[
        { key: 'id', header: 'Order', sortable: true },
        { key: 'product', header: 'Product', sortable: true },
        { key: 'customer', header: 'Customer', sortable: true },
        {
          key: 'status',
          header: 'Status',
          cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
        },
        {
          key: 'amount',
          header: 'Amount',
          sortable: true,
          align: 'end',
          // Amounts are formatted strings ("1,340.00") — compare the parsed number.
          sortAccessor: (r) => Number(r.amount.replace(/,/g, '')),
          cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader', { name: /Customer/ });
    const sortBtn = () => canvas.getByRole('button', { name: /^Sort by Customer/ });
    const firstCustomer = () => within(canvas.getAllByRole('row')[1]).getAllByRole('cell')[2];
    await userEvent.click(sortBtn());
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(within(header).getByText('arrow_upward')).toBeInTheDocument();
    await expect(firstCustomer()).toHaveTextContent('Acme Corp');
    await userEvent.click(sortBtn());
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(within(header).getByText('arrow_downward')).toBeInTheDocument();
    await expect(firstCustomer()).toHaveTextContent('Umbrella');
    await userEvent.click(sortBtn());
    await expect(header).not.toHaveAttribute('aria-sort');
    await expect(within(header).getByText('unfold_more')).toBeInTheDocument();
  },
};

/** Multi-column sort — each header cycles independently and keeps the others; the small
 *  number shows sort priority. Rows order by status, then amount within each status. */
export const MultiSort: StoryObj<typeof meta> = {
  render: () => (
    <Table
      caption="Orders"
      getRowId={(r) => r.id}
      rows={ORDERS}
      multiSort
      sortRows
      defaultSort={[
        { key: 'status', direction: 'asc' },
        { key: 'amount', direction: 'desc' },
      ]}
      columns={[
        { key: 'id', header: 'Order', sortable: true },
        { key: 'customer', header: 'Customer', sortable: true },
        {
          key: 'status',
          header: 'Status',
          sortable: true,
          cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
        },
        {
          key: 'amount',
          header: 'Amount',
          sortable: true,
          align: 'end',
          sortAccessor: (r) => Number(r.amount.replace(/,/g, '')),
          cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const statusHeader = canvas.getByRole('columnheader', { name: /Status/ });
    const amountHeader = canvas.getByRole('columnheader', { name: /Amount/ });
    // defaultSort: both columns active, status is priority 1, amount priority 2.
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(amountHeader).toHaveAttribute('aria-sort', 'descending');
    await expect(within(statusHeader).getByText('1')).toBeInTheDocument();
    await expect(within(amountHeader).getByText('2')).toBeInTheDocument();
    // Within the first status group (Overdue), amount is descending.
    const statusOf = (row: HTMLElement) => within(row).getAllByRole('cell')[2];
    const rows = canvas.getAllByRole('row').slice(1);
    await expect(statusOf(rows[0])).toHaveTextContent('Overdue');
    // Amount starts descending; one click cycles it off, leaving status sorting intact.
    await userEvent.click(canvas.getByRole('button', { name: /^Sort by Amount/ }));
    await expect(amountHeader).not.toHaveAttribute('aria-sort');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');
  },
};

// ---------------------------------------------------------------------------
// Scroll
// ---------------------------------------------------------------------------

/** Wider than its container — scrolls horizontally with the native thin scrollbar. */
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
          { key: 'id', header: 'Order' },
          { key: 'product', header: 'Product' },
          { key: 'customer', header: 'Customer' },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
          },
          {
            key: 'amount',
            header: 'Amount',
            align: 'end',
            cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
          },
          { key: 'note', header: 'Terms' },
        ]}
        rowActions={[
          {
            type: 'button',
            icon: <Icon size={20}>more_horiz</Icon>,
            label: 'Row actions',
            onClick: () => {},
          },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.querySelector<HTMLElement>('.sikat-table__scroller')!;
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    scroller.scrollLeft = scroller.scrollWidth;
    await expect(scroller.scrollLeft).toBeGreaterThan(0);
  },
};

// ---------------------------------------------------------------------------
// Frozen columns
// ---------------------------------------------------------------------------

/** `freeze={{ start: 2, end: 1 }}` — the first two and the last column stay pinned
 *  while the middle scrolls horizontally. Boundary shadows appear over hidden content. */
export const FrozenColumns: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 520 }}>
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        rows={ORDERS.slice(0, 5)}
        freeze={{ start: 2, end: 1 }}
        columns={[
          { key: 'id', header: 'Order' },
          { key: 'product', header: 'Product' },
          { key: 'customer', header: 'Customer' },
          { key: 'email', header: 'Email' },
          { key: 'note', header: 'Terms' },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
          },
          {
            key: 'amount',
            header: 'Amount',
            align: 'end',
            cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
          },
        ]}
      />
    </div>
  ),
};

/** Freeze with `selectable` + `rowActions` — the checkbox auto-pins left and the
 *  actions column auto-pins right, so selection and actions stay visible. */
export const FrozenWithSelection: StoryObj<typeof meta> = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ width: 520 }}>
        <Table
          caption="Orders"
          getRowId={(r) => r.id}
          rows={ORDERS.slice(0, 5)}
          freeze={{ start: 1, end: 1 }}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          columns={[
            { key: 'id', header: 'Order' },
            { key: 'product', header: 'Product' },
            { key: 'customer', header: 'Customer' },
            { key: 'email', header: 'Email' },
            { key: 'note', header: 'Terms' },
            {
              key: 'amount',
              header: 'Amount',
              align: 'end',
              cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
            },
          ]}
          rowActions={[
            {
              type: 'button',
              icon: <Icon size={20}>more_horiz</Icon>,
              label: 'Row actions',
              onClick: () => {},
            },
          ]}
        />
      </div>
    );
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
          {
            key: 'id',
            header: 'Order',
            cell: (r) => <Table.Content href="#">{r.id}</Table.Content>,
          },
          {
            key: 'product',
            header: 'Product',
            cell: (r) => (
              <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            cell: (r) => (
              <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>
                {r.customer}
              </Table.Content>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
          },
          {
            key: 'amount',
            header: 'Amount',
            align: 'end',
            cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
          },
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
            {
              key: 'id',
              header: 'Order',
              cell: (r) => <Table.Content href="#">{r.id}</Table.Content>,
            },
            {
              key: 'product',
              header: 'Product',
              cell: (r) => (
                <Table.Content media={<Icon size={24}>inventory_2</Icon>}>
                  {r.product}
                </Table.Content>
              ),
            },
            {
              key: 'customer',
              header: 'Customer',
              cell: (r) => (
                <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>
                  {r.customer}
                </Table.Content>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
            },
            {
              key: 'amount',
              header: 'Amount',
              align: 'end',
              cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
            },
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
        <Button
          intent="default"
          variant="ghost"
          size="medium"
          leadingIcon={<Icon size={20}>add</Icon>}
        >
          Add line item
        </Button>
      }
      columns={[
        { key: 'id', header: 'Order' },
        { key: 'product', header: 'Product' },
        {
          key: 'status',
          header: 'Status',
          cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
        },
        {
          key: 'amount',
          header: 'Amount',
          align: 'end',
          cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
        },
      ]}
    />
  ),
};

// ---------------------------------------------------------------------------
// Spanning cells
// ---------------------------------------------------------------------------

/** `headerGroups` — a top header tier whose cells span several data columns.
 *  Here "Customer" spans the customer + email columns and "Order" spans the rest. */
export const HeaderGroups: StoryObj<typeof meta> = {
  render: () => (
    <Table
      caption="Orders by group"
      getRowId={(r) => r.id}
      rows={ORDERS.slice(0, 4)}
      headerGroups={[
        { header: 'Order', colSpan: 2 },
        { header: 'Customer', colSpan: 2 },
        { header: 'Amount', colSpan: 1, align: 'end' },
      ]}
      columns={[
        { key: 'id', header: 'Ref' },
        { key: 'product', header: 'Product' },
        { key: 'customer', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'amount', header: 'Total', align: 'end' },
      ]}
    />
  ),
};

/** `getSectionRow` — full-width rows interleaved between data rows. Here each
 *  status becomes a section header above its orders. */
export const SectionRows: StoryObj<typeof meta> = {
  render: () => {
    // A flat list where some entries are section markers.
    const grouped = (['Paid', 'Pending', 'Overdue'] as Order['status'][]).flatMap((status) => [
      { id: `section-${status}`, status, section: true } as Order & { section?: boolean },
      ...ORDERS.filter((o) => o.status === status).slice(0, 2),
    ]);
    return (
      <Table
        caption="Orders by status"
        getRowId={(r) => r.id}
        rows={grouped}
        getSectionRow={(r) => ((r as { section?: boolean }).section ? r.status : null)}
        columns={[
          { key: 'id', header: 'Order' },
          { key: 'product', header: 'Product' },
          { key: 'customer', header: 'Customer' },
          {
            key: 'amount',
            header: 'Amount',
            align: 'end',
            cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
          },
        ]}
      />
    );
  },
};

/** Per-cell `colSpan` — a cell absorbs the columns to its right. Here the
 *  "Overdue" rows merge Product + Customer into a single note cell. */
export const CellColSpan: StoryObj<typeof meta> = {
  render: () => (
    <Table
      caption="Orders with notes"
      getRowId={(r) => r.id}
      rows={ORDERS.slice(0, 5)}
      columns={[
        { key: 'id', header: 'Order' },
        {
          key: 'product',
          header: 'Product',
          span: (r) => (r.status === 'Overdue' ? { colSpan: 2 } : undefined),
          cell: (r) =>
            r.status === 'Overdue' ? (
              <em>⚠ Overdue — contact {r.customer}</em>
            ) : (
              r.product
            ),
        },
        { key: 'customer', header: 'Customer' },
        {
          key: 'amount',
          header: 'Amount',
          align: 'end',
          cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
        },
      ]}
    />
  ),
};

/** Per-cell `rowSpan` — the first cell of each status group merges down over its
 *  members (rows are pre-sorted into groups). rowSpan is ignored under `sortRows`
 *  or tree mode, where reordering would break the merge. */
export const CellRowSpan: StoryObj<typeof meta> = {
  render: () => {
    // Group consecutive rows by status so the merge is contiguous.
    const byStatus = [...ORDERS.slice(0, 6)].sort((a, b) => a.status.localeCompare(b.status));
    const runStart = byStatus.map((r, i) => i === 0 || byStatus[i - 1].status !== r.status);
    const runLength = (i: number) => {
      let n = 1;
      while (i + n < byStatus.length && byStatus[i + n].status === byStatus[i].status) n++;
      return n;
    };
    return (
      <Table
        caption="Orders grouped by status"
        getRowId={(r) => r.id}
        rows={byStatus}
        columns={[
          {
            key: 'status',
            header: 'Status',
            span: (r) => {
              const i = byStatus.indexOf(r);
              return runStart[i] ? { rowSpan: runLength(i) } : undefined;
            },
            cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
          },
          { key: 'id', header: 'Order' },
          { key: 'product', header: 'Product' },
          {
            key: 'amount',
            header: 'Amount',
            align: 'end',
            cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
          },
        ]}
      />
    );
  },
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
        rowActions={(row) => [
          {
            type: 'button',
            icon: <Icon size={20}>more_horiz</Icon>,
            label: `Actions for row ${row.id}`,
            onClick: () => {},
          },
        ]}
        columns={[
          {
            key: 'drag',
            header: 'Reorder',
            srOnlyHeader: true,
            cell: () => <Table.Actions items={[{ type: 'drag' }]} />,
          },
          {
            key: 'expand',
            header: 'Expand',
            srOnlyHeader: true,
            cell: (r) => (
              <Table.Actions
                items={[
                  {
                    type: 'expand',
                    expanded: expanded.includes(r.id),
                    onToggle: () => toggle(r.id),
                  },
                ]}
              />
            ),
          },
          {
            key: 'id',
            header: 'Order',
            cell: (r) => <Table.Content href="#">{r.id}</Table.Content>,
          },
          {
            key: 'product',
            header: 'Product',
            cell: (r) => (
              <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            cell: (r) => (
              <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>
                {r.customer}
              </Table.Content>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>,
          },
          {
            key: 'amount',
            header: 'Amount',
            align: 'end',
            cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
          },
          {
            key: 'note',
            header: 'Terms',
            cell: (r) => <Table.Content subcopy="Payment terms">{r.note}</Table.Content>,
          },
          {
            key: 'cta',
            header: 'Actions',
            cell: () => (
              <Table.Actions>
                <Button
                  intent="default"
                  variant="ghost"
                  size="medium"
                  leadingIcon={<Icon size={20}>edit</Icon>}
                >
                  Edit
                </Button>
                <Button
                  intent="default"
                  variant="ghost"
                  size="medium"
                  leadingIcon={<Icon size={20}>delete</Icon>}
                >
                  Delete
                </Button>
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
    for (const r of rows) await expect(Math.round(r.getBoundingClientRect().height)).toBe(60);
    const expand = within(rows[1]).getByRole('button', { name: 'Expand row' });
    await userEvent.click(expand);
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expect(within(rows[0]).getByRole('link', { name: 'SO-1042' })).toBeInTheDocument();
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
        {
          key: 'button',
          header: 'Button link',
          cell: (r) => <Table.Content onClick={() => {}}>{r.id}</Table.Content>,
        },
        {
          key: 'href',
          header: 'Anchor link',
          cell: (r) => <Table.Content href="#">{r.id}</Table.Content>,
        },
        {
          key: 'media',
          header: 'Media icon',
          cell: (r) => (
            <Table.Content media={<Icon size={24}>inventory_2</Icon>}>{r.product}</Table.Content>
          ),
        },
        {
          key: 'decicon',
          header: 'Decorative icon',
          cell: (r) => (
            <Table.Content
              decorativeIcon={{ icon: 'package_2', intent: 'primary', variant: 'subtle' }}
            >
              {r.product}
            </Table.Content>
          ),
        },
        {
          key: 'user',
          header: 'User avatar',
          cell: (r) => (
            <Table.Content initials={r.customer.slice(0, 2).toUpperCase()} subcopy={r.email}>
              {r.customer}
            </Table.Content>
          ),
        },
        {
          key: 'subcopy',
          header: 'Subcopy',
          cell: (r) => <Table.Content subcopy="Payment terms">{r.note}</Table.Content>,
        },
        {
          key: 'texts',
          header: 'Text stack',
          cell: (r) => (
            <Table.Content
              texts={[
                { variant: 'caption', children: 'Order' },
                { variant: 'small', weight: 'semibold', children: r.id },
                { variant: 'caption', children: r.product },
              ]}
            />
          ),
        },
        {
          key: 'inline',
          header: 'Inline link',
          cell: (r) => (
            <Table.Content
              subcopy={
                <Text variant="caption" as="span">
                  Ref:{' '}
                  <Link href="#" intent="primary">
                    {r.id}
                  </Link>
                </Text>
              }
            >
              {r.product}
            </Table.Content>
          ),
        },
      ]}
    />
  ),
};

// ---------------------------------------------------------------------------
// Avatar variants
// ---------------------------------------------------------------------------

type Person = { id: string; name: string; email: string; avatarSrc?: string };
const PEOPLE: Person[] = [
  { id: '1', name: 'Juan dela Cruz', email: 'ops@sikat.ph' },
  { id: '2', name: 'Maria Santos', email: 'buy@acme.com' },
  { id: '3', name: 'Pedro Reyes', email: 'ap@globex.io' },
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
        {
          key: 'default',
          header: 'Primary / Subtle (default)',
          cell: (r) => (
            <Table.Content initials={r.name.slice(0, 2).toUpperCase()} subcopy={r.email}>
              {r.name}
            </Table.Content>
          ),
        },
        {
          key: 'neutral',
          header: 'Default / Subtle',
          cell: (r) => (
            <Table.Content
              avatar={{ intent: 'default', variant: 'subtle' }}
              initials={r.name.slice(0, 2).toUpperCase()}
              subcopy={r.email}
            >
              {r.name}
            </Table.Content>
          ),
        },
        {
          key: 'solid',
          header: 'Primary / Solid',
          cell: (r) => (
            <Table.Content
              avatar={{ intent: 'primary', variant: 'solid' }}
              initials={r.name.slice(0, 2).toUpperCase()}
              subcopy={r.email}
            >
              {r.name}
            </Table.Content>
          ),
        },
        {
          key: 'outline',
          header: 'Outline',
          cell: (r) => (
            <Table.Content
              avatar={{ variant: 'outline' }}
              initials={r.name.slice(0, 2).toUpperCase()}
              subcopy={r.email}
            >
              {r.name}
            </Table.Content>
          ),
        },
        {
          key: 'rounded',
          header: 'Rounded',
          cell: (r) => (
            <Table.Content
              avatar={{ shape: 'rounded' }}
              initials={r.name.slice(0, 2).toUpperCase()}
              subcopy={r.email}
            >
              {r.name}
            </Table.Content>
          ),
        },
        {
          key: 'icon',
          header: 'Icon',
          cell: (r) => (
            <Table.Content avatar={{ icon: 'person' }} subcopy={r.email}>
              {r.name}
            </Table.Content>
          ),
        },
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
        <Table.Actions
          items={[{ type: 'expand', expanded, onToggle: () => setExpanded((e) => !e) }]}
        />
        <Table.Actions
          items={[
            { type: 'button', icon: <Icon size={20}>edit</Icon>, label: 'Edit', onClick: () => {} },
            {
              type: 'button',
              icon: <Icon size={20}>delete</Icon>,
              label: 'Delete',
              onClick: () => {},
            },
          ]}
        />
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
    id: 'SO-1042',
    name: 'Sikat Tech',
    qty: '3',
    amount: '12,450.00',
    children: [
      {
        id: 'SO-1042-1',
        name: 'Steel bolts',
        qty: '2',
        amount: '8,000.00',
        children: [
          { id: 'LOT-A', name: 'Lot A', qty: '1', amount: '5,000.00' },
          { id: 'LOT-B', name: 'Lot B', qty: '1', amount: '3,000.00' },
        ],
      },
      { id: 'SO-1042-2', name: 'Hex nuts', qty: '1', amount: '4,450.00' },
    ],
  },
  {
    id: 'SO-1043',
    name: 'Acme Corp',
    qty: '1',
    amount: '3,980.50',
    children: [{ id: 'SO-1043-1', name: 'Copper wire', qty: '1', amount: '3,980.50' }],
  },
  { id: 'SO-1044', name: 'Globex', qty: '1', amount: '870.00' },
];

/** Tree grid — `getSubRows` nests rows; expand chevron in first column; cascading selection. */
export const TreeRows: StoryObj<{ onRowAction: (row: TreeOrder) => void }> = {
  args: { onRowAction: fn() },
  parameters: { docs: { source: { type: 'code', code: '// See Table.stories.tsx → TreeRows' } } },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        getSubRows={(r) => r.children}
        defaultExpandedIds={['SO-1042', 'SO-1042-1']}
        rows={TREE}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        rowActions={(row) => [
          {
            type: 'button',
            icon: <Icon size={20}>more_horiz</Icon>,
            label: `Actions for row ${row.id}`,
            onClick: () => args.onRowAction(row),
          },
        ]}
        columns={[
          { key: 'id', header: 'Order', expandToggle: true },
          { key: 'name', header: 'Name' },
          { key: 'qty', header: 'Qty' },
          {
            key: 'amount',
            header: 'Amount',
            align: 'end',
            cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
          },
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
    await expect(args.onRowAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'LOT-A' }),
    );
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
            actions={
              <Button intent="primary" variant="solid" size="extra-large">
                New Order
              </Button>
            }
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
                rowActions={(row) => [
                  {
                    type: 'button',
                    icon: <Icon size={20}>more_horiz</Icon>,
                    label: `Actions for row ${row.id}`,
                    onClick: () => args.onRowAction(row),
                  },
                ]}
                headerActions={[
                  {
                    type: 'button',
                    icon: <Icon size={20}>tune</Icon>,
                    label: 'Column settings',
                    onClick: args.onColumnSettings,
                  },
                ]}
                pagination={{
                  page,
                  pageSize: 10,
                  total: 89,
                  onPageChange: (p) => {
                    setPage(p);
                    args.onPageChange(p);
                  },
                }}
                columns={[
                  {
                    key: 'id',
                    header: 'Order',
                    cell: (r) => <Table.Content href="#">{r.id}</Table.Content>,
                  },
                  {
                    key: 'product',
                    header: 'Product',
                    cell: (r) => (
                      <Table.Content media={<Icon size={24}>inventory_2</Icon>}>
                        {r.product}
                      </Table.Content>
                    ),
                  },
                  {
                    key: 'customer',
                    header: 'Customer',
                    cell: (r) => (
                      <Table.Content
                        initials={r.customer.slice(0, 2).toUpperCase()}
                        subcopy={r.email}
                      >
                        {r.customer}
                      </Table.Content>
                    ),
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    cell: (r) => (
                      <Table.Status intent={statusIntent(r.status)}>{r.status}</Table.Status>
                    ),
                  },
                  {
                    key: 'amount',
                    header: 'Amount',
                    align: 'end',
                    cell: (r) => <Table.Amount currency="PHP">{r.amount}</Table.Amount>,
                  },
                ]}
              />
            </Card>
          </Panel.Body>
        </Panel>
      </div>
    );
  },
};
