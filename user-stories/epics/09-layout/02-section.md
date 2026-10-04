# Section

**Epic:** Layout
**Component:** Section

---

## Padding

### User Story
As a developer consuming Sikat,
I want to control the vertical padding of a page section,
so that different areas of the page can have appropriate breathing room.

### Acceptance Criteria
- [ ] `paddingY="none"` renders no vertical padding
- [ ] `paddingY="sm"` / `md` / `lg` / `xl` render increasing vertical padding values
- [ ] `Section.Container` constrains content to the page max-width and centers it
- [ ] `data-paddingY` is applied to the root element for CSS targeting

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| paddingY | string | `none` \| `sm` \| `md` \| `lg` \| `xl` | `md` |
| children | ReactNode | — | — |

---

## Notes
- Sub-component: `Section.Container` wraps content inside a Section to apply max-width constraints.
- Related stories: `01-page`, `03-row-column`.
