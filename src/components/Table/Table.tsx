import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button/Button';
import { Checkbox } from '../Field/Checkbox';
import {
  TableActions,
  TableAmount,
  TableContent,
  TableStatus,
  type TableActionItem,
} from './TableCells';
import { Icon } from '../Icon/Icon';
import chevronDown from './assets/chevron-down.svg';
import './table.css';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  /** Show a built-in expand-all / collapse-all toggle in the header (tree mode only). */
  expandToggle?: boolean;
  /** Cell content for a row (defaults to `String(row[key])`). */
  cell?: (row: T) => ReactNode;
  /** Shows the sort control on the header (Figma header cell hover). */
  sortable?: boolean;
  /** Value used to compare rows when built-in sorting (`sortRows`) is on. Defaults to `row[key]`. */
  sortAccessor?: (row: T) => string | number | boolean | Date | null | undefined;
  /** Full custom comparator for this column (overrides `sortAccessor`). */
  comparator?: (a: T, b: T) => number;
  /** Keep the header visually blank (Figma Spacer header cell) but named for
   *  assistive tech — e.g. drag-handle or expand columns. */
  srOnlyHeader?: boolean;
  /** Horizontal alignment of the header and cells. Default: start. */
  align?: 'start' | 'end';
  /**
   * Per-row span for this column's body cell. `colSpan` absorbs the following
   * columns in the same row; `rowSpan` merges this cell down over the following
   * rows (the covered cells are skipped). Return `undefined` / `{}` for a normal
   * 1×1 cell. `rowSpan` is ignored in tree mode and while `sortRows` is on —
   * reordering or expand/collapse would break a vertical merge. A `colSpan` that
   * would overrun the last column is clamped (it never enters the checkbox or
   * action tracks).
   */
  span?: (row: T) => TableCellSpan | undefined;
}

export interface TableCellSpan {
  colSpan?: number;
  rowSpan?: number;
}

/** A top header tier of grouped cells, rendered as a first `<tr>` in `<thead>`
 *  above the per-column headers. Each entry spans `colSpan` data columns. */
export interface TableHeaderGroup {
  header: ReactNode;
  /** Number of data columns (from `columns`) this group covers. */
  colSpan: number;
  /** Keep the cell present for assistive tech but visually blank. */
  srOnlyHeader?: boolean;
  align?: 'start' | 'end';
}

/** Pin leading / trailing columns while the middle scrolls horizontally. */
export interface TableFreeze {
  /** Number of leading data columns pinned to the left. */
  start?: number;
  /** Number of trailing data columns pinned to the right. */
  end?: number;
}

