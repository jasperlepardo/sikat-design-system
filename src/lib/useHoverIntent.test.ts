import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useHoverIntent } from './useHoverIntent';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useHoverIntent', () => {
  it('turns on immediately and off after the delay', () => {
    const { result } = renderHook(() => useHoverIntent(150));
    act(() => result.current.onHover(true));
    expect(result.current.hovering).toBe(true);
    act(() => result.current.onHover(false));
    act(() => vi.advanceTimersByTime(149));
    expect(result.current.hovering).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.hovering).toBe(false);
  });

  it('stays on when the pointer moves to another element within the delay', () => {
    const { result } = renderHook(() => useHoverIntent(150));
    act(() => result.current.onHover(true));
    act(() => result.current.onHover(false));
    act(() => vi.advanceTimersByTime(100));
    act(() => result.current.onHover(true));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.hovering).toBe(true);
  });

  it('reset ends hover at once', () => {
    const { result } = renderHook(() => useHoverIntent(150));
    act(() => result.current.onHover(true));
    act(() => result.current.reset());
    expect(result.current.hovering).toBe(false);
  });
});
