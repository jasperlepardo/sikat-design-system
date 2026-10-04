# MultiSelect

**Epic:** Selection Fields
**Component:** MultiSelect

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a field where users can select multiple options,
so that they can pick more than one value from a list.

### Acceptance Criteria

- [ ] MultiSelect renders a trigger that opens a dropdown of checkable options
- [ ] Selected options appear as tags/chips inside the trigger
- [ ] `placeholder` is shown when no values are selected
- [ ] Works as both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)
- [ ] Individual selected tags can be removed by clicking their dismiss button

### Controls

| Control       | Type      | Options                                                         | Default |
| ------------- | --------- | --------------------------------------------------------------- | ------- |
| options       | array     | `{ value, label, text?, subLabel?, description?, disabled? }[]` | —       |
| value         | array     | —                                                               | —       |
| defaultValue  | array     | —                                                               | `[]`    |
| onValueChange | function  | —                                                               | —       |
| placeholder   | string    | —                                                               | —       |
| disabled      | boolean   | `true` \| `false`                                               | `false` |
| invalid       | boolean   | `true` \| `false`                                               | `false` |
| leadingIcon   | ReactNode | —                                                               | —       |
| prefix        | ReactNode | —                                                               | —       |
| suffix        | ReactNode | —                                                               | —       |
| trailingIcon  | ReactNode | —                                                               | —       |

---

## States

### User Story

As a developer consuming Sikat,
I want the MultiSelect to reflect disabled and invalid states,
so that users understand when selection is unavailable or there is a validation error.

### Acceptance Criteria

- [ ] `disabled={true}` renders the trigger with reduced opacity and no pointer events
- [ ] `invalid={true}` renders an error border on the trigger
- [ ] `data-filled` is applied when at least one value is selected
- [ ] Disabled options within the dropdown are non-interactive and visually muted

### Controls

| Control            | Type    | Options           | Default |
| ------------------ | ------- | ----------------- | ------- |
| options[].disabled | boolean | `true` \| `false` | `false` |

---

## Notes

- Related stories: `01-select`, `02-combobox`, `04-autocomplete`.
