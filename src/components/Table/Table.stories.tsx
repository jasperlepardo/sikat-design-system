import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Table, type TableColumn, type TableSort } from './Table';

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
    <div style={{ width: 918 }}>
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
    </div>
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
