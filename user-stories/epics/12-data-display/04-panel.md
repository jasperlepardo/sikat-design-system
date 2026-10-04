# Panel

**Epic:** Data Display
**Component:** Panel

---

## Basic Rendering

### User Story
As a developer consuming Sikat,
I want to render a structured panel with a header, body, and footer,
so that I can create detail views, settings pages, or form containers with a consistent layout.

### Acceptance Criteria
- [ ] `Panel.Header` renders a title area at the top of the panel
- [ ] `Panel.Body` renders the main content area
- [ ] `Panel.Footer` renders action buttons at the bottom with equal-width layout
- [ ] `Panel.Sidebar` and `Panel.Main` divide the body into two columns
- [ ] `Panel.Summary` renders a decorative icon with a name and code label

### Controls
| Control (Panel) | Type | Options | Default |
|---------|------|---------|---------|
| horizontal | boolean | `true` \| `false` | `false` |
| children | ReactNode | — | — |

| Control (Panel.Body) | Type | Options | Default |
|---------|------|---------|---------|
| columns | boolean | `true` \| `false` | `false` |

| Control (Panel.Summary) | Type | Options | Default |
|---------|------|---------|---------|
| icon | string | Material Symbol name | — |
| iconVariant | string | DecorativeIcon variant | — |
| iconSize | number | — | — |
| name | ReactNode | — | — |
| code | ReactNode | — | — |

---

## Horizontal Layout

### User Story
As a developer consuming Sikat,
I want to switch the Panel to a horizontal layout,
so that the summary and content appear side by side on wide viewports.

### Acceptance Criteria
- [ ] `horizontal={true}` renders `Panel.Sidebar` and `Panel.Main` side by side
- [ ] `Panel.Footer` buttons in horizontal mode are equal-width
- [ ] `data-horizontal` is applied to the root Panel element

---

## Notes
- Sub-components: `Panel.Header`, `Panel.Body`, `Panel.Footer`, `Panel.Sidebar`, `Panel.Main`, `Panel.Summary`.
- Related stories: `03-display/04-decorative-icon`, `03-tabs`.
