import { act, renderHook } from '@testing-library/react';
import { useState, type KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useListbox, type UseListboxOptions } from './useListbox';

const ITEMS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

type Opts = Partial<Omit<UseListboxOptions, 'open' | 'setOpen'>>;

/** useListbox with real open state, so key presses can open/close it. */
function setup(opts: Opts = {}) {
  const onActivate = vi.fn();
  const hook = renderHook(() => {
    const [open, setOpen] = useState(false);
    const lb = useListbox({
      itemCount: ITEMS.length,
      open,
      setOpen,
      onActivate,
      getItemId: (i) => `opt-${i}`,
      getItemText: (i) => ITEMS[i],
      ...opts,
    });
    return { open, setOpen, ...lb };
  });
  const press = (key: string, currentTarget?: HTMLElement) => {
    const e = {
      key,
      currentTarget,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent<HTMLElement>;
    act(() => hook.result.current.onKeyDown(e));
    return e;
  };
  return { ...hook, onActivate, press };
}

describe('useListbox', () => {
  it('opens on ArrowDown and highlights the first enabled item', () => {
    const { result, press } = setup({ isDisabled: (i) => i === 0 });
    expect(result.current.activeId).toBeUndefined();

    const e = press('ArrowDown');
    expect(e.preventDefault).toHaveBeenCalled();
    expect(result.current.open).toBe(true);
    expect(result.current.activeIndex).toBe(1);
    expect(result.current.activeId).toBe('opt-1');
  });

  it('highlights the selected item on open', () => {
    const { result, press } = setup({ selectedIndex: 3 });
    press('Enter');
    expect(result.current.open).toBe(true);
    expect(result.current.activeIndex).toBe(3);
  });

  it('moves with arrows, wrapping and skipping disabled items', () => {
    const { result, press } = setup({ isDisabled: (i) => i === 2 });
    press('ArrowDown'); // open → 0
    press('ArrowDown');
    expect(result.current.activeIndex).toBe(1);
    press('ArrowDown'); // skips 2
    expect(result.current.activeIndex).toBe(3);
    press('ArrowUp'); // skips 2
    expect(result.current.activeIndex).toBe(1);
    press('ArrowUp');
    press('ArrowUp'); // wraps
    expect(result.current.activeIndex).toBe(4);
  });

  it('jumps with Home and End', () => {
    const { result, press } = setup({ isDisabled: (i) => i === 4 });
    press('ArrowDown');
    press('End');
    expect(result.current.activeIndex).toBe(3);
    press('Home');
    expect(result.current.activeIndex).toBe(0);
  });

  it('activates the active item on Enter and closes', () => {
    const { result, press, onActivate } = setup();
    press('ArrowDown');
    press('ArrowDown');
    press('Enter');
    expect(onActivate).toHaveBeenCalledWith(1);
    expect(result.current.open).toBe(false);
    expect(result.current.activeIndex).toBe(-1);
  });

  it('stays open after activating when closeOnActivate is false', () => {
    const { result, press, onActivate } = setup({ closeOnActivate: false });
    press('ArrowDown');
    press(' ');
    expect(onActivate).toHaveBeenCalledWith(0);
    expect(result.current.open).toBe(true);
  });

  it('lets Space type into a text input instead of activating', () => {
    const { result, press, onActivate } = setup();
    press('ArrowDown');
    const e = press(' ', document.createElement('input'));
    expect(e.preventDefault).not.toHaveBeenCalled();
    expect(onActivate).not.toHaveBeenCalled();
    expect(result.current.open).toBe(true);
  });

  it('type-ahead opens and jumps to the matching item', () => {
    const { result, press } = setup();
    const e = press('c');
    expect(e.preventDefault).toHaveBeenCalled();
    expect(result.current.open).toBe(true);
    expect(result.current.activeIndex).toBe(2);
  });

  it('drops aria-activedescendant when the list shrinks below the active index', () => {
    let count = ITEMS.length;
    const { result, rerender, press } = setup({
      get itemCount() {
        return count;
      },
    });
    press('ArrowDown');
    expect(result.current.activeId).toBe('opt-0');
    count = 0;
    rerender();
    expect(result.current.activeId).toBeUndefined();
  });

  it('ignores type-ahead with no match', () => {
    const { result, press } = setup();
    const e = press('z');
    expect(e.preventDefault).not.toHaveBeenCalled();
    expect(result.current.open).toBe(false);
  });
});