export type TableSortDirection = 'asc' | 'desc';
export interface TableSort {
  key: string;
  direction: TableSortDirection;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  pageSizes?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface TableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Adds the checkbox column (header select-all + per-row). */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Active sort (controlled). A single entry, or an array when `multiSort` is on. */
  sort?: TableSort | TableSort[] | null;
  onSortChange?: (sort: TableSort | TableSort[] | null) => void;
  /** Initial sort when uncontrolled — omit `sort` to let the Table own sort state. */
  defaultSort?: TableSort | TableSort[] | null;
  /** Click cycles each column independently and keeps others, in click priority order. */
  multiSort?: boolean;
  /** Table reorders `rows` itself using each column's `sortAccessor`/`comparator`. */
  sortRows?: boolean;
  /** Items rendered in the trailing Action column per row via TableActions. */
  rowActions?: TableActionItem[] | ((row: T) => TableActionItem[]);
  /** Items rendered in the header's trailing Action cell via TableActions. */
  headerActions?: TableActionItem[];
  /** Figma "Bottom Action": page size, total and prev / next. */
  pagination?: TablePagination;
  /** Give the table its own horizontal scroll container. Without this the page scrolls. */
  scroll?: boolean;
  /**
   * Pin the first `start` and last `end` data columns while the middle scrolls
   * horizontally. The checkbox column pins left (when `start ≥ 1`) and the
   * actions column pins right (when `end ≥ 1`). Freezing needs horizontal
   * overflow — the Table enables it automatically when `freeze` is set.
   */
  freeze?: TableFreeze;
  /**
   * `"fill"` — table expands to fill remaining flex space in its container; rows
   * scroll inside it under a sticky header. The parent card needs `flex: 0 1 auto`.
   *
   * `"scroll"` — table is height-capped (`min(60dvh, 36rem)`); rows scroll inside
   * it. Suits detail tabs.
   *
   * Both layouts own their vertical scroll and show a thin native scrollbar.
   * The `scroll` prop is redundant when `layout` is set.
   */
  layout?: 'fill' | 'scroll';
  /** Accessible table name. */
  caption?: string;
  /**
   * A row spanning all columns rendered in `<tfoot>` — use for "add a line"
   * inputs or aggregate footers.
   */
  footerRow?: ReactNode;
  /**
   * A top header tier of grouped, spanning cells rendered above the per-column
   * headers. The sum of `colSpan`s should equal `columns.length`. Not combined
   * with sticky-header layouts (`layout`), where the two header tiers overlap.
   */
  headerGroups?: TableHeaderGroup[];
  /**
   * When it returns non-null for a row, that row renders as a single full-width
   * cell (spanning the whole grid) instead of the per-column cells — for section
   * headers, group separators or subtotals interleaved between data rows. The
   * row carries no checkbox or expand affordance and interrupts any open
   * `rowSpan`. Takes precedence over a column's `span`.
   */
  getSectionRow?: (row: T) => ReactNode | null | undefined;
  /**
   * Child rows (same columns), nested to any depth. Turns the table into a tree
   * grid: the first column indents per level and holds the expand chevron, and
   * selection cascades (a parent is checked when all its descendants are).
   */
  getSubRows?: (row: T) => T[] | undefined;
  /** Expanded row ids (controlled). Omit to let the Table manage expansion. */
  expandedIds?: string[];
  /** Initially expanded row ids (uncontrolled). */
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
}

/** A sort can be given as one entry, an array, or null; the Table works with the array. */
function toArr(sort: TableSort | TableSort[] | null | undefined): TableSort[] {
  return sort == null ? [] : Array.isArray(sort) ? sort : [sort];
}

/** Null-last, type-aware comparison: numbers subtract, Dates by time, else natural string order. */
export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/** A comparator applying each sort entry in priority order over the given columns. */
export function makeComparator<T>(
  sortList: TableSort[],
  columns: TableColumn<T>[],
): (a: T, b: T) => number {
  const byKey = new Map(columns.map((c) => [c.key, c]));
  return (a, b) => {
    for (const { key, direction } of sortList) {
      const col = byKey.get(key);
      if (!col) continue;
      const result = col.comparator
        ? col.comparator(a, b)
        : compareValues(
            col.sortAccessor?.(a) ?? (a as Record<string, unknown>)[key],
            col.sortAccessor?.(b) ?? (b as Record<string, unknown>)[key],
          );
      if (result) return direction === 'asc' ? result : -result;
    }
    return 0;
  };
}

/** One body cell's placement: a real cell (with its resolved spans) or a slot
 *  skipped because a colSpan/rowSpan already covers it (no `<td>` is emitted). */
export type RowCellPlan<T> =
  | { kind: 'cell'; col: TableColumn<T>; colSpan: number; rowSpan: number }
  | { kind: 'skip' };

export interface RowPlan<T> {
  /** Full-width section content, or null for a normal per-column row. */
  section: ReactNode | null;
  /** One entry per data column (aligned to `columns` by index). */
  cells: RowCellPlan<T>[];
}

const spanWarned = new Set<string>();
function warnSpanOnce(message: string) {
  if (spanWarned.has(message)) return;
  spanWarned.add(message);
  if (typeof console !== 'undefined') console.warn(message);
}

/**
 * Resolve each row's cell placement into a render model: applies `getSectionRow`
 * (full-width rows), each column's `span`, clamps `colSpan` to the remaining
 * columns, and tracks a per-column "covered" count so rowSpan'd cells skip the
 * slots below them. Pure (aside from a one-time dev warning) and index-aligned to
 * `rows`, so the component can zip it back onto its visible nodes.
 */
