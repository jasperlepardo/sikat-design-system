# DatePicker

**Epic:** Date & Time
**Component:** DatePicker

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to render a date input with a calendar popup,
so that users can select a date from an interactive calendar.

### Acceptance Criteria
- [ ] DatePicker renders a trigger input that opens a calendar on click
- [ ] Selecting a date in the calendar closes the calendar and fills the input with the date
- [ ] Date value is in `YYYY-MM-DD` format
- [ ] `placeholder` text is shown when no date is selected (default: `'Select a date'`)
- [ ] Works as both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| value | string \| null | YYYY-MM-DD format | — |
| defaultValue | string \| null | — | `''` |
| onValueChange | function | — | — |
| placeholder | string | — | `'Select a date'` |
| size | string | `md` | `md` |
| disabled | boolean | `true` \| `false` | `false` |
| readOnly | boolean | `true` \| `false` | `false` |
| invalid | boolean | `true` \| `false` | `false` |

---

## States

### User Story
As a developer consuming Sikat,
I want the DatePicker to reflect disabled, readOnly, and invalid states,
so that users understand when date selection is blocked or has an error.

### Acceptance Criteria
- [ ] `disabled={true}` renders the trigger with reduced opacity; calendar cannot be opened
- [ ] `readOnly={true}` renders a non-interactive field; calendar cannot be opened
- [ ] `invalid={true}` renders an error border on the trigger
- [ ] `data-filled` is applied when a date value is selected

---

## Calendar Icon Behavior

### User Story
As a developer consuming Sikat,
I want the calendar icon on the DatePicker to appear only on hover,
so that the field has a clean appearance at rest and the icon appears contextually.

### Acceptance Criteria
- [ ] Calendar icon is hidden at rest when the field has a value
- [ ] Calendar icon becomes visible when the field is hovered
- [ ] Calendar icon is always visible when the field is empty (to indicate the field type)
- [ ] Clicking the calendar icon opens the calendar popup

---

## Notes
- Calendar icon hover-only behavior introduced in v0.31.12.
- Related stories: `06-form-composition/01-form-field`.
