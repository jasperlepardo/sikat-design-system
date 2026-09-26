import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Table, type TableColumn, type TableSort } from './Table';
import {
  TableActions,
  TableAmount,
  TableDragHandle,
  TableExpand,
  TableLink,
  TableMedia,
  TableStatus,
  TableSubcontent,
  TableUser,
} from './TableCells';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Card } from '../Card/Card';

type Row = { id: string; a: string; b: string; c: string; d: string };

/** The Figma Table's content: 4 "Table Header" columns × "Content" rows. */
const FIGMA_COLUMNS: TableColumn<Row>[] = ['a', 'b', 'c', 'd'].map((key) => ({
  key,
  header: 'Table Header',
}));
const figmaRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    a: 'Content',
    b: 'Content',
    c: 'Content',
    d: 'Content',
  }));

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { columns: [], rows: [], getRowId: () => '' },
} satisfies Meta<typeof Table>;

export default meta;

type TablePlaygroundArgs = {
  onRowAction: (row: Row) => void;
  onColumnSettings: () => void;
  onPageChange: (page: number) => void;
};

function FigmaTable(args: TablePlaygroundArgs) {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  return (
    <Card style={{ width: 918 }}>
      <Table
        caption="Example"
        columns={FIGMA_COLUMNS}
        rows={figmaRows(4)}
        getRowId={(r) => r.id}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowAction={args.onRowAction}
        onColumnSettings={args.onColumnSettings}
        pagination={{
          page,
          pageSize: 10,
          total: 89,
          onPageChange: (p) => {
            setPage(p);
            args.onPageChange(p);
          },
        }}
      />
    </Card>
  );
}

/** The Figma Table (17239:6506), rebuilt at its 918px width. */
export const Playground: StoryObj<TablePlaygroundArgs> = {
  args: { onRowAction: fn(), onColumnSettings: fn(), onPageChange: fn() },
  render: (args) => <FigmaTable {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Example' });
    // 36px header cells (+ the 2px header/body gap) and rows, as in Figma.
    for (const th of within(table).getAllByRole('columnheader'))
      await expect(th.clientHeight).toBe(36);
    const rows = within(table).getAllByRole('row').slice(1);
    for (const r of rows) await expect(r.getBoundingClientRect().height).toBe(36);

    // Row selection → Figma Table Row Variant2 (selected); header shows mixed.
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select row 2' }));
    await expect(rows[1]).toHaveAttribute('data-selected', 'true');
    const all = canvas.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
    await expect(all.indeterminate).toBe(true);
    await userEvent.click(all);
    for (const r of rows) await expect(r).toHaveAttribute('data-selected', 'true');
    await userEvent.click(all);
    await expect(rows[0]).not.toHaveAttribute('data-selected');

    // Row "…" action, column settings, pagination.
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for row 3' }));
    await expect(args.onRowAction).toHaveBeenLastCalledWith(expect.objectContaining({ id: '3' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Column settings' }));
    await expect(args.onColumnSettings).toHaveBeenCalledOnce();
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(2);
    await expect(canvas.getByText('of 89')).toBeInTheDocument();
  },
};

type Invoice = { id: string; customer: string; status: string; amount: number; date: string };
const INVOICES: Invoice[] = [
  { id: 'INV-1001', customer: 'Acme Corp', status: 'Paid', amount: 1250, date: '2026-09-02' },
  { id: 'INV-1002', customer: 'Globex', status: 'Overdue', amount: 480.5, date: '2026-08-21' },
  { id: 'INV-1003', customer: 'Initech', status: 'Draft', amount: 9200, date: '2026-09-18' },
  { id: 'INV-1004', customer: 'Umbrella', status: 'Paid', amount: 310, date: '2026-09-10' },
];

/** Sortable columns (header hover shows the sort control) with real data. */
export const Sorting: StoryObj<typeof meta> = {
  render: () => {
    const [sort, setSort] = useState<TableSort | null>(null);
    const rows = useMemo(() => {
      if (!sort) return INVOICES;
      const dir = sort.direction === 'asc' ? 1 : -1;
      return [...INVOICES].sort((x, y) => {
        const a = x[sort.key as keyof Invoice];
        const b = y[sort.key as keyof Invoice];
        return (a > b ? 1 : a < b ? -1 : 0) * dir;
      });
    }, [sort]);
    return (
      <div style={{ width: 720 }}>
        <Table
          caption="Invoices"
          getRowId={(r) => r.id}
          rows={rows}
          sort={sort}
          onSortChange={setSort}
          columns={[
            { key: 'id', header: 'Invoice', sortable: true },
            { key: 'customer', header: 'Customer', sortable: true },
            { key: 'status', header: 'Status' },
            {
              key: 'amount',
              header: 'Amount',
              sortable: true,
              cell: (r) => r.amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }),
            },
            { key: 'date', header: 'Date', sortable: true },
          ]}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader', { name: /Customer/ });
    const firstCustomer = () => within(canvas.getAllByRole('row')[1]).getAllByRole('cell')[1];
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

/** Wider than its container: the Figma Scroll Indicator tracks the scroll. */
export const Scroll: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 480 }}>
      <Table
        caption="Wide"
        getRowId={(r) => r.id}
        rows={figmaRows(3)}
        selectable
        columns={['a', 'b', 'c', 'd', 'a2', 'b2', 'c2'].map((key) => ({
          key,
          header: 'Table Header',
          cell: () => 'Content',
        }))}
        onRowAction={() => {}}
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
    await expect(parseFloat(thumb!.style.left) + parseFloat(thumb!.style.width)).toBeCloseTo(
      100,
      0,
    );
  },
};

