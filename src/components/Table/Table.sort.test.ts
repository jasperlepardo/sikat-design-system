import { describe, expect, it } from 'vitest';
import { compareValues, makeComparator, type TableColumn } from './Table';

describe('compareValues', () => {
  it('orders numbers by value, not lexically', () => {
    expect(compareValues(870, 1340)).toBeLessThan(0);
    expect(compareValues(1340, 870)).toBeGreaterThan(0);
    expect(compareValues(5, 5)).toBe(0);
  });

  it('orders strings naturally (numeric-aware)', () => {
    expect(compareValues('SO-2', 'SO-10')).toBeLessThan(0);
    expect(compareValues('Acme', 'Umbrella')).toBeLessThan(0);
  });

  it('orders Dates by time', () => {
    expect(compareValues(new Date('2024-01-01'), new Date('2024-06-01'))).toBeLessThan(0);
  });

  it('sorts null/undefined last', () => {
    expect(compareValues(null, 5)).toBeGreaterThan(0);
    expect(compareValues(5, null)).toBeLessThan(0);
    expect(compareValues(null, null)).toBe(0);
    expect(compareValues(undefined, 'a')).toBeGreaterThan(0);
  });
});

describe('makeComparator', () => {
  type Row = { id: string; status: string; amount: number };
  const columns: TableColumn<Row>[] = [
    { key: 'id', header: 'Order' },
    { key: 'status', header: 'Status' },
    { key: 'amount', header: 'Amount', sortAccessor: (r) => r.amount },
  ];
  const rows: Row[] = [
    { id: 'a', status: 'Paid', amount: 100 },
    { id: 'b', status: 'Overdue', amount: 300 },
    { id: 'c', status: 'Overdue', amount: 50 },
    { id: 'd', status: 'Paid', amount: 200 },
  ];

  it('sorts ascending by a single key via row[key]', () => {
    const sorted = [...rows].sort(makeComparator([{ key: 'status', direction: 'asc' }], columns));
    expect(sorted.map((r) => r.status)).toEqual(['Overdue', 'Overdue', 'Paid', 'Paid']);
  });

  it('respects descending direction', () => {
    const sorted = [...rows].sort(makeComparator([{ key: 'amount', direction: 'desc' }], columns));
    expect(sorted.map((r) => r.amount)).toEqual([300, 200, 100, 50]);
  });

  it('applies keys in priority order (status asc, then amount desc)', () => {
    const sorted = [...rows].sort(
      makeComparator(
        [
          { key: 'status', direction: 'asc' },
          { key: 'amount', direction: 'desc' },
        ],
        columns,
      ),
    );
    expect(sorted.map((r) => r.id)).toEqual(['b', 'c', 'd', 'a']);
  });

  it('prefers an explicit column comparator over sortAccessor', () => {
    const cols: TableColumn<Row>[] = [
      { key: 'amount', header: 'Amount', comparator: (a, b) => a.id.localeCompare(b.id) },
    ];
    const sorted = [...rows].sort(makeComparator([{ key: 'amount', direction: 'asc' }], cols));
    expect(sorted.map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('ignores unknown sort keys', () => {
    const sorted = [...rows].sort(makeComparator([{ key: 'missing', direction: 'asc' }], columns));
    expect(sorted.map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});
