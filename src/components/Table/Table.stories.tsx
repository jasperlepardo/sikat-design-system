import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Table, type TableColumn, type TableInsertTarget, type TableSort } from './Table';
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
/** A body row's height without the 2px row gap its cells' top border adds above it. */
const visibleRowHeight = (row: HTMLElement) =>
  row.getBoundingClientRect().height -
  parseFloat(getComputedStyle(row.querySelector('td')!).borderTopWidth);

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
    // 36px header cells and rows, as in Figma. Each body row also carries the 2px
    // row gap above it (its cells' transparent top border), so measure the visible row.
    for (const th of within(table).getAllByRole('columnheader'))
      await expect(th.clientHeight).toBe(36);
    const rows = within(table).getAllByRole('row').slice(1);
    for (const r of rows) await expect(visibleRowHeight(r)).toBe(36);

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
        scroll
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
    for (const r of rows) await expect(Math.round(visibleRowHeight(r))).toBe(60);
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

// --- TreeRows ---------------------------------------------------------------

type Item = { id: string; name: string; qty: string; amount: string; children?: Item[] };
const TREE: Item[] = [
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

/** Multilevel collapsible rows: `getSubRows` nests rows of the same columns; the
 *  first column indents per level and holds the chevron; selection cascades. */
export const TreeRows: StoryObj<{ onRowAction: (row: Item) => void }> = {
  args: { onRowAction: fn() },
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
        onRowAction={args.onRowAction}
        columns={[
          { key: 'id', header: 'Order' },
          { key: 'name', header: 'Name' },
          { key: 'qty', header: 'Qty' },
          {
            key: 'amount',
            header: 'Amount',
            cell: (r) => <TableAmount currency="PHP">{r.amount}</TableAmount>,
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

    // SO-1042 and its first line item start open; SO-1043's child is hidden.
    await expect(bodyRows()).toHaveLength(7);
    await expect(row('LOT-A')).toHaveAttribute('aria-level', '3');
    const indent = (id: string) =>
      parseFloat(getComputedStyle(row(id).querySelector('.sikat-table__tree')!).paddingLeft);
    await expect(indent('LOT-A')).toBeGreaterThan(indent('SO-1042'));

    const expand = canvas.getByRole('button', { name: 'Expand row SO-1043' });
    await userEvent.click(expand);
    await expect(row('SO-1043')).toHaveAttribute('aria-expanded', 'true');
    await expect(bodyRows()).toHaveLength(8);

    // Keyboard: ← collapses, → expands, → again moves into the first child.
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

    // Cascading selection: a parent checks its descendants; one unchecked → mixed.
    const check = (id: string) =>
      canvas.getByRole('checkbox', { name: `Select row ${id}` }) as HTMLInputElement;
    await userEvent.click(check('SO-1042'));
    for (const id of ['SO-1042-1', 'LOT-A', 'LOT-B', 'SO-1042-2'])
      await expect(check(id).checked).toBe(true);
    await userEvent.click(check('LOT-B'));
    await expect(check('SO-1042-1').indeterminate).toBe(true);
    await expect(check('SO-1042').indeterminate).toBe(true);
    const all = canvas.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
    await expect(all.indeterminate).toBe(true);
    await userEvent.click(check('LOT-B'));
    await expect(check('SO-1042').checked).toBe(true);
    await expect(row('SO-1042')).toHaveAttribute('data-selected', 'true');

    await userEvent.click(canvas.getByRole('button', { name: 'Actions for row LOT-A' }));
    await expect(args.onRowAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'LOT-A' }),
    );
  },
};

/** `onRowInsert`: hovering (or tabbing to) the gap between rows shows an insert
 *  line with a "+" button; the story inserts the row into its own `rows`. */
export const InsertRows: StoryObj<{ onRowInsert: (target: TableInsertTarget) => void }> = {
  args: { onRowInsert: fn() },
  render: (args) => {
    const [rows, setRows] = useState(() => figmaRows(4));
    return (
      <Card style={{ width: 918 }}>
        <Table
          caption="Insertable"
          columns={FIGMA_COLUMNS}
          rows={rows}
          getRowId={(r) => r.id}
          onRowInsert={(target) => {
            args.onRowInsert(target);
            setRows((prev) => {
              const next = [...prev];
              const id = `new-${prev.length + 1}`;
              next.splice(target.index, 0, { id, a: 'New', b: 'New', c: 'New', d: 'New' });
              return next;
            });
          }}
        />
      </Card>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Insertable' });
    const ids = () =>
      within(table)
        .getAllByRole('row')
        .slice(1)
        .map((r) => r.getAttribute('data-row-id'));

    // Only gaps between rows: nothing above the first one.
    await expect(canvas.queryByRole('button', { name: 'Insert row before row 1' })).toBeNull();

    const insert = canvas.getByRole('button', { name: 'Insert row before row 2' });
    await expect(getComputedStyle(insert).opacity).toBe('0');
    await userEvent.click(insert);
    await expect(args.onRowInsert).toHaveBeenLastCalledWith({
      index: 1,
      parentId: undefined,
      beforeId: '2',
      afterId: '1',
    });
    await expect(ids()).toEqual(['1', 'new-5', '2', '3', '4']);

    // Keyboard focus reveals it (so does hover, in CSS — a mouse click doesn't
    // leave it showing, as only :focus-visible counts).
    const last = canvas.getByRole('button', { name: 'Insert row before row 4' });
    while (document.activeElement !== last) await userEvent.tab();
    await expect(getComputedStyle(last).opacity).toBe('1');
    last.blur();
  },
};

/** In a tree, the new row is a sibling of the row below the gap. */
export const InsertTreeRows: StoryObj<{ onRowInsert: (target: TableInsertTarget) => void }> = {
  args: { onRowInsert: fn() },
  render: (args) => (
    <Table
      caption="Orders"
      getRowId={(r) => r.id}
      getSubRows={(r) => r.children}
      defaultExpandedIds={['SO-1042']}
      rows={TREE}
      onRowInsert={args.onRowInsert}
      columns={[
        { key: 'id', header: 'Order' },
        { key: 'name', header: 'Name' },
      ]}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Insert row before row SO-1042-1' }));
    await expect(args.onRowInsert).toHaveBeenLastCalledWith({
      index: 0,
      parentId: 'SO-1042',
      beforeId: 'SO-1042-1',
      afterId: 'SO-1042',
    });
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
                  onPageChange: (p) => {
                    setPage(p);
                    args.onPageChange(p);
                  },
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
