# Link

**Epic:** Actions
**Component:** Link

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a styled anchor link with Sikat's design language,
so that in-page and external links are visually consistent with buttons and other actions.

### Acceptance Criteria

- [ ] Link renders as an `<a>` element with correct `href` and optional `target` / `rel`
- [ ] Default `intent` is `primary`
- [ ] Link text is the `children` prop

### Controls

| Control      | Type      | Options                                                                            | Default   |
| ------------ | --------- | ---------------------------------------------------------------------------------- | --------- |
| children     | ReactNode | —                                                                                  | —         |
| href         | string    | —                                                                                  | —         |
| target       | string    | `_blank` \| `_self` \| etc.                                                        | —         |
| rel          | string    | —                                                                                  | —         |
| intent       | string    | `default` \| `primary` \| `success` \| `warning` \| `danger` \| `white` \| `black` | `primary` |
| disabled     | boolean   | `true` \| `false`                                                                  | `false`   |
| leadingIcon  | ReactNode | —                                                                                  | —         |
| trailingIcon | ReactNode | —                                                                                  | —         |

---

## Variants & Icon Slots

### User Story

As a developer consuming Sikat,
I want to apply different intents and attach icons to a Link,
so that I can match the link's emphasis and context in the UI.

### Acceptance Criteria

- [ ] All 7 `intent` values render distinct link colors
- [ ] `leadingIcon` renders an icon before the link text
- [ ] `trailingIcon` renders an icon after the link text (e.g. external link arrow)
- [ ] Icon size is consistent with the surrounding text size
- [ ] `white` intent is designed for links on dark backgrounds

---

## States

### User Story

As a developer consuming Sikat,
I want the Link to reflect hover, focus, and disabled states,
so that users receive clear interaction feedback.

### Acceptance Criteria

- [ ] Hover state applies an underline or color shift via CSS
- [ ] Focus-visible state shows a visible focus ring
- [ ] `disabled={true}` removes pointer events and renders the link with reduced opacity
- [ ] Disabled link is not navigable via keyboard

---

## Notes

- When `target="_blank"` is used, consider adding `rel="noopener noreferrer"` for security.
- Related stories: `01-button`.
