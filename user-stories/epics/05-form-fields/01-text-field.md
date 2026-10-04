# TextField

**Epic:** Form Fields
**Component:** TextField

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to render a text input field,
so that users can enter free-form text in a form.

### Acceptance Criteria
- [ ] TextField renders an `<input>` element with Sikat's visual style
- [ ] `placeholder` text displays when the field is empty
- [ ] `data-filled` attribute is applied when the field has a value
- [ ] Works as both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`)
- [ ] Renders correctly inside a `FormField` wrapper

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| value | string \| number | — | — |
| defaultValue | string \| number | — | — |
| placeholder | string | — | — |
| size | string | `md` \| `xl` | `md` |
| disabled | boolean | `true` \| `false` | `false` |
| readOnly | boolean | `true` \| `false` | `false` |
| invalid | boolean | `true` \| `false` | `false` |
| onChange | function | — | — |
| leadingIcon | ReactNode | — | — |
| trailingIcon | ReactNode | — | — |
| prefix | ReactNode | — | — |
| suffix | ReactNode | — | — |

---

## States

### User Story
As a developer consuming Sikat,
I want the TextField to reflect disabled, readOnly, and invalid states,
so that users understand when input is blocked or has an error.

### Acceptance Criteria
- [ ] `disabled={true}` renders the field with reduced opacity and no pointer events
- [ ] `readOnly={true}` renders the field with a non-editable style; a pencil icon appears on hover
- [ ] `invalid={true}` renders the field with an error border color
- [ ] `invalid` pairs with a `FormField` `error` prop to show the error message below the field
- [ ] `data-filled` is applied when the field contains a value, regardless of state
- [ ] Number inputs show `data-state="bad-input"` when the value is invalid for the type

---

## Affixes & Icon Slots

### User Story
As a developer consuming Sikat,
I want to attach icons, prefixes, and suffixes to a TextField,
so that I can provide unit labels, leading icons, or trailing actions inside the input.

### Acceptance Criteria
- [ ] `leadingIcon` renders an icon inside the left edge of the input
- [ ] `trailingIcon` renders an icon inside the right edge of the input
- [ ] `prefix` renders a text label (e.g. `https://`) at the left inside the input border
- [ ] `suffix` renders a text label (e.g. `.com`) at the right inside the input border
- [ ] Input text area resizes to accommodate prefix/suffix content
- [ ] Affixes do not interfere with focus or disabled/readOnly states

---

## Notes
- Extends all native `<input>` HTML attributes.
- `invalid` controls the visual state only; pair with `FormField`'s `error` prop for the error message.
- Related stories: `06-form-composition/01-form-field`, `02-textarea`.
