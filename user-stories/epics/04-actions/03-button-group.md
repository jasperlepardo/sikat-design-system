# ButtonGroup

**Epic:** Actions
**Component:** ButtonGroup

---

## Layout

### User Story
As a developer consuming Sikat,
I want to wrap multiple buttons in a ButtonGroup to control their alignment and layout,
so that action bars and footer buttons are consistently spaced and aligned.

### Acceptance Criteria
- [ ] `orientation="horizontal"` renders buttons in a row (default)
- [ ] `orientation="stacked"` renders buttons in a column
- [ ] `align="start"` / `center` / `end` / `between` positions buttons within the group
- [ ] `fill={true}` stretches each button to fill the group width equally
- [ ] ButtonGroup works with both `Button` and `IconButton` as children
- [ ] `data-orientation`, `data-align`, and `data-fill` are applied to the root element

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| orientation | string | `horizontal` \| `stacked` | `horizontal` |
| align | string | `start` \| `center` \| `end` \| `between` | `end` |
| fill | boolean | `true` \| `false` | `false` |
| children | ReactNode | — | — |

---

## Notes
- Related stories: `01-button`, `02-icon-button`.