export function planRows<T>(
  rows: T[],
  columns: TableColumn<T>[],
  options: {
    getSectionRow?: (row: T) => ReactNode | null | undefined;
    /** false when `sortRows` or tree mode is on — rowSpan is then neutralized. */
    allowRowSpan?: boolean;
  } = {},
): RowPlan<T>[] {
  const { getSectionRow, allowRowSpan = true } = options;
  const covered = new Array<number>(columns.length).fill(0);
  return rows.map((row) => {
    const section = getSectionRow?.(row) ?? null;
    if (section != null) {
      covered.fill(0); // a vertical merge cannot cross a section row
      return { section, cells: [] };
    }
    const cells: RowCellPlan<T>[] = [];
    let c = 0;
    while (c < columns.length) {
      if (covered[c] > 0) {
        covered[c] -= 1;
        cells.push({ kind: 'skip' });
        c += 1;
        continue;
      }
      const col = columns[c];
      const raw = col.span?.(row);
      const colSpan = Math.min(Math.max(1, Math.floor(raw?.colSpan ?? 1)), columns.length - c);
      let rowSpan = Math.max(1, Math.floor(raw?.rowSpan ?? 1));
      if (!allowRowSpan && rowSpan > 1) {
        warnSpanOnce(
          'Table: rowSpan is ignored while sortRows or tree mode is on — reordering or expand/collapse would break a vertical merge.',
        );
        rowSpan = 1;
      }
      if (rowSpan > 1) {
        for (let cc = c; cc < c + colSpan; cc++) covered[cc] = rowSpan - 1;
      }
      cells.push({ kind: 'cell', col, colSpan, rowSpan });
      for (let cc = c + 1; cc < c + colSpan; cc++) cells.push({ kind: 'skip' });
      c += colSpan;
    }
    return { section, cells };
  });
}

/** A pinned column's sticky placement, or null for a column that scrolls. */
export interface FreezeOffset {
  side: 'start' | 'end';
  /** Pixels from the left (`start`) or right (`end`) edge of the scroll port. */
  offset: number;
  /** The innermost pinned cell on its side — carries the boundary shadow. */
  edge: boolean;
}

/**
 * Resolve each DOM column's sticky offset for frozen columns. `widths` are the
 * rendered column widths in DOM order ([checkbox?, data…, actions?]); `leftCount`
 * / `rightCount` are how many cells are pinned on each side. Left offsets sum the
 * widths to their left; right offsets sum the widths to their right. Pure, so it
 * can be unit-tested without rendering.
 */
export function computeFreezeOffsets(
  widths: number[],
  leftCount: number,
  rightCount: number,
): (FreezeOffset | null)[] {
  const n = widths.length;
  const left = Math.max(0, Math.min(leftCount, n));
  const right = Math.max(0, Math.min(rightCount, n - left));
  const out: (FreezeOffset | null)[] = new Array(n).fill(null);
  let acc = 0;
  for (let i = 0; i < left; i++) {
    out[i] = { side: 'start', offset: acc, edge: i === left - 1 };
    acc += widths[i];
  }
  acc = 0;
  for (let i = n - 1; i >= n - right; i--) {
    out[i] = { side: 'end', offset: acc, edge: i === n - right };
    acc += widths[i];
  }
  return out;
}

interface TreeNode<T> {
  row: T;
  id: string;
  depth: number;
  parentId?: string;
  children: TreeNode<T>[];
}

function buildTree<T>(
  rows: T[],
  getRowId: (row: T) => string,
  getSubRows?: (row: T) => T[] | undefined,
  /** When set, siblings at every level are reordered with it (hierarchy preserved). */
  comparator?: (a: T, b: T) => number,
  depth = 0,
  parentId?: string,
): TreeNode<T>[] {
  const ordered = comparator ? [...rows].sort(comparator) : rows;
  return ordered.map((row) => {
    const id = getRowId(row);
    const sub = getSubRows?.(row) ?? [];
    return {
      row,
      id,
      depth,
      parentId,
      children: buildTree(sub, getRowId, getSubRows, comparator, depth + 1, id),
    };
  });
}

/** Every node, depth-first. */
function walk<T>(nodes: TreeNode<T>[], out: TreeNode<T>[] = []): TreeNode<T>[] {
  for (const n of nodes) {
    out.push(n);
    walk(n.children, out);
  }
  return out;
}

function Check({
  checked,
  indeterminate,
  label,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Checkbox
      className="sikat-table__check"
      aria-label={label}
      checked={checked}
      indeterminate={indeterminate}
      onChange={(e) => onChange(e.currentTarget.checked)}
    />
  );
}

