# Dropdown

**Epic:** Display
**Component:** Dropdown / DropdownItem

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to render a floating dropdown list anchored to a trigger element,
so that I can build context menus, option lists, and custom select UIs.

### Acceptance Criteria
- [ ] Dropdown renders when `anchor` is set to a positioned element reference
- [ ] Items appear in a floating list below (or above) the anchor based on `side`
- [ ] Dropdown dismisses when clicking outside it
- [ ] `role="listbox"` or `role="menu"` is applied based on the `role` prop

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| role | string | `listbox` \| `menu` | `listbox` |
| anchor | DropdownAnchor \| null | — | — |
| side | string | `top` \| `bottom` | `bottom` |
| hSide | string | `left` \| `right` | `left` |
| multiselectable | boolean | `true` \| `false` | `false` |
| children | ReactNode | — | — |

---

## Items

### User Story
As a developer consuming Sikat,
I want to render rich dropdown items with icons, labels, sub-labels, and descriptions,
so that users can distinguish between options at a glance.

### Acceptance Criteria
- [ ] `leadingIcon` / `trailingIcon` render icons inside the item
- [ ] `subLabel` renders a secondary line below the main label
- [ ] `subLabelPlacement="top"` positions the subLabel above the main label
- [ ] `description` renders a smaller line below the subLabel
- [ ] `selected={true}` renders the item with a checkmark or highlight
- [ ] `disabled={true}` renders a muted, non-interactive item
- [ ] `onSelect` fires when the item is clicked or activated via keyboard

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| id | string | — | — |
| leadingIcon | ReactNode | — | — |
| trailingIcon | ReactNode | — | — |
| prefix | ReactNode | — | — |
| suffix | ReactNode | — | — |
| subLabel | ReactNode | — | — |
| subLabelPlacement | string | `top` \| `inline` | `top` |
| description | ReactNode | — | — |
| selected | boolean | `true` \| `false` | `false` |
| active | boolean | `true` \| `false` | `false` |
| disabled | boolean | `true` \| `false` | `false` |
| onSelect | function | — | — |
| children | ReactNode | — | — |

---

## Notes
- Dropdown is used internally by Select, Combobox, MultiSelect, and Autocomplete.
- Related stories: `07-selection-fields/01-select`.