/** Figma's placeholder icon (circle) for the Action CTA buttons. */
const Circle = <Icon size={20}>radio_button_unchecked</Icon>;
/** Story-only placeholder for Media cells. */
const MediaIcon = <Icon size={24}>image</Icon>;

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
];

/** Every Figma Table Cell type (17239:6211) in one table. */
export const CellTypes: StoryObj<typeof meta> = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (id: string) =>
      setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
    return (
      <Table
        caption="Orders"
        getRowId={(r) => r.id}
        rows={ORDERS}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowAction={() => {}}
        columns={[
          { key: 'drag', header: 'Reorder', srOnlyHeader: true, cell: () => <TableDragHandle /> },
          {
            key: 'expand',
            header: 'Expand',
            srOnlyHeader: true,
            cell: (r) => (
              <TableExpand expanded={expanded.includes(r.id)} onToggle={() => toggle(r.id)} />
            ),
          },
          {
            key: 'id',
            header: 'Order',
            cell: (r) => <TableLink onClick={() => {}}>{r.id}</TableLink>,
          },
          {
            key: 'product',
            header: 'Product',
            cell: (r) => <TableMedia media={MediaIcon}>{r.product}</TableMedia>,
          },
          {
            key: 'customer',
            header: 'Customer',
            cell: (r) => (
              <TableUser
                name={r.customer}
                subcopy={r.email}
                initials={r.customer.slice(0, 2).toUpperCase()}
              />
            ),
          },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => (
              <TableStatus
                intent={
                  r.status === 'Paid' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'
                }
              >
                {r.status}
              </TableStatus>
            ),
          },
          {
            key: 'amount',
            header: 'Amount',
            cell: (r) => <TableAmount currency="PHP">{r.amount}</TableAmount>,
          },
          {
            key: 'note',
            header: 'Terms',
            cell: (r) => <TableSubcontent subcopy="Payment terms">{r.note}</TableSubcontent>,
          },
          {
            key: 'cta',
            header: 'Actions',
            cell: () => (
              <TableActions>
                {[
                  <Button
                    key="a"
                    intent="default"
                    variant="ghost"
                    size="medium"
                    leadingIcon={Circle}
                  >
                    Button
                  </Button>,
                  <Button
                    key="b"
                    intent="default"
                    variant="ghost"
                    size="medium"
                    leadingIcon={Circle}
                  >
                    Button
                  </Button>,
                ]}
              </TableActions>
            ),
          },
        ]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvas.getAllByRole('row').slice(1);
    // User cells set the row height: 60px (12px padding around the 36px stack).
    for (const r of rows) await expect(Math.round(r.getBoundingClientRect().height)).toBe(60);
    // Action CTA: 32px (medium) buttons, as in Figma.
    const cta = within(rows[0]).getAllByRole('button', { name: 'Button' });
    for (const b of cta) await expect(b.getBoundingClientRect().height).toBe(32);
    // Dropdown cell toggles; Link/ID is a real control; statuses and amounts render.
    const expand = within(rows[1]).getByRole('button', { name: 'Expand row' });
    await userEvent.click(expand);
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expect(within(rows[0]).getByRole('button', { name: 'SO-1042' })).toBeInTheDocument();
    await expect(within(rows[2]).getByText('Overdue')).toBeInTheDocument();
    await expect(within(rows[0]).getByText('PHP')).toBeInTheDocument();
    await expect(within(rows[0]).getAllByRole('img', { name: 'Drag to reorder' })).toHaveLength(1);
  },
};

// --- InPanel ----------------------------------------------------------------

import { Panel } from '../Panel/Panel';
import { PanelHeader } from '../Panel/PanelHeader';

/** Table inside a Panel with PanelHeader — typical production layout. */
export const InPanel: StoryObj<TablePlaygroundArgs> = {
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
          subcopy="Manage your sales orders"
          actions={
            <Button intent="primary" variant="solid" size="extra-large">
              New Order
            </Button>
          }
        />
        <Panel.Body>
          <Card>
            <Table
              columns={FIGMA_COLUMNS}
              rows={figmaRows(8)}
              getRowId={(r) => r.id}
              selectable
              selectedIds={selected}
              onSelectionChange={setSelected}
              onRowAction={args.onRowAction}
              onColumnSettings={args.onColumnSettings}
              pagination={{
                page,
                pageSize: 8,
                total: 89,
                onPageChange: (p) => { setPage(p); args.onPageChange(p); },
              }}
            />
          </Card>
        </Panel.Body>
      </Panel>
      </div>
    );
  },
  args: { onRowAction: fn(), onColumnSettings: fn(), onPageChange: fn() },
};
