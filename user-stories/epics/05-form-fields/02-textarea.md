# Textarea

**Epic:** Form Fields
**Component:** Textarea

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a multi-line text input,
so that users can enter longer-form content in a form.

### Acceptance Criteria

- [ ] Textarea renders a `<textarea>` element with Sikat's visual style
- [ ] `placeholder` text displays when the field is empty
- [ ] `data-filled` attribute is applied when the field has a value
- [ ] Works as both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`)
- [ ] Default `rows={1}` renders a single-line height that expands on input

### Controls

| Control      | Type     | Options           | Default |
| ------------ | -------- | ----------------- | ------- |
| value        | string   | —                 | —       |
| defaultValue | string   | —                 | —       |
| placeholder  | string   | —                 | —       |
| rows         | number   | —                 | `1`     |
| maxRows      | number   | —                 | —       |
| disabled     | boolean  | `true` \| `false` | `false` |
| invalid      | boolean  | `true` \| `false` | `false` |
| onChange     | function | —                 | —       |

---

## States

### User Story

As a developer consuming Sikat,
I want the Textarea to reflect disabled and invalid states,
so that users understand when input is blocked or has an error.

### Acceptance Criteria

- [ ] `disabled={true}` renders the field with reduced opacity and no pointer events
- [ ] `readOnly` renders a non-editable style; a pencil icon appears on hover
- [ ] `invalid={true}` renders an error border color
- [ ] `invalid` pairs with `FormField`'s `error` prop to show the error message

---

## Auto-Resize

### User Story

As a developer consuming Sikat,
I want the Textarea to automatically grow in height as the user types,
so that the full content is always visible without a scrollbar.

### Acceptance Criteria

- [ ] Textarea starts at `rows={1}` height and grows as content is added
- [ ] When `maxRows` is set, the textarea stops growing at that height and scrolls internally
- [ ] Shrinks back when content is deleted
- [ ] Auto-resize works correctly for both controlled and uncontrolled usage

---

## Notes

- Auto-resize is built into the component — no external library needed.
- Related stories: `01-text-field`, `06-form-composition/01-form-field`.
