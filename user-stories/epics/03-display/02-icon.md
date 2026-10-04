# Icon

**Epic:** Display
**Component:** Icon

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a Material Symbol icon by name,
so that I can use consistent iconography throughout the UI.

### Acceptance Criteria

- [ ] `children` accepts a Material Symbol name string (e.g. `'home'`)
- [ ] Icon renders at the default size of 24px
- [ ] Icon color inherits from the surrounding text color
- [ ] `label` prop is used as `aria-label` when the icon is meaningful (not decorative)
- [ ] Without `label`, the icon is treated as decorative and hidden from screen readers

### Controls

| Control  | Type   | Options                                                     | Default      |
| -------- | ------ | ----------------------------------------------------------- | ------------ |
| children | string | Material Symbol name                                        | — (required) |
| size     | number | —                                                           | `24`         |
| fill     | number | `0` \| `1`                                                  | `0`          |
| weight   | number | `100` \| `200` \| `300` \| `400` \| `500` \| `600` \| `700` | `400`        |
| label    | string | —                                                           | —            |

---

## Variations

### User Story

As a developer consuming Sikat,
I want to adjust an icon's size, fill, and weight,
so that I can match the icon's visual style to its context.

### Acceptance Criteria

- [ ] `size` prop scales the icon uniformly (numeric pixel value)
- [ ] `fill={1}` renders the filled/solid version of the icon; `fill={0}` renders the outlined version
- [ ] `weight` prop adjusts the stroke weight of the icon (100–700)
- [ ] Variations are applied via CSS `font-variation-settings`

---

## Notes

- Icon uses the Material Symbols variable font — variations are a CSS font feature, not image swaps.
- Related stories: `04-decorative-icon`, `04-actions/01-button`.
