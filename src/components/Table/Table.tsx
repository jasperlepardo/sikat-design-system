import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button/Button';
import {
  TableActions,
  TableAmount,
  TableContent,
  TableStatus,
  type TableActionItem,
} from './TableCells';
import { Icon } from '../Icon/Icon';
import checkboxGlyph from './assets/checkbox.svg';
import scrollThumb from './assets/scroll-thumb.svg';
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
  /** Keep the header visually blank (Figma Spacer header cell) but named for
   *  assistive tech — e.g. drag-handle or expand columns. */
  srOnlyHeader?: boolean;
  /** Horizontal alignment of the header and cells. Default: start. */
  align?: 'start' | 'end';
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
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  /** Items rendered in the trailing Action column per row via TableActions. */
  rowActions?: TableActionItem[] | ((row: T) => TableActionItem[]);
  /** Items rendered in the header's trailing Action cell via TableActions. */
  headerActions?: TableActionItem[];
  /** Figma "Bottom Action": page size, total and prev / next. */
  pagination?: TablePagination;
  /** Give the table its own horizontal scroll container. Without this the page scrolls. */
  scroll?: boolean;
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
  depth = 0,
  parentId?: string,
): TreeNode<T>[] {
  return rows.map((row) => {
    const id = getRowId(row);
    const sub = getSubRows?.(row) ?? [];
    return {
      row,
      id,
      depth,
      parentId,
      children: buildTree(sub, getRowId, getSubRows, depth + 1, id),
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
    <input
      type="checkbox"
      className="sikat-table__check"
      aria-label={label}
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = !!indeterminate;
      }}
      style={{ maskImage: `url("${checkboxGlyph}")`, WebkitMaskImage: `url("${checkboxGlyph}")` }}
      onChange={(e) => onChange(e.currentTarget.checked)}
    />
  );
}

