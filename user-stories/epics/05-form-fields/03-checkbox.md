# Checkbox

**Epic:** Form Fields
**Component:** Checkbox

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a checkbox with a label,
so that users can toggle a boolean option in a form.

### Acceptance Criteria

- [ ] Checkbox renders as a styled `<input type="checkbox">` with a label
- [ ] Checked and unchecked states are visually distinct
- [ ] Works as both controlled (`checked` + `onChange`) and uncontrolled (`defaultChecked`)
- [ ] `disabled={true}` renders a non-interactive, visually muted checkbox
- [ ] Checkbox is keyboard focusable and togglable with Space

### Controls

| Control        | Type      | Options           | Default |
| -------------- | --------- | ----------------- | ------- |
| children       | ReactNode | —                 | —       |
| checked        | boolean   | `true` \| `false` | —       |
| defaultChecked | boolean   | `true` \| `false` | —       |
| disabled       | boolean   | `true` \| `false` | `false` |
| onChange       | function  | —                 | —       |

---

## Notes

- Wrap in `FormField` to attach a label, hint, and error message.
- Related stories: `04-radio`, `06-form-composition/01-form-field`.
