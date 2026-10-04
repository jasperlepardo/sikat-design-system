# SidePanel

**Epic:** Navigation
**Component:** SidePanel

---

## Overlay

### User Story

As a developer consuming Sikat,
I want to render a side panel with an optional overlay behind it,
so that I can create drawer-style panels that focus user attention.

### Acceptance Criteria

- [ ] SidePanel renders a panel anchored to the side of the viewport
- [ ] `overlay={true}` renders a dimmed overlay behind the panel
- [ ] Clicking the overlay fires `onOverlayClick`
- [ ] When overlay is active, page scroll is locked

### Controls

| Control        | Type      | Options           | Default |
| -------------- | --------- | ----------------- | ------- |
| overlay        | boolean   | `true` \| `false` | `false` |
| onOverlayClick | function  | —                 | —       |
| children       | ReactNode | —                 | —       |

---

## Notes

- Related stories: `02-side-nav`, `12-data-display/04-panel`.