/** Figma Scroll Indicator: a 4px thumb tracking the horizontal scroll. */
function ScrollIndicator({ scroller }: { scroller: HTMLDivElement | null }) {
  const [state, setState] = useState({ visible: false, width: 0, left: 0 });
  useEffect(() => {
    if (!scroller) return;
    const update = () => {
      const { scrollWidth, clientWidth, scrollLeft } = scroller;
      const visible = scrollWidth > clientWidth + 1;
      const width = visible ? (clientWidth / scrollWidth) * 100 : 0;
      const left = visible ? (scrollLeft / (scrollWidth - clientWidth)) * (100 - width) : 0;
      setState({ visible, width, left });
    };
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(scroller);
    if (scroller.firstElementChild) ro.observe(scroller.firstElementChild);
    return () => {
      scroller.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [scroller]);
  if (!state.visible) return null;
  return (
    <div className="sikat-table__scroll" aria-hidden="true">
      <img
        className="sikat-table__scroll-thumb"
        src={scrollThumb}
        alt=""
        style={{ width: `${state.width}%`, left: `${state.left}%` }}
      />
    </div>
  );
}

/**
 * Table — the Figma Table (Components › Table): a `bg/secondary` card (1px
 * `border/default`, 16px radius, 4px padding) with a 36px header row (12/16
 * Semibold captions; hover shows the sort control) over a white, 12px-rounded
 * body of 36px rows (8px cells, bottom `border/default`, 14/20 Medium body text;
 * hover turns the row's rule `border/primary-subtle`; selected rows are
 * `bg/primary-subtle`). Optional checkbox column, trailing "…" action column,
 * header column-settings button, horizontal scroll indicator and pagination.
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
  rowActions,
  headerActions,
  pagination,
  scroll,
  layout,
  caption,
  footerRow,
  getSubRows,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  className,
  ...rest
}: TableProps<T>) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const [ownExpanded, setOwnExpanded] = useState(defaultExpandedIds);

  const tree = !!getSubRows;

  const roots = useMemo(
    () => buildTree(rows, getRowId, getSubRows),
    [rows, getRowId, getSubRows],
  );
  const nodes = useMemo(() => walk(roots), [roots]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const ids = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const leaves = useMemo(() => nodes.filter((n) => n.children.length === 0), [nodes]);
  const expandable = useMemo(() => nodes.filter((n) => n.children.length > 0).map((n) => n.id), [nodes]);
  const allExpanded = expandable.length > 0 && expandable.every((id) => expanded.has(id));

  const expanded = useMemo(
    () => new Set(expandedIds ?? ownExpanded),
    [expandedIds, ownExpanded],
  );
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
  const nextSort = (key: string): TableSort | null =>
    sort?.key !== key
      ? { key, direction: 'asc' }
      : sort.direction === 'asc'
        ? { key, direction: 'desc' }
        : null;

  return (
    <div className={cn('sikat-table', layout && `sikat-table--${layout}`, className)} {...rest}>
      <div
        ref={setScroller}
        className={cn('sikat-table__scroller', scroll && 'sikat-table__scroller--scroll')}
      >
        <table className="sikat-table__table" role={tree ? 'treegrid' : undefined}>
          {caption ? <caption className="sikat-table__caption">{caption}</caption> : null}
          <thead>
            <tr>
              {selectable ? (
                <th className="sikat-table__th sikat-table__th--check" scope="col">
                  <Check
                    label="Select all rows"
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={toggleAll}
                  />
                </th>
              ) : null}
              {columns.map((col) => {
                const sorted = sort?.key === col.key ? sort.direction : undefined;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className="sikat-table__th"
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
                            leadingIcon={<Icon size={20}>{allExpanded ? 'collapse_all' : 'expand_all'}</Icon>}
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
                          aria-label={`Sort by ${typeof col.header === 'string' ? col.header : col.key}`}
                          onClick={() => onSortChange?.(nextSort(col.key))}
                          leadingIcon={<Icon size={16}>unfold_more</Icon>}
                        />
                      ) : null}
                    </span>
                  </th>
                );
              })}
              {hasEnd ? (
                <th className="sikat-table__th sikat-table__th--end" scope="col">
                  {headerActions ? (
                    <span className="sikat-table__end">
                      <TableActions items={headerActions} />
                    </span>
                  ) : (
                    <span className="sikat-table__visually-hidden">Actions</span>
                  )}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {visible.map(({ node, pos, size }) => {
              const { row, id, depth } = node;
              const { checked: isSelected, mixed } = rowState(node);
              const hasChildren = node.children.length > 0;
              const isOpen = expanded.has(id);
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
                    <td className="sikat-table__td sikat-table__td--check">
                      <Check
                        label={`Select row ${id}`}
                        checked={isSelected}
                        indeterminate={mixed}
                        onChange={(on) => toggleRow(id, on)}
                      />
                    </td>
                  ) : null}
                  {columns.map((col, i) => {
                    const content = col.cell
                      ? col.cell(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '');
                    return (
                      <td
                        key={col.key}
                        className="sikat-table__td"
                        data-align={col.align === 'end' ? 'end' : undefined}
                      >
                        {tree && i === 0 ? (
                          <span
                            className="sikat-table__tree"
                            style={{ ['--table-depth' as string]: depth }}
                          >
                            {hasChildren ? (
                              <TableActions
                                items={[{
                                  type: 'expand',
                                  expanded: isOpen,
                                  label: `${isOpen ? 'Collapse' : 'Expand'} row ${id}`,
                                  onToggle: () => setExpanded(id, !isOpen),
                                  onKeyDown: (e) => onExpandKey(node, e),
                                }]}
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
                  {hasEnd ? (
                    <td className="sikat-table__td sikat-table__td--end">
                      {rowActions ? (
                        <span className="sikat-table__end">
                          <TableActions
                            items={typeof rowActions === 'function' ? rowActions(row) : rowActions}
                          />
                        </span>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              );
            })}
            {footerRow ? (
              <tr className="sikat-table__row">
                <td
                  className="sikat-table__td"
                  colSpan={columns.length + (selectable ? 1 : 0) + (hasEnd ? 1 : 0)}
                >
                  {footerRow}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <ScrollIndicator scroller={scroller} />
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
