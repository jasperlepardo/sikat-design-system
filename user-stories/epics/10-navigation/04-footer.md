# Footer

**Epic:** Navigation
**Component:** Footer

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a page footer at the bottom of the layout,
so that the page has a consistent bottom area for copyright, links, or additional info.

### Acceptance Criteria

- [ ] Footer renders a `<footer>` element at the bottom of the page
- [ ] `Footer.Container` constrains the footer content to the page max-width
- [ ] Footer adapts its background to the active theme

### Controls

| Control  | Type      | Options | Default |
| -------- | --------- | ------- | ------- |
| children | ReactNode | —       | —       |

---

## Notes

- Sub-component: `Footer.Container` for max-width content constraint.
- Related stories: `09-layout/01-page`, `01-navbar`.
