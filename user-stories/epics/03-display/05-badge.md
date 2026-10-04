# Badge

**Epic:** Display
**Component:** Badge / BadgeCounter

---

## Variants & Intents

### User Story

As a developer consuming Sikat,
I want to render a status badge with different intents and visual styles,
so that I can communicate a record's state or category at a glance.

### Acceptance Criteria

- [ ] All 7 `intent` values render distinct badge colors: `default`, `primary`, `success`, `warning`, `danger`, `white`, `black`
- [ ] All 3 `variant` values render distinct styles: `solid`, `outline`, `ghost`
- [ ] All 3 `size` values render distinct badge sizes: `small`, `medium`, `large`
- [ ] `dot={true}` renders a small colored dot instead of the text label
- [ ] `leadingIcon` / `trailingIcon` render icons inside the badge

### Controls

| Control      | Type      | Options                                                                            | Default   |
| ------------ | --------- | ---------------------------------------------------------------------------------- | --------- |
| intent       | string    | `default` \| `primary` \| `success` \| `warning` \| `danger` \| `white` \| `black` | `default` |
| variant      | string    | `solid` \| `outline` \| `ghost`                                                    | `solid`   |
| size         | string    | `small` \| `medium` \| `large`                                                     | `medium`  |
| dot          | boolean   | `true` \| `false`                                                                  | `false`   |
| leadingIcon  | ReactNode | —                                                                                  | —         |
| trailingIcon | ReactNode | —                                                                                  | —         |
| children     | ReactNode | —                                                                                  | —         |

---

## Counter

### User Story

As a developer consuming Sikat,
I want to render a numeric counter badge,
so that I can show notification counts or item quantities next to labels.

### Acceptance Criteria

- [ ] `count` prop renders the numeric value inside the badge
- [ ] When `count` exceeds `max`, the badge displays `{max}+` (e.g. `99+`)
- [ ] Counter badge supports the same `intent` and `variant` options as Badge
- [ ] `children` renders inline text beside the counter (optional)

### Controls

| Control  | Type      | Options                                                                            | Default   |
| -------- | --------- | ---------------------------------------------------------------------------------- | --------- |
| count    | number    | —                                                                                  | —         |
| max      | number    | —                                                                                  | —         |
| intent   | string    | `default` \| `primary` \| `success` \| `warning` \| `danger` \| `white` \| `black` | `default` |
| variant  | string    | `solid` \| `outline` \| `ghost`                                                    | `solid`   |
| children | ReactNode | —                                                                                  | —         |

---

## Dismissible

### User Story

As a developer consuming Sikat,
I want to render a dismissible badge that can be removed by the user,
so that I can build tag lists and filter chips that users can clear.

### Acceptance Criteria

- [ ] `onDismiss` prop renders a dismiss (×) button inside the badge
- [ ] Clicking the dismiss button fires `onDismiss`
- [ ] `dismissLabel` provides an accessible label for the dismiss button (default: `'Dismiss'`)
- [ ] The dismiss button is keyboard focusable and activatable with Enter/Space

### Controls

| Control      | Type     | Options | Default     |
| ------------ | -------- | ------- | ----------- |
| onDismiss    | function | —       | —           |
| dismissLabel | string   | —       | `'Dismiss'` |

---

## Notes

- `BadgeCounter` is a separate sub-component for numeric counts.
- When `onDismiss` is provided, the dismiss button is rendered automatically.
- Related stories: `01-text`, `04-actions/01-button`.
