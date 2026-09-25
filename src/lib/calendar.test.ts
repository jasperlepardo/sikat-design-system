import { describe, expect, it } from 'vitest';

import { formatDisplayDate, fromISODate, monthMatrix, toISODate } from './calendar';

describe('toISODate', () => {
  it('formats local date as YYYY-MM-DD with zero padding', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('fromISODate', () => {
  it('parses to a local date', () => {
    const d = fromISODate('2026-05-27');
    expect(d && toISODate(d)).toBe('2026-05-27');
  });

  it('returns null for empty or malformed input', () => {
    expect(fromISODate('')).toBeNull();
    expect(fromISODate(null)).toBeNull();
    expect(fromISODate('2026-05')).toBeNull();
  });
});

describe('monthMatrix', () => {
  // September 2026 starts on a Tuesday.
  const grid = monthMatrix(2026, 8);

  it('returns a 6×7 Sunday-first grid', () => {
    expect(grid).toHaveLength(42);
    expect(grid[0].date.getDay()).toBe(0);
    expect(grid[0].iso).toBe('2026-08-30');
  });

  it('flags days in the displayed month', () => {
    const inMonth = grid.filter((d) => d.inMonth);
    expect(inMonth).toHaveLength(30);
    expect(inMonth[0].iso).toBe('2026-09-01');
    expect(inMonth.at(-1)?.iso).toBe('2026-09-30');
  });
});

describe('formatDisplayDate', () => {
  it('formats as "D Month YYYY"', () => {
    expect(formatDisplayDate('2026-05-27')).toBe('27 May 2026');
  });

  it('returns "" for empty and passes through malformed input', () => {
    expect(formatDisplayDate('')).toBe('');
    expect(formatDisplayDate('nope')).toBe('nope');
  });
});
