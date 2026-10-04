# Tooltip

**Epic:** Feedback
**Component:** Tooltip

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to attach a tooltip to an element that shows on hover/focus,
so that I can provide supplemental information without cluttering the UI.

### Acceptance Criteria
- [ ] Tooltip renders a small floating message when the trigger is hovered or focused
- [ ] `message` prop sets the tooltip content (required)
- [ ] Tooltip is hidden by default and shows on trigger interaction
- [ ] Tooltip is keyboard accessible (shows on focus of the trigger)
- [ ] When `children` is omitted, the default trigger is an info icon button

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| message | ReactNode | — | — (required) |
| position | string | `top` \| `bottom` \| `left` \| `right` | `top` |
| align | string | `start` \| `end` | `start` |
| label | string | — | `'More information'` |
| icon | string | Material Symbol name | `'info'` |
| open | boolean | `true` \| `false` | — |
| defaultOpen | boolean | `true` \| `false` | `false` |
| onOpenChange | function | — | — |
| children | ReactNode | — | — |

---

## Positions

### User Story
As a developer consuming Sikat,
I want to control the position of a Tooltip relative to its trigger,
so that it doesn't overlap adjacent content.

### Acceptance Criteria
- [ ] `position="top"` renders the tooltip above the trigger (default)
- [ ] `position="bottom"` renders below
- [ ] `position="left"` renders to the left
- [ ] `position="right"` renders to the right
- [ ] `align="start"` / `end` adjusts the alignment within the position axis
- [ ] `data-position` and `data-align` are applied to the tooltip element

---

## Notes
- Related stories: `01-alert`.
