# SideNav

**Epic:** Navigation
**Component:** SideNav

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a sidebar navigation with sections and items,
so that users can navigate between areas of the application.

### Acceptance Criteria

- [ ] SideNav renders a list of navigation items grouped into sections
- [ ] `activeId` highlights the currently active item
- [ ] Clicking an item fires `onNavigate` with the item's id
- [ ] `aria-label` is applied to the nav element (default: `'Sidebar'`)

### Controls

| Control       | Type           | Options                  | Default     |
| ------------- | -------------- | ------------------------ | ----------- |
| sections      | array          | `{ id, title, items }[]` | —           |
| activeId      | string         | —                        | —           |
| onNavigate    | function       | —                        | —           |
| orientation   | string         | `expanded` \| `compact`  | `expanded`  |
| openId        | string \| null | —                        | —           |
| defaultOpenId | string \| null | —                        | —           |
| onOpenChange  | function       | —                        | —           |
| aria-label    | string         | —                        | `'Sidebar'` |

---

## Orientations

### User Story

As a developer consuming Sikat,
I want to switch the SideNav between expanded and compact layouts,
so that I can collapse the sidebar to save horizontal space when needed.

### Acceptance Criteria

- [ ] `orientation="expanded"` shows section titles and full item labels
- [ ] `orientation="compact"` shows only icons (items must have icons defined)
- [ ] `data-orientation` is applied to the root element
- [ ] Compact orientation provides accessible item labels (e.g. tooltip or aria-label)

---

## Notes

- Related stories: `01-navbar`, `03-side-panel`.
