# IconButton

**Epic:** Actions
**Component:** IconButton

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to render a square button that contains only an icon,
so that I can add compact actions to toolbars, tables, and card headers.

### Acceptance Criteria
- [ ] IconButton renders with a single icon child and a required `label` prop
- [ ] The `label` is used as `aria-label` on the button element for screen readers
- [ ] Button renders as a square at all size values
- [ ] Default `intent` is `primary` and default `variant` is `solid`

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| children | ReactNode | Icon component | — |
| label | string | — | — (required) |
| intent | string | `primary` \| `default` \| `success` \| `warning` \| `danger` \| `white` \| `black` | `primary` |
| variant | string | `solid` \| `outline` \| `ghost` | `solid` |
| size | string | `extra-large` \| `large` \| `medium` \| `small` \| `extra-small` \| `2xs` | `medium` |
| type | string | `button` \| `submit` \| `reset` | `button` |
| disabled | boolean | `true` \| `false` | `false` |

---

## Variants & Intents

### User Story
As a developer consuming Sikat,
I want to apply intent and variant to an IconButton,
so that it communicates the right semantic meaning in its context.

### Acceptance Criteria
- [ ] All 7 `intent` values render distinct color schemes
- [ ] All 3 `variant` values render distinct visual styles: `solid`, `outline`, `ghost`
- [ ] Every intent × variant combination (21 total) is visually distinguishable
- [ ] `link` variant is not available on IconButton

---

## States

### User Story
As a developer consuming Sikat,
I want the IconButton to visually reflect disabled, hover, and focus states,
so that users know when the action is unavailable or focused.

### Acceptance Criteria
- [ ] `disabled={true}` renders reduced opacity and blocks pointer events
- [ ] Hover state applies a visual background shift via CSS (`:hover`)
- [ ] Focus-visible state displays a focus ring (`:focus-visible`)
- [ ] Disabled IconButton is removed from the Tab order
- [ ] Disabled state is consistent across all intent × variant combinations

---

## Notes
- `label` is required — it is the only accessible name for the button.
- IconButton does not support `leadingIcon`/`trailingIcon` — pass the icon as `children` directly.
- IconButton intentionally omits the `link` variant since icon-only link buttons have poor usability.
- Related stories: `01-button`, `03-button-group`.
