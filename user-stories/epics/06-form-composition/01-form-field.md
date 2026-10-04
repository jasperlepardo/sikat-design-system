# FormField

**Epic:** Form Composition
**Component:** FormField

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to wrap a form input in a FormField to attach a label, hint, and error message,
so that every field in my form has consistent labeling and accessible semantics.

### Acceptance Criteria
- [ ] `label` renders above (or beside) the input
- [ ] `hint` renders below the input in a muted style
- [ ] The input receives the `id` that FormField generates or passes
- [ ] `aria-describedby` is automatically linked to hint/error elements
- [ ] `required={true}` renders a visual required indicator on the label

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| label | ReactNode | — | — |
| subLabel | ReactNode | — | — |
| hint | ReactNode | — | — |
| error | ReactNode | — | — |
| tooltip | ReactNode | — | — |
| required | boolean | `true` \| `false` | `false` |
| disabled | boolean | `true` \| `false` | `false` |
| orientation | string | `horizontal` \| `vertical` \| `responsive` | `horizontal` |
| children | ReactNode \| function | — | — |

---

## Orientations

### User Story
As a developer consuming Sikat,
I want to control whether the label appears above or beside the input,
so that I can match the form layout to the page design.

### Acceptance Criteria
- [ ] `orientation="vertical"` stacks label above input
- [ ] `orientation="horizontal"` places label to the left of input (default)
- [ ] `orientation="responsive"` is horizontal on wide viewports, vertical on narrow
- [ ] Label column width is consistent across fields in the same form
- [ ] `data-orientation` is set on the root element for CSS targeting

---

## Validation

### User Story
As a developer consuming Sikat,
I want to display an error message on a form field when validation fails,
so that users know exactly which field is invalid and why.

### Acceptance Criteria
- [ ] `error` prop renders an error message below the field in a danger color
- [ ] When `error` is set, `aria-invalid="true"` is passed to the child input
- [ ] `hint` is hidden when `error` is present (error takes priority)
- [ ] Error message is linked to the input via `aria-describedby`
- [ ] Clearing `error` (setting to `undefined`) reverts to showing `hint`

---

## Notes
- Pass `children` as a render prop `(field) => <Input {...field} />` to get the generated `id`, `aria-describedby`, and `aria-invalid` wired automatically.
- `invalid` on the input controls the visual border; `error` on FormField controls the message text.
- Related stories: `02-form`, `05-form-fields/01-text-field`.