/**
 * Table — the Figma Table (Components › Table): a `bg/secondary` card (1px
 * `border/default`, 16px radius, 4px padding) with a 36px header row (12/16
 * Semibold captions; hover shows the sort control) over a white, 12px-rounded
 * body of 36px rows (8px cells, bottom `border/default`, 14/20 Medium body text;
 * hover turns the row's rule `border/primary-subtle`; selected rows are
 * `bg/primary-subtle`). Optional checkbox column, trailing "…" action column,
 * header column-settings button and pagination.
 */
export function Table<T>({
  columns,
  rows,
  getRowId,
  selectable,
  selectedIds = [],
  onSelectionChange,
  sort,
  onSortChange,
  defaultSort = null,
  multiSort,
  sortRows,
  rowActions,
  headerActions,
  pagination,
  scroll,
  freeze,
  layout,
  caption,
  footerRow,
  headerGroups,
  getSectionRow,
  getSubRows,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  className,
  ...rest
}: TableProps<T>) {
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const [ownExpanded, setOwnExpanded] = useState(defaultExpandedIds);
  const [ownSort, setOwnSort] = useState<TableSort | TableSort[] | null>(defaultSort);
  const [freezeOffsets, setFreezeOffsets] = useState<(FreezeOffset | null)[]>([]);

  const tree = !!getSubRows;

  /** Controlled when `sort` is provided (even as null); otherwise the Table owns it. */
  const sortList = useMemo(() => toArr(sort !== undefined ? sort : ownSort), [sort, ownSort]);
  const comparator = useMemo(
    () => (sortRows && sortList.length ? makeComparator(sortList, columns) : undefined),
    [sortRows, sortList, columns],
  );

  const roots = useMemo(
    () => buildTree(rows, getRowId, getSubRows, comparator),
    [rows, getRowId, getSubRows, comparator],
  );
  const nodes = useMemo(() => walk(roots), [roots]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const ids = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const leaves = useMemo(() => nodes.filter((n) => n.children.length === 0), [nodes]);
  const expandable = useMemo(
    () => nodes.filter((n) => n.children.length > 0).map((n) => n.id),
    [nodes],
  );

  const expanded = useMemo(() => new Set(expandedIds ?? ownExpanded), [expandedIds, ownExpanded]);
  const allExpanded = expandable.length > 0 && expandable.every((id) => expanded.has(id));
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  /** A row is checked when all its leaves are selected; mixed when only some are. */
  const rowState = useCallback(
    (n: TreeNode<T>) => {
      if (n.children.length === 0) return { checked: selected.has(n.id), mixed: false };
      const own = walk(n.children).filter((c) => c.children.length === 0);
      const count = own.filter((c) => selected.has(c.id)).length;
      return { checked: count === own.length, mixed: count > 0 && count < own.length };
    },
    [selected],
  );

  const allSelected = leaves.length > 0 && leaves.every((n) => selected.has(n.id));
  const someSelected = leaves.some((n) => selected.has(n.id));
  const hasEnd = !!rowActions || !!headerActions;

  /** The checkbox and action tracks are extra columns around the data columns;
   *  a full-width cell (footer / section row) spans all of them. */
  const lead = selectable ? 1 : 0;
  const totalCols = lead + columns.length + (hasEnd ? 1 : 0);

  /** How many leading / trailing DOM columns are pinned. `start`/`end` count data
   *  columns; the checkbox pins with the left group and actions with the right,
   *  and the two sides never overlap (a scrollable middle is always kept). */
  const freezeStart = Math.max(0, Math.min(freeze?.start ?? 0, columns.length));
  const freezeEnd = Math.max(0, Math.min(freeze?.end ?? 0, columns.length - freezeStart));
  const hasFreeze = freezeStart > 0 || freezeEnd > 0;
  const leftCount = (selectable && freezeStart > 0 ? 1 : 0) + freezeStart;
  const rightCount = freezeEnd + (hasEnd && freezeEnd > 0 ? 1 : 0);

  /** Measure DOM column widths and derive sticky offsets; re-measure on resize.
   *  Also flag scroll extremes so the boundary shadows only show over hidden content. */
  useEffect(() => {
    if (!hasFreeze || !scroller) {
      setFreezeOffsets([]);
      return;
    }
    const measure = () => {
      const head = theadRef.current;
      if (!head) return;
      // Build widths in DOM order [checkbox?, data…, actions?]. The checkbox and
      // action cells may live in the group tier, so select them by class; data
      // cells are the leaf row's non-checkbox/non-action headers.
      const widthOf = (sel: string) =>
        (head.querySelector<HTMLElement>(sel)?.offsetWidth ?? 0);
      const dataCells = head.querySelectorAll<HTMLElement>(
        'tr:last-child > th:not(.sikat-table__th--check):not(.sikat-table__th--end)',
      );
      const widths = [
        ...(selectable ? [widthOf('.sikat-table__th--check')] : []),
        ...Array.from(dataCells, (c) => c.offsetWidth),
        ...(hasEnd ? [widthOf('.sikat-table__th--end')] : []),
      ];
      setFreezeOffsets(computeFreezeOffsets(widths, leftCount, rightCount));
      const { scrollWidth, clientWidth, scrollLeft } = scroller;
      const scrollable = scrollWidth > clientWidth + 1;
      scroller.toggleAttribute('data-at-start', !scrollable || scrollLeft <= 0);
      scroller.toggleAttribute('data-at-end', !scrollable || scrollLeft >= scrollWidth - clientWidth - 1);
    };
    measure();
    scroller.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(scroller);
    if (scroller.firstElementChild) ro.observe(scroller.firstElementChild);
    return () => {
      scroller.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [hasFreeze, scroller, selectable, hasEnd, leftCount, rightCount, totalCols]);

  /** Sticky className + inline left/right for the DOM column at `domIndex`, or
   *  nothing when it is not frozen (or not yet measured). */
  const freezeProps = (
    domIndex: number,
  ): { className?: string; style?: { left?: number; right?: number } } => {
    const f = hasFreeze ? freezeOffsets[domIndex] : null;
    if (!f) return {};
    return {
      className: cn(
        'sikat-table__frozen',
        `sikat-table__frozen--${f.side}`,
        f.edge && `sikat-table__frozen--edge-${f.side}`,
      ),
      style: f.side === 'start' ? { left: f.offset } : { right: f.offset },
    };
  };

  /** Sticky props for a header-group cell spanning data columns `[gStart, gEnd)`.
   *  A group is pinned only when it lies entirely inside a frozen side; a group
   *  straddling the boundary scrolls. Offsets reuse the boundary member's offset. */
  const freezeGroupProps = (
    gStart: number,
    gEnd: number,
  ): { className?: string; style?: { left?: number; right?: number } } => {
    if (!hasFreeze) return {};
    if (freezeStart > 0 && gEnd <= freezeStart) {
      const f = freezeOffsets[lead + gStart];
      if (!f) return {};
      return {
        className: cn(
          'sikat-table__frozen sikat-table__frozen--start',
          gEnd === freezeStart && 'sikat-table__frozen--edge-start',
        ),
        style: { left: f.offset },
      };
    }
    const rightDataStart = columns.length - freezeEnd;
    if (freezeEnd > 0 && gStart >= rightDataStart) {
      const f = freezeOffsets[lead + gEnd - 1];
      if (!f) return {};
      return {
        className: cn(
          'sikat-table__frozen sikat-table__frozen--end',
          gStart === rightDataStart && 'sikat-table__frozen--edge-end',
        ),
        style: { right: f.offset },
      };
    }
    return {};
  };

  /** Re-derive parent ids from their descendants (post-order), keeping ids outside this tree. */
  const normalize = useCallback(
    (next: Set<string>) => {
      const visit = (n: TreeNode<T>): boolean => {
        if (n.children.length === 0) return next.has(n.id);
        const all = n.children.map(visit).every(Boolean);
        if (all) next.add(n.id);
        else next.delete(n.id);
        return all;
      };
      roots.forEach(visit);
      return [...next];
    },
    [roots],
  );

  const toggleAll = useCallback(
    (on: boolean) =>
      onSelectionChange?.(
        on ? [...new Set([...selectedIds, ...ids])] : selectedIds.filter((id) => !ids.includes(id)),
      ),
    [onSelectionChange, selectedIds, ids],
  );

  const toggleRow = useCallback(
    (id: string, on: boolean) => {
      const next = new Set(selectedIds);
      for (const n of walk([byId.get(id)!])) {
        if (on) next.add(n.id);
        else next.delete(n.id);
      }
      onSelectionChange?.(normalize(next));
    },
    [selectedIds, byId, onSelectionChange, normalize],
  );

  const setExpanded = useCallback(
    (id: string, open: boolean) => {
      const next = open ? [...expanded, id] : [...expanded].filter((x) => x !== id);
      if (expandedIds === undefined) setOwnExpanded(next);
      onExpandedChange?.(next);
    },
    [expanded, expandedIds, onExpandedChange],
  );

  /** The visible rows: descend only into expanded nodes. */
  const visible = useMemo(() => {
    const result: { node: TreeNode<T>; pos: number; size: number }[] = [];
    const collect = (list: TreeNode<T>[]) =>
      list.forEach((node, i) => {
        result.push({ node, pos: i + 1, size: list.length });
        if (expanded.has(node.id)) collect(node.children);
      });
    collect(roots);
    return result;
  }, [roots, expanded]);

  /** Per-row cell placement (colSpan/rowSpan/section), index-aligned to `visible`.
   *  rowSpan is neutralized in tree mode and while `sortRows` can reorder rows. */
  const rowPlans = useMemo(
    () =>
      planRows(
        visible.map((v) => v.node.row),
        columns,
        { getSectionRow, allowRowSpan: !tree && !sortRows },
      ),
    [visible, columns, getSectionRow, tree, sortRows],
  );

  const focusIn = (id: string | undefined, selector: string) =>
    id &&
    bodyRef.current
      ?.querySelector<HTMLElement>(`tr[data-row-id="${CSS.escape(id)}"]`)
      ?.querySelector<HTMLElement>(selector)
      ?.focus();
  /** Chevron keys: → expands (then moves into the first child), ← collapses (then moves to the parent). */
  const onExpandKey = (n: TreeNode<T>, e: KeyboardEvent<HTMLButtonElement>) => {
    const open = expanded.has(n.id);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (!open) setExpanded(n.id, true);
      else focusIn(n.children[0]?.id, 'button, input, a[href]');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (open) setExpanded(n.id, false);
      else focusIn(n.parentId, '.sikat-table-cell__expand');
    }
  };
  /** Cycle a column's direction: off → asc → desc → off. */
  const cycle = (dir: TableSortDirection | undefined): TableSortDirection | null =>
    dir === undefined ? 'asc' : dir === 'asc' ? 'desc' : null;

  const toggleSort = (key: string) => {
    const current = sortList.find((s) => s.key === key)?.direction;
    const dir = cycle(current);
    let next: TableSort | TableSort[] | null;
    if (multiSort) {
      const list = sortList.filter((s) => s.key !== key);
      if (dir) list.push({ key, direction: dir });
      next = list;
    } else {
      next = dir ? { key, direction: dir } : null;
    }
    if (sort === undefined) setOwnSort(next);
    onSortChange?.(next);
  };

  /** The select-all checkbox header cell — placed in the group tier (rowSpan 2)
   *  when header groups are present, otherwise in the single header row. */
  const checkTh = (rowSpan?: number) => {
    const fp = freezeProps(0);
    return (
      <th
        className={cn('sikat-table__th sikat-table__th--check', fp.className)}
        style={fp.style}
        scope="col"
        rowSpan={rowSpan}
      >
        <Check
          label="Select all rows"
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={toggleAll}
        />
      </th>
    );
  };
  /** The trailing action header cell — placed like `checkTh`. */
  const endTh = (rowSpan?: number) => {
    const fp = freezeProps(totalCols - 1);
    return (
      <th
        className={cn('sikat-table__th sikat-table__th--end', fp.className)}
        style={fp.style}
        scope="col"
        rowSpan={rowSpan}
      >
        {headerActions ? (
          <span className="sikat-table__end">
            <TableActions items={headerActions} />
          </span>
        ) : (
          <span className="sikat-table__visually-hidden">Actions</span>
        )}
      </th>
    );
  };

  return (
    <div className={cn('sikat-table', layout && `sikat-table--${layout}`, className)} {...rest}>
<<<<<<< Updated upstream
      <div className={cn('sikat-table__scroller', scroll && 'sikat-table__scroller--scroll')}>
=======
      <div
        ref={setScroller}
        className={cn(
          'sikat-table__scroller',
          (scroll || (hasFreeze && !layout)) && 'sikat-table__scroller--scroll',
        )}
      >
>>>>>>> Stashed changes
        <table className="sikat-table__table" role={tree ? 'treegrid' : undefined}>
          {caption ? <caption className="sikat-table__caption">{caption}</caption> : null}
          <thead ref={theadRef}>
            {headerGroups ? (
              <tr>
                {selectable ? checkTh(2) : null}
                {(() => {
                  let cursor = 0;
                  return headerGroups.map((g, i) => {
                    const gStart = cursor;
                    cursor += g.colSpan;
                    const fp = freezeGroupProps(gStart, cursor);
                    return (
                      <th
                        key={i}
                        scope="colgroup"
                        colSpan={g.colSpan}
                        className={cn('sikat-table__th sikat-table__th--group', fp.className)}
                        style={fp.style}
                        data-align={g.align === 'end' ? 'end' : undefined}
                      >
                        <span
                          className={
                            g.srOnlyHeader
                              ? 'sikat-table__visually-hidden'
                              : 'sikat-table__th-label'
                          }
                        >
                          {g.header}
                        </span>
                      </th>
                    );
                  });
                })()}
                {hasEnd ? endTh(2) : null}
              </tr>
            ) : null}
            <tr>
              {selectable && !headerGroups ? checkTh() : null}
              {columns.map((col, colIndex) => {
                const sortIndex = sortList.findIndex((s) => s.key === col.key);
                const sorted = sortIndex >= 0 ? sortList[sortIndex].direction : undefined;
                const fp = freezeProps(lead + colIndex);
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn('sikat-table__th', fp.className)}
                    style={fp.style}
                    data-align={col.align === 'end' ? 'end' : undefined}
                    aria-sort={
                      sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined
                    }
                  >
                    <span className="sikat-table__th-inner">
                      {col.expandToggle && tree ? (
                        <span className="sikat-table__th-icon">
                          <Button
                            intent="default"
                            variant="link"
                            size="2xs"
                            aria-label={allExpanded ? 'Collapse all rows' : 'Expand all rows'}
                            onClick={() => {
                              const next = allExpanded ? [] : expandable;
                              if (expandedIds === undefined) setOwnExpanded(next);
                              onExpandedChange?.(next);
                            }}
                            leadingIcon={
                              <Icon size={20}>{allExpanded ? 'collapse_all' : 'expand_all'}</Icon>
                            }
                          />
                        </span>
                      ) : null}
                      <span
                        className={
                          col.srOnlyHeader
                            ? 'sikat-table__visually-hidden'
                            : 'sikat-table__th-label'
                        }
                      >
                        {col.header}
                      </span>
                      {col.sortable ? (
                        <Button
                          intent="default"
                          variant="link"
                          size="2xs"
                          className="sikat-table__sort"
                          data-active={sorted ? 'true' : undefined}
                          aria-label={`Sort by ${typeof col.header === 'string' ? col.header : col.key}${
                            sorted ? `, ${sorted === 'asc' ? 'ascending' : 'descending'}` : ''
                          }`}
                          onClick={() => toggleSort(col.key)}
                          leadingIcon={
                            <Icon size={16}>
                              {sorted === 'asc'
                                ? 'arrow_upward'
                                : sorted === 'desc'
                                  ? 'arrow_downward'
                                  : 'unfold_more'}
                            </Icon>
                          }
                        >
                          {multiSort && sortList.length > 1 && sortIndex >= 0 ? (
                            <span className="sikat-table__sort-rank">{sortIndex + 1}</span>
                          ) : null}
                        </Button>
                      ) : null}
                    </span>
                  </th>
                );
              })}
              {hasEnd && !headerGroups ? endTh() : null}
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {visible.map(({ node, pos, size }, rowIndex) => {
              const { row, id, depth } = node;
              const plan = rowPlans[rowIndex];
              const { checked: isSelected, mixed } = rowState(node);
              const hasChildren = node.children.length > 0;
              const isOpen = expanded.has(id);

              if (plan.section != null) {
                return (
                  <tr
                    key={id}
                    className="sikat-table__row sikat-table__row--section"
                    data-row-id={id}
                  >
                    <td className="sikat-table__td sikat-table__td--section" colSpan={totalCols}>
                      {plan.section}
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={id}
                  className="sikat-table__row"
                  data-row-id={id}
                  data-selected={isSelected || undefined}
                  {...(tree && {
                    'aria-level': depth + 1,
                    'aria-posinset': pos,
                    'aria-setsize': size,
                    'aria-expanded': hasChildren ? isOpen : undefined,
                  })}
                >
                  {selectable ? (
                    (() => {
                      const fp = freezeProps(0);
                      return (
                        <td
                          className={cn('sikat-table__td sikat-table__td--check', fp.className)}
                          style={fp.style}
                        >
                          <Check
                            label={`Select row ${id}`}
                            checked={isSelected}
                            indeterminate={mixed}
                            onChange={(on) => toggleRow(id, on)}
                          />
                        </td>
                      );
                    })()
                  ) : null}
                  {plan.cells.map((cp, i) => {
                    if (cp.kind === 'skip') return null;
                    const { col, colSpan, rowSpan } = cp;
                    const content = col.cell
                      ? col.cell(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '');
                    const fp = freezeProps(lead + i);
                    return (
                      <td
                        key={col.key}
                        className={cn('sikat-table__td', fp.className)}
                        style={fp.style}
                        colSpan={colSpan > 1 ? colSpan : undefined}
                        rowSpan={rowSpan > 1 ? rowSpan : undefined}
                        data-span={colSpan > 1 || rowSpan > 1 ? '' : undefined}
                        data-align={col.align === 'end' ? 'end' : undefined}
                      >
                        {tree && i === 0 ? (
                          <span
                            className="sikat-table__tree"
                            style={{ ['--table-depth' as string]: depth }}
                          >
                            {hasChildren ? (
                              <TableActions
                                items={[
                                  {
                                    type: 'expand',
                                    expanded: isOpen,
                                    label: `${isOpen ? 'Collapse' : 'Expand'} row ${id}`,
                                    onToggle: () => setExpanded(id, !isOpen),
                                    onKeyDown: (e) => onExpandKey(node, e),
                                  },
                                ]}
                              />
                            ) : (
                              <span className="sikat-table__tree-spacer" aria-hidden="true" />
                            )}
                            {content}
                          </span>
                        ) : (
                          content
                        )}
                      </td>
                    );
                  })}
                  {hasEnd
                    ? (() => {
                        const fp = freezeProps(totalCols - 1);
                        return (
                          <td
                            className={cn('sikat-table__td sikat-table__td--end', fp.className)}
                            style={fp.style}
                          >
                            {rowActions ? (
                              <span className="sikat-table__end">
                                <TableActions
                                  items={
                                    typeof rowActions === 'function' ? rowActions(row) : rowActions
                                  }
                                />
                              </span>
                            ) : null}
                          </td>
                        );
                      })()
                    : null}
                </tr>
              );
            })}
            {footerRow ? (
              <tr className="sikat-table__row">
                <td className="sikat-table__td" colSpan={totalCols}>
                  {footerRow}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {pagination ? <Pagination {...pagination} /> : null}
    </div>
  );
}

Table.Content = TableContent;
Table.Status = TableStatus;
Table.Amount = TableAmount;
Table.Actions = TableActions;

/** Figma Bottom Action › Pagination Container: "10 ▾ of 89" and ← →. */
function Pagination({
  page,
  pageSize,
  total,
  pageSizes = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
}: TablePagination) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className="sikat-table__pagination" aria-label="Pagination">
      <div className="sikat-table__page-info">
        <select
          className="sikat-table__page-size"
          style={{ ['--table-chevron' as string]: `url("${chevronDown}")` }}
          aria-label="Rows per page"
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.currentTarget.value))}
        >
          {pageSizes.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="sikat-table__page-total">of {total}</span>
      </div>
      <div className="sikat-table__page-nav">
        <button
          type="button"
          className="sikat-table__page-btn"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon size={16}>navigate_before</Icon>
        </button>
        <button
          type="button"
          className="sikat-table__page-btn"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          <Icon size={16}>navigate_next</Icon>
        </button>
      </div>
    </nav>
  );
}
