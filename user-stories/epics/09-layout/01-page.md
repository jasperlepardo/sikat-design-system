# Page

**Epic:** Layout
**Component:** Page

---

## Structure

### User Story

As a developer consuming Sikat,
I want to wrap my entire page in a Page component,
so that my layout has a consistent baseline structure and background.

### Acceptance Criteria

- [ ] `Page` renders a full-width container that fills the viewport height
- [ ] Navbar, Sections, and Footer nest correctly inside Page
- [ ] Page applies the correct background color based on the active theme

### Controls

| Control  | Type      | Options | Default |
| -------- | --------- | ------- | ------- |
| children | ReactNode | —       | —       |

---

## Notes

- `Page` is a thin layout shell — all content is composed via Section, Row, Column, Navbar, Footer.
- Related stories: `02-section`, `03-row-column`, `10-navigation/01-navbar`.
