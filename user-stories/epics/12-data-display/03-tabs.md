# Tabs

**Epic:** Data Display
**Component:** Tabs

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a tabbed interface that shows one panel at a time,
so that I can organize related content into switchable views.

### Acceptance Criteria

- [ ] `items` array defines the tab labels and associated content
- [ ] Clicking a tab sets it as active and shows its content panel
- [ ] Works as both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)
- [ ] Active tab is keyboard navigable with arrow keys
- [ ] `aria-selected` is applied to the active tab

### Controls

| Control         | Type     | Options                                                   | Default   |
| --------------- | -------- | --------------------------------------------------------- | --------- |
| items           | array    | `{ value, label, icon?, badge?, disabled?, controls? }[]` | —         |
| value           | string   | —                                                         | —         |
| defaultValue    | string   | —                                                         | —         |
| onValueChange   | function | —                                                         | —         |
| variant         | string   | `primary` \| `secondary` \| `outline`                     | `primary` |
| aria-label      | string   | —                                                         | —         |
| aria-labelledby | string   | —                                                         | —         |

---

## Variants

### User Story

As a developer consuming Sikat,
I want to choose the visual style of the Tabs component,
so that it fits the context of the page (e.g. primary nav tabs vs. secondary filter tabs).

### Acceptance Criteria

- [ ] `variant="primary"` renders the default tab style with an underline indicator
- [ ] `variant="secondary"` renders a lower-emphasis tab style
- [ ] `variant="outline"` renders pill-style tabs with a border
- [ ] Tab items can include an `icon` and a `badge` alongside the label
- [ ] `disabled` items are non-interactive and visually muted

### Controls

| Control          | Type      | Options           | Default |
| ---------------- | --------- | ----------------- | ------- |
| items[].icon     | ReactNode | —                 | —       |
| items[].badge    | ReactNode | —                 | —       |
| items[].disabled | boolean   | `true` \| `false` | `false` |
| items[].controls | ReactNode | —                 | —       |

---

## Notes

- Related stories: `02-table`, `04-panel`.
