# Text

**Epic:** Display
**Component:** Text

---

## Variants

### User Story

As a developer consuming Sikat,
I want to render text using semantic typographic variants,
so that headings, body copy, and captions all follow the design system's type scale.

### Acceptance Criteria

- [ ] `variant="display"` renders the largest display text
- [ ] `variant="h1"` through `variant="h3"` render decreasing heading sizes
- [ ] `variant="body"` renders standard paragraph text (default)
- [ ] `variant="small"` renders smaller supporting text
- [ ] `variant="caption"` renders the smallest text for labels and metadata
- [ ] Each variant uses the correct `as` element by default (e.g. `h1` for `variant="h1"`)
- [ ] `as` prop overrides the rendered HTML element without changing the visual style

### Controls

| Control | Type        | Options                                                             | Default |
| ------- | ----------- | ------------------------------------------------------------------- | ------- |
| variant | string      | `display` \| `h1` \| `h2` \| `h3` \| `body` \| `small` \| `caption` | `body`  |
| weight  | string      | `regular` \| `medium` \| `semibold` \| `bold`                       | —       |
| as      | ElementType | —                                                                   | —       |

---

## Tones

### User Story

As a developer consuming Sikat,
I want to apply semantic color tones to text,
so that I can communicate status or emphasis without breaking the design system's color system.

### Acceptance Criteria

- [ ] `tone="default"` renders text in the default foreground color
- [ ] `tone="heading"` renders text in the heading foreground color
- [ ] `tone="muted"` renders text in a subdued color for secondary content
- [ ] `tone="primary"` renders text in the brand/primary color
- [ ] `tone="danger"` renders text in the error/danger color
- [ ] `tone="success"` renders text in the success color
- [ ] Tone colors update correctly in dark mode

### Controls

| Control | Type   | Options                                                                 | Default   |
| ------- | ------ | ----------------------------------------------------------------------- | --------- |
| tone    | string | `default` \| `heading` \| `muted` \| `primary` \| `danger` \| `success` | `default` |

---

## Notes

- Extends all native HTML element attributes.
- Related stories: `02-icon`, `03-display/05-badge`.
