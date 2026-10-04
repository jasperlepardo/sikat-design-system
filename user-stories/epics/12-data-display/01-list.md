# List

**Epic:** Data Display
**Component:** List / List.Item / List.Card / List.Section

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a list of items with labels and values,
so that I can display structured record data in a readable format.

### Acceptance Criteria

- [ ] `List` renders a container for List.Item children
- [ ] `List.Item` renders a row with `title` and `content`
- [ ] `variant="inline"` renders title and content side by side (default)
- [ ] `variant="stacked"` renders title above content
- [ ] `variant="stacked-value"` renders a large value below the title
- [ ] `variant="value-only"` renders content without a title
- [ ] `divider={true}` renders a separator line between items

### Controls

| Control (List.Item) | Type      | Options                                                  | Default  |
| ------------------- | --------- | -------------------------------------------------------- | -------- |
| variant             | string    | `inline` \| `stacked` \| `stacked-value` \| `value-only` | `inline` |
| title               | ReactNode | —                                                        | —        |
| content             | ReactNode | —                                                        | —        |
| leading             | ReactNode | —                                                        | —        |
| trailing            | ReactNode | —                                                        | —        |
| divider             | boolean   | `true` \| `false`                                        | `false`  |
| onClick             | function  | —                                                        | —        |
| href                | string    | —                                                        | —        |

---

## Sections & Groups

### User Story

As a developer consuming Sikat,
I want to group list items under labeled section headers,
so that long lists are scannable and logically organized.

### Acceptance Criteria

- [ ] `List.Section` wraps a labeled group of items
- [ ] `List.Header` renders a section heading at the top of a section
- [ ] `List.Group` groups multiple items without a header
- [ ] Sections are visually separated with spacing or dividers

---

## Card Item

### User Story

As a developer consuming Sikat,
I want to render expandable card-style list items with a header and field rows,
so that I can show summary + detail data in a collapsible format.

### Acceptance Criteria

- [ ] `List.Card` renders a card with a `title`, optional `icon`, `badge`, and `actions`
- [ ] `fields` array renders labeled field rows inside the card body
- [ ] `expanded` / `defaultExpanded` controls the expand/collapse state
- [ ] `onExpandedChange` fires when the expand state changes
- [ ] `aria-expanded` is set on the card trigger

### Controls

| Control (List.Card) | Type      | Options              | Default      |
| ------------------- | --------- | -------------------- | ------------ |
| title               | ReactNode | —                    | — (required) |
| icon                | ReactNode | —                    | —            |
| badge               | ReactNode | —                    | —            |
| actions             | ReactNode | —                    | —            |
| fields              | array     | `{ label, value }[]` | —            |
| expanded            | boolean   | `true` \| `false`    | —            |
| defaultExpanded     | boolean   | `true` \| `false`    | `false`      |
| onExpandedChange    | function  | —                    | —            |

---

## Notes

- Sub-components: `List.Section`, `List.Header`, `List.Group`, `List.Item`, `List.Card`, `List.Leading`, `List.Trailing`, `List.Content`, `List.Title`, `List.Value`.
- Related stories: `02-table`, `03-display/07-card`.
