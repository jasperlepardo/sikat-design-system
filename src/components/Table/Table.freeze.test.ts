import { describe, expect, it } from 'vitest';
import { computeFreezeOffsets } from './Table';

describe('computeFreezeOffsets', () => {
  it('returns all-null when nothing is pinned', () => {
    expect(computeFreezeOffsets([100, 100, 100], 0, 0)).toEqual([null, null, null]);
  });

  it('accumulates left offsets and flags the inner edge', () => {
    const out = computeFreezeOffsets([50, 80, 120, 200], 2, 0);
    expect(out[0]).toEqual({ side: 'start', offset: 0, edge: false });
    expect(out[1]).toEqual({ side: 'start', offset: 50, edge: true });
    expect(out[2]).toBeNull();
    expect(out[3]).toBeNull();
  });

  it('accumulates right offsets from the right edge and flags the inner edge', () => {
    const out = computeFreezeOffsets([50, 80, 120, 200], 0, 2);
    expect(out[0]).toBeNull();
    expect(out[1]).toBeNull();
    // rightmost cell: 0 from the right; its neighbour: 200 (width of the rightmost)
    expect(out[3]).toEqual({ side: 'end', offset: 0, edge: false });
    expect(out[2]).toEqual({ side: 'end', offset: 200, edge: true });
  });

  it('pins both sides at once and leaves the middle scrolling', () => {
    const out = computeFreezeOffsets([40, 100, 100, 100, 60], 1, 1);
    expect(out[0]).toEqual({ side: 'start', offset: 0, edge: true });
    expect(out[1]).toBeNull();
    expect(out[2]).toBeNull();
    expect(out[3]).toBeNull();
    expect(out[4]).toEqual({ side: 'end', offset: 0, edge: true });
  });

  it('includes the checkbox track on the left (leftCount > data count)', () => {
    // [checkbox(36), data0(100), data1(100), data2(100)] with start=2 → leftCount=3
    const out = computeFreezeOffsets([36, 100, 100, 100], 3, 0);
    expect(out[0]).toEqual({ side: 'start', offset: 0, edge: false });
    expect(out[1]).toEqual({ side: 'start', offset: 36, edge: false });
    expect(out[2]).toEqual({ side: 'start', offset: 136, edge: true });
    expect(out[3]).toBeNull();
  });

  it('never overlaps the two sides — left wins and right is clamped', () => {
    const out = computeFreezeOffsets([50, 50], 2, 2);
    expect(out[0]?.side).toBe('start');
    expect(out[1]?.side).toBe('start');
  });
});
