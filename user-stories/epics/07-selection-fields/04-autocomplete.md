# Autocomplete

**Epic:** Selection Fields
**Component:** Autocomplete

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to render a text input that suggests completions as the user types,
so that users can quickly find and enter valid values.

### Acceptance Criteria
- [ ] Autocomplete renders a text input that shows a suggestion dropdown as the user types
- [ ] Suggestions are filtered by the current input value (default client-side filter)
- [ ] Selecting a suggestion fills the input with the suggestion's value
- [ ] Works as both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)
- [ ] `placeholder` is shown when the input is empty

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| suggestions | array | `string[] \| { value, label, text?, subLabel?, description?, disabled? }[]` | — |
| value | string | — | — |
| defaultValue | string | — | `''` |
| onValueChange | function | — | — |
| onSelect | function | — | — |
| filter | boolean | `true` \| `false` | `true` |
| placeholder | string | — | — |
| size | string | `md` | `md` |
| disabled | boolean | `true` \| `false` | `false` |
| readOnly | boolean | `true` \| `false` | `false` |
| invalid | boolean | `true` \| `false` | `false` |

---

## Filter Behavior

### User Story
As a developer consuming Sikat,
I want to control whether the Autocomplete filters suggestions client-side or delegates to my own logic,
so that I can use it with server-side search APIs.

### Acceptance Criteria
- [ ] `filter={true}` (default) filters suggestions by matching the input value against `text` or `label`
- [ ] `filter={false}` passes all suggestions through unfiltered; the consumer is responsible for updating the list
- [ ] `onValueChange` fires as the user types in both filter modes
- [ ] `onSelect` fires only when the user picks a suggestion from the list

---

## Notes
- When `filter={false}`, update `suggestions` in response to `onValueChange` to implement async search.
- Related stories: `01-select`, `02-combobox`.
