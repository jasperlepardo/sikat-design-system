# Theming

**Epic:** Theming & Tokens

---

## Dark Mode

### User Story

As a developer consuming Sikat,
I want the design system to support light and dark themes,
so that my application can adapt to OS preferences or user choice.

### Acceptance Criteria

- [ ] Applying `data-theme="dark"` to any ancestor element switches all descendant components to dark mode
- [ ] Removing `data-theme` (or setting `data-theme="light"`) reverts to light mode
- [ ] OS preference (`prefers-color-scheme: dark`) is respected as a fallback when no `data-theme` is set
- [ ] All semantic CSS variables resolve to correct dark-mode values
- [ ] No component requires a `theme` prop — the `data-theme` attribute is the only switch

### Controls

| Attribute                                 | Values            | Default       |
| ----------------------------------------- | ----------------- | ------------- |
| `data-theme` (HTML attribute on ancestor) | `light` \| `dark` | OS preference |

---

## Runtime Theme Switch

### User Story

As a developer consuming Sikat,
I want to switch the active theme at runtime using the `useTheme` hook,
so that users can toggle between light and dark mode from a settings control.

### Acceptance Criteria

- [ ] `useTheme()` returns the current theme value and a setter function
- [ ] Calling the setter updates `data-theme` on the document root (or a specified ancestor)
- [ ] Theme change applies immediately without a page reload
- [ ] Selected theme persists across component re-renders
- [ ] Theme preference can be saved to `localStorage` for persistence across sessions

### Controls

| Hook API   | Type                                 | Description          |
| ---------- | ------------------------------------ | -------------------- |
| `theme`    | `'light' \| 'dark'`                  | Current active theme |
| `setTheme` | `(theme: 'light' \| 'dark') => void` | Updates the theme    |

---

## Notes

- Related stories: `01-token-pipeline`, `13-cli-customization/01-cli`.
