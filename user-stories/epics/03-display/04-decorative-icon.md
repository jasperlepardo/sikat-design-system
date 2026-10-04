# DecorativeIcon

**Epic:** Display
**Component:** DecorativeIcon

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to render a large decorative icon with a background treatment,
so that I can create visually impactful empty states, feature spotlights, or section headers.

### Acceptance Criteria
- [ ] `icon` prop (Material Symbol name) renders the icon centered inside a background shape
- [ ] `variant="solid"` renders a filled background; `variant="subtle"` a tinted background; `variant="outline"` a bordered background
- [ ] `size` prop controls the overall size of the decorative icon container
- [ ] Custom `children` can override the default icon rendering
- [ ] `--decorative-icon-size` CSS variable is set from the `size` prop

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| icon | string | Material Symbol name | — |
| variant | string | `solid` \| `subtle` \| `outline` | `solid` |
| size | number | — | `80` |
| children | ReactNode | — | — |

---

## Notes
- Related stories: `02-icon`, `12-data-display/04-panel`.
