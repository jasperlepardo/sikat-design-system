# Card

**Epic:** Display
**Component:** Card

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to wrap content in a Card,
so that related information is visually grouped in a bordered container with a white background.

### Acceptance Criteria
- [ ] Card renders a bordered container with a white inner background
- [ ] Card has a tertiary outer background when placed on a page
- [ ] Card accepts any children content
- [ ] Card theme colors update in dark mode

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| children | ReactNode | — | — |

---

## Header & Content

### User Story
As a developer consuming Sikat,
I want to add a header and scrollable content area to a Card,
so that I can build structured panels with a title and action buttons.

### Acceptance Criteria
- [ ] `Card.Header` renders a title, optional icon, and optional action buttons at the top of the card
- [ ] `sticky` option on `Card.Header` keeps the header fixed when `Card.Content` scrolls
- [ ] `Card.Content` renders a scrollable content area inside the card
- [ ] `actions` slot in `Card.Header` accepts buttons or icon buttons

### Controls
| Control (Card.Header) | Type | Options | Default |
|---------|------|---------|---------|
| icon | ReactNode | — | — |
| actions | ReactNode | — | — |
| sticky | boolean | `true` \| `false` | `false` |
| children | ReactNode | — | — |

---

## Notes
- Sub-components: `Card.Header`, `Card.Content`.
- Always wrap `Form.Group` inside `Card.Content` — see the `Form.Group in Card` pattern.
- Related stories: `06-form-composition/02-form`, `06-image`.
