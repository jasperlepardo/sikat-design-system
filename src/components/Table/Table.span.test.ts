import { describe, expect, it } from 'vitest';
import { planRows, type TableColumn } from './Table';

type Row = { id: string; a: string; b: string; c: string; d: string };

const columns: TableColumn<Row>[] = [
  { key: 'a', header: 'A' },
  { key: 'b', header: 'B' },
  { key: 'c', header: 'C' },
  { key: 'd', header: 'D' },
];

const mkRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id: String(i),
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
    d: `d${i}`,
  }));

/** Compact view of a plan: 'S' = section, else a row of cell kinds/spans. */
const kinds = (cells: ReturnType<typeof planRows<Row>>[number]['cells']) =>
  cells.map((c) => (c.kind === 'skip' ? 'skip' : `${c.colSpan}x${c.rowSpan}`));

describe('planRows', () => {
  it('plans plain rows as one 1×1 cell per column', () => {
    const plan = planRows(mkRows(2), columns);
    expect(plan).toHaveLength(2);
    for (const rp of plan) {
      expect(rp.section).toBeNull();
      expect(rp.cells).toHaveLength(columns.length);
      expect(kinds(rp.cells)).toEqual(['1x1', '1x1', '1x1', '1x1']);
    }
  });

  it('expands colSpan and skips the absorbed columns, preserving length', () => {
    const cols: TableColumn<Row>[] = [
      { ...columns[0], span: () => ({ colSpan: 3 }) },
      columns[1],
      columns[2],
      columns[3],
    ];
    const [rp] = planRows(mkRows(1), cols);
    expect(kinds(rp.cells)).toEqual(['3x1', 'skip', 'skip', '1x1']);
    expect(rp.cells).toHaveLength(columns.length);
  });

  it('clamps a colSpan that would overrun the last data column', () => {
    const cols: TableColumn<Row>[] = [
      columns[0],
      columns[1],
      columns[2],
      { ...columns[3], span: () => ({ colSpan: 5 }) },
    ];
    const [rp] = planRows(mkRows(1), cols);
    expect(kinds(rp.cells)).toEqual(['1x1', '1x1', '1x1', '1x1']);
  });

  it('marks rowSpan-covered cells as skips in the following rows', () => {
    const cols: TableColumn<Row>[] = [
      { ...columns[0], span: (r) => (r.id === '0' ? { rowSpan: 2 } : undefined) },
      columns[1],
      columns[2],
      columns[3],
    ];
    const plan = planRows(mkRows(3), cols);
    expect(kinds(plan[0].cells)).toEqual(['1x2', '1x1', '1x1', '1x1']);
    expect(kinds(plan[1].cells)).toEqual(['skip', '1x1', '1x1', '1x1']);
    expect(kinds(plan[2].cells)).toEqual(['1x1', '1x1', '1x1', '1x1']);
  });

  it('covers a rectangle when a cell spans both directions', () => {
    const cols: TableColumn<Row>[] = [
      { ...columns[0], span: (r) => (r.id === '0' ? { colSpan: 2, rowSpan: 2 } : undefined) },
      columns[1],
      columns[2],
      columns[3],
    ];
    const plan = planRows(mkRows(2), cols);
    expect(kinds(plan[0].cells)).toEqual(['2x2', 'skip', '1x1', '1x1']);
    expect(kinds(plan[1].cells)).toEqual(['skip', 'skip', '1x1', '1x1']);
  });

  it('neutralizes rowSpan when allowRowSpan is false (sortRows / tree)', () => {
    const cols: TableColumn<Row>[] = [
      { ...columns[0], span: (r) => (r.id === '0' ? { rowSpan: 2 } : undefined) },
      columns[1],
      columns[2],
      columns[3],
    ];
    const plan = planRows(mkRows(2), cols, { allowRowSpan: false });
    expect(kinds(plan[0].cells)).toEqual(['1x1', '1x1', '1x1', '1x1']);
    expect(kinds(plan[1].cells)).toEqual(['1x1', '1x1', '1x1', '1x1']);
  });

  it('renders a section row as full-width and resets any open rowSpan', () => {
    const cols: TableColumn<Row>[] = [
      { ...columns[0], span: (r) => (r.id === '0' ? { rowSpan: 3 } : undefined) },
      columns[1],
      columns[2],
      columns[3],
    ];
    const plan = planRows(mkRows(3), cols, {
      getSectionRow: (r) => (r.id === '1' ? 'Section' : null),
    });
    expect(kinds(plan[0].cells)).toEqual(['1x3', '1x1', '1x1', '1x1']);
    expect(plan[1].section).toBe('Section');
    expect(plan[1].cells).toEqual([]);
    // The merge does not cross the section row: row 2 is a normal cell, not a skip.
    expect(kinds(plan[2].cells)).toEqual(['1x1', '1x1', '1x1', '1x1']);
  });
});
