# OTP

**Epic:** Form Fields
**Component:** OTP

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a one-time password input,
so that users can enter a numeric or alphanumeric verification code.

### Acceptance Criteria

- [ ] OTP renders a row of individual single-character input boxes
- [ ] Focus automatically moves to the next box after a character is entered
- [ ] Backspace moves focus to the previous box and clears it
- [ ] Paste of the full code fills all boxes at once
- [ ] Works as both controlled and uncontrolled
- [ ] `disabled` and `invalid` states are supported

### Controls

| Control  | Type    | Options           | Default |
| -------- | ------- | ----------------- | ------- |
| disabled | boolean | `true` \| `false` | `false` |
| invalid  | boolean | `true` \| `false` | `false` |

---

## Notes

- Wrap in `FormField` to attach a label and error message.
- Related stories: `06-form-composition/01-form-field`.
