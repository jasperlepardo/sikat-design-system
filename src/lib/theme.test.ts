import { afterEach, describe, expect, it } from 'vitest';

import { THEME_STORAGE_KEY, getThemeMode, resolveTheme, setThemeMode } from './theme';

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('getThemeMode', () => {
  it('defaults to system', () => {
    expect(getThemeMode()).toBe('system');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    expect(getThemeMode()).toBe('system');
  });
});

describe('setThemeMode', () => {
  it('sets data-theme and persists the mode', () => {
    setThemeMode('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(getThemeMode()).toBe('dark');
  });

  it('clears data-theme for system', () => {
    setThemeMode('light');
    setThemeMode('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(getThemeMode()).toBe('system');
  });
});

describe('resolveTheme', () => {
  it('returns explicit modes as-is', () => {
    expect(resolveTheme('dark')).toBe('dark');
    expect(resolveTheme('light')).toBe('light');
  });

  it('falls back to light for system when matchMedia is unavailable', () => {
    // jsdom does not implement matchMedia.
    expect(resolveTheme('system')).toBe('light');
  });
});
