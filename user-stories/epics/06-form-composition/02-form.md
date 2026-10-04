# Form

**Epic:** Form Composition
**Component:** Form / Form.Group / Form.Section / Form.Fieldset / Form.Header

---

## Group Columns

### User Story

As a developer consuming Sikat,
I want to arrange form fields into a multi-column grid using Form.Group,
so that I can build dense, well-aligned form layouts.

### Acceptance Criteria

- [ ] `columns={1}` renders fields stacked in a single column
- [ ] `columns={2}` renders fields in a two-column grid
- [ ] `columns={3}` renders fields in a three-column grid
- [ ] Fields within the group are evenly spaced and their labels align across columns
- [ ] Wrapping `FormField` inside `Form.Group` inside `Card.Content` follows the established pattern

### Controls

| Control (Form.Group) | Type      | Options           | Default |
| -------------------- | --------- | ----------------- | ------- |
| columns              | number    | `1` \| `2` \| `3` | `1`     |
| children             | ReactNode | —                 | —       |

---

## Sections & Fieldsets

### User Story

As a developer consuming Sikat,
I want to group related form fields into labeled sections,
so that long forms are scannable and logically organized.

### Acceptance Criteria

- [ ] `Form.Section` renders a visually distinct section container
- [ ] `Form.Fieldset` renders a `<fieldset>` for grouped controls (checkboxes/radios)
- [ ] `Form.Header` renders a section heading inside a Form.Section
- [ ] `Form.Group` inside `Form.Section` arranges fields in a column grid
- [ ] Multiple Form.Sections stack vertically with consistent spacing

---

## Notes

- Sub-components: `Form.Section`, `Form.Fieldset`, `Form.Header`, `Form.Group`.
- `columns` prop updated in v0.31.14: now takes `1 | 2 | 3` instead of a boolean.
- Always wrap `FormField` in `Form.Group` inside `Card.Content` — see the `Form.Group in Card` pattern.
- `Form` is a thin wrapper around the native `<form>` element.
- Related stories: `01-form-field`, `03-display/07-card`.
