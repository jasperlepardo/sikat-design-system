import { useEffect, useState } from 'react';
import { IconButton } from '../Button/IconButton';
import { Select } from '../Field/Select';
import { TextField } from '../Field/TextField';
import { Icon } from '../Icon/Icon';
import './pagination.css';

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  /** Rows shown per page. */
  pageSize: number;
  /** Total number of rows across all pages. */
  total: number;
  /** Selectable page sizes (default `[10, 25, 50]`). */
  pageSizes?: number[];
  onPageChange: (page: number) => void;
  /** When omitted, the rows-per-page value is shown as static text (no menu). */
  onPageSizeChange?: (pageSize: number) => void;
}

/** The current-page control: an editable field. The user types a page number;
 *  it commits (clamped to `1..totalPages`) on Enter or blur. */
function PageField({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const [draft, setDraft] = useState(String(page));
  // Re-sync when the controlled page changes (e.g. prev/next buttons).
  useEffect(() => setDraft(String(page)), [page]);

  const commit = () => {
    const parsed = Math.floor(Number(draft));
    const next = Number.isFinite(parsed) ? Math.min(Math.max(1, parsed), totalPages) : page;
    setDraft(String(next));
    if (next !== page) onPageChange(next);
  };

  return (
    <TextField
      type="number"
      size="md"
      className="sikat-pagination__page-field"
      aria-label="Page"
      inputMode="numeric"
      min={1}
      max={totalPages}
      value={draft}
      onChange={(e) => setDraft(e.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        }
      }}
    />
  );
}

/**
 * Pagination — the Figma "Table Footer": a bordered, shadowed card holding a
 * tertiary tray with a rows-per-page selector, a divider, a "Page [n] of N"
 * indicator (the current page is an editable field), and segmented previous/next
 * controls. Fully token-driven, so it re-themes across light/dark. Consumed by
 * `Table` via its `pagination` prop, and exported for standalone use.
 */
export function Pagination({
  page,
  pageSize,
  total,
  pageSizes = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);

  return (
    <nav className="sikat-pagination" aria-label="Pagination">
      <div className="sikat-pagination__tray">
        <div className="sikat-pagination__section">
          {onPageSizeChange ? (
            <Select
              size="md"
              className="sikat-pagination__size-select"
              aria-label="Rows per page"
              options={pageSizes.map((n) => ({ value: String(n) }))}
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            />
          ) : (
            <span className="sikat-pagination__text">{pageSize}</span>
          )}
          <span className="sikat-pagination__text">of {total}</span>
        </div>

        <div className="sikat-pagination__divider" role="separator" aria-orientation="vertical" />

        <div className="sikat-pagination__section">
          <IconButton
            label="Previous page"
            intent="default"
            variant="link"
            size="small"
            className="sikat-pagination__nav-btn"
            disabled={current <= 1}
            onClick={() => onPageChange(current - 1)}
          >
            <Icon size={20}>arrow_back</Icon>
          </IconButton>
          <div className="sikat-pagination__page">
            <span className="sikat-pagination__text">Page</span>
            <PageField page={current} totalPages={totalPages} onPageChange={onPageChange} />
            <span className="sikat-pagination__text">of {totalPages}</span>
          </div>
          <IconButton
            label="Next page"
            intent="default"
            variant="link"
            size="small"
            className="sikat-pagination__nav-btn"
            disabled={current >= totalPages}
            onClick={() => onPageChange(current + 1)}
          >
            <Icon size={20}>arrow_forward</Icon>
          </IconButton>
        </div>
      </div>
    </nav>
  );
}
