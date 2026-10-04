# Select

**Epic:** Selection Fields
**Component:** Select

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a dropdown select field from a list of options,
so that users can pick one value from a predefined set.

### Acceptance Criteria

- [ ] Select renders a trigger button that opens a dropdown list on click
- [ ] Options are provided as an array with `{ value, label }` shape
- [ ] Selected option label is shown in the trigger
- [ ] `placeholder` is shown when no value is selected
- [ ] Works as both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)
- [ ] Dropdown closes after selection

### Controls

| Control       | Type      | Options                                                         | Default |
| ------------- | --------- | --------------------------------------------------------------- | ------- |
| options       | array     | `{ value, label, text?, subLabel?, description?, disabled? }[]` | —       |
| value         | string    | —                                                               | —       |
| defaultValue  | string    | —                                                               | —       |
| onValueChange | function  | —                                                               | —       |
| placeholder   | string    | —                                                               | —       |
| clearable     | boolean   | `true` \| `false`                                               | `false` |
| disabled      | boolean   | `true` \| `false`                                               | `false` |
| readOnly      | boolean   | `true` \| `false`                                               | `false` |
| invalid       | boolean   | `true` \| `false`                                               | `false` |
| size          | string    | `md`                                                            | `md`    |
| leadingIcon   | ReactNode | —                                                               | —       |
| prefix        | ReactNode | —                                                               | —       |
| suffix        | ReactNode | —                                                               | —       |
| trailingIcon  | ReactNode | —                                                               | —       |

---

## States

### User Story

As a developer consuming Sikat,
I want the Select to reflect disabled, readOnly, invalid, and clearable states,
so that users understand available interactions and validation feedback.

### Acceptance Criteria

- [ ] `disabled={true}` renders the trigger with reduced opacity and no pointer events
- [ ] `readOnly={true}` renders a non-interactive field style
- [ ] `invalid={true}` renders an error border on the trigger
- [ ] `clearable={true}` shows a clear button when a value is selected; clicking it resets to empty
- [ ] `data-filled` is applied to the trigger when a value is selected
- [ ] `data-state` is applied for CSS targeting of the current state

---

## Multi-Line Options

### User Story

As a developer consuming Sikat,
I want options in a Select to display a sub-label and description beneath the main label,
so that users can make more informed selections when options need additional context.

### Acceptance Criteria

- [ ] `subLabel` renders a secondary line of text directly below the option label
- [ ] `description` renders a smaller descriptive line below the subLabel
- [ ] Multi-line options are vertically spaced and legible in the dropdown
- [ ] Selected option in the trigger shows only the `label` (not subLabel/description)
- [ ] `text` field is used as the searchable/display text when label is a non-string ReactNode

### Controls

| Control               | Type      | Options           | Default |
| --------------------- | --------- | ----------------- | ------- |
| options[].label       | ReactNode | —                 | —       |
| options[].text        | string    | —                 | —       |
| options[].subLabel    | ReactNode | —                 | —       |
| options[].description | ReactNode | —                 | —       |
| options[].disabled    | boolean   | `true` \| `false` | `false` |

---

## Notes

- Multi-line options introduced in v0.31.15.
- Related stories: `02-combobox`, `03-multi-select`, `04-autocomplete`.
