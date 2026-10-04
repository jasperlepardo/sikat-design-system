# Combobox

**Epic:** Selection Fields
**Component:** Combobox

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a searchable dropdown that filters options as the user types,
so that users can quickly find and select a value from a large list.

### Acceptance Criteria

- [ ] Combobox renders a text input that opens a filtered dropdown on focus/click
- [ ] Options are filtered in real-time as the user types
- [ ] Selected option label is shown in the trigger input when closed
- [ ] `placeholder` is shown when no value is selected
- [ ] Works as both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)
- [ ] `emptyContent` is shown when no options match the query
- [ ] `footer` slot renders a persistent footer inside the dropdown (e.g. "Add new…")

### Controls

| Control       | Type                  | Options                                                         | Default |
| ------------- | --------------------- | --------------------------------------------------------------- | ------- |
| options       | array                 | `{ value, label, text?, subLabel?, description?, disabled? }[]` | —       |
| value         | string \| null        | —                                                               | —       |
| defaultValue  | string \| null        | —                                                               | `null`  |
| onValueChange | function              | —                                                               | —       |
| placeholder   | string                | —                                                               | —       |
| clearable     | boolean               | `true` \| `false`                                               | `false` |
| disabled      | boolean               | `true` \| `false`                                               | `false` |
| readOnly      | boolean               | `true` \| `false`                                               | `false` |
| invalid       | boolean               | `true` \| `false`                                               | `false` |
| size          | string                | `md`                                                            | `md`    |
| emptyContent  | ReactNode \| function | —                                                               | —       |
| footer        | ReactNode             | —                                                               | —       |
| onQueryChange | function              | —                                                               | —       |

---

## States

### User Story

As a developer consuming Sikat,
I want the Combobox to reflect disabled, readOnly, invalid, and clearable states,
so that users understand available interactions and any validation feedback.

### Acceptance Criteria

- [ ] `disabled={true}` renders the trigger with reduced opacity and no pointer events
- [ ] `readOnly={true}` prevents typing and dropdown opening
- [ ] `invalid={true}` renders an error border on the trigger
- [ ] `clearable={true}` shows a clear button when a value is selected
- [ ] `data-filled` is applied when a value is selected

---

## Multi-Line Options

### User Story

As a developer consuming Sikat,
I want options in a Combobox to display a sub-label and description,
so that users can differentiate between similar options using additional context.

### Acceptance Criteria

- [ ] `subLabel` renders a secondary line below the option label in the dropdown
- [ ] `description` renders a smaller descriptive line below the subLabel
- [ ] Multi-line options are vertically spaced and legible during search
- [ ] Filtering works against `text` (or `label` string) — not against subLabel/description
- [ ] Selected option in the closed trigger shows only the primary label

---

## Multi-Line Closed State

### User Story

As a developer consuming Sikat,
I want the Combobox trigger to display multi-line content when an option with a subLabel is selected,
so that the closed state communicates the full context of the selected value.

### Acceptance Criteria

- [ ] When a selected option has a `subLabel`, the closed trigger shows both the label and subLabel stacked
- [ ] The trigger height adjusts to accommodate the two-line content
- [ ] Single-line options still display in the standard single-line trigger
- [ ] The multi-line closed state is visually consistent with the Figma design

---

## Notes

- `onQueryChange` is used for server-side filtering when the default client filter is bypassed.
- Multi-line options introduced in v0.31.15; multi-line closed state introduced in v0.31.17.
- Related stories: `01-select`, `03-multi-select`, `04-autocomplete`.
