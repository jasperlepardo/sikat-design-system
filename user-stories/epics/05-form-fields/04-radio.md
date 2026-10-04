# Radio

**Epic:** Form Fields
**Component:** Radio

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a group of radio buttons,
so that users can select exactly one option from a set.

### Acceptance Criteria

- [ ] Radio renders as a styled `<input type="radio">` with a label
- [ ] Selected and unselected states are visually distinct
- [ ] Radios sharing the same `name` attribute are mutually exclusive
- [ ] Works as both controlled (`checked` + `onChange`) and uncontrolled (`defaultChecked`)
- [ ] `disabled={true}` renders a non-interactive, visually muted radio
- [ ] Keyboard navigation (arrow keys) moves focus between radios in the same group

### Controls

| Control        | Type      | Options           | Default |
| -------------- | --------- | ----------------- | ------- |
| children       | ReactNode | —                 | —       |
| name           | string    | —                 | —       |
| value          | string    | —                 | —       |
| checked        | boolean   | `true` \| `false` | —       |
| defaultChecked | boolean   | `true` \| `false` | —       |
| disabled       | boolean   | `true` \| `false` | `false` |
| onChange       | function  | —                 | —       |

---

## Notes

- Wrap in `FormField` to attach a label, hint, and error message.
- Related stories: `03-checkbox`, `06-form-composition/01-form-field`.
