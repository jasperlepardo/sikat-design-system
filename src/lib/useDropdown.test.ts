import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useDropdown } from './useDropdown';

afterEach(() => {
  document.body.innerHTML = '';
});

function setup() {
  const root = document.createElement('div');
  const inside = document.createElement('button');
  const outside = document.createElement('button');
  root.append(inside);
  document.body.append(root, outside);

  const hook = renderHook(() => useDropdown());
  hook.result.current.rootRef.current = root;
  act(() => hook.result.current.setOpen(true));
  return { ...hook, inside, outside };
}

const mousedown = (el: Element) =>
  act(() => {
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });

describe('useDropdown', () => {
  it('toggles open state', () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.open).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
  });

  it('closes on Escape', () => {
    const { result } = setup();
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(result.current.open).toBe(false);
  });

  it('closes on pointer-down outside the root', () => {
    const { result, outside } = setup();
    mousedown(outside);
    expect(result.current.open).toBe(false);
  });

  it('stays open on pointer-down inside the root', () => {
    const { result, inside } = setup();
    mousedown(inside);
    expect(result.current.open).toBe(true);
  });
});
