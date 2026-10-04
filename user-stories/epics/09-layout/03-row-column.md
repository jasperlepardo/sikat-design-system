# Row & Column

**Epic:** Layout
**Component:** Row / Column

---

## Grid Layout

### User Story

As a developer consuming Sikat,
I want to compose content into rows and columns using a 12-column grid,
so that I can build responsive multi-column layouts.

### Acceptance Criteria

- [ ] `Row` renders a 12-column CSS grid container
- [ ] `Column` children inside `Row` occupy the correct number of grid columns
- [ ] Multiple `Column` elements in a `Row` share space proportionally
- [ ] Row and Column do not impose their own background or padding

### Controls

| Control (Row) | Type      | Options | Default |
| ------------- | --------- | ------- | ------- |
| children      | ReactNode | —       | —       |

---

## Column Variants

### User Story

As a developer consuming Sikat,
I want to use named Column variants for common layout patterns,
so that I don't have to manually specify grid spans for standard page structures.

### Acceptance Criteria

- [ ] `variant="centered"` renders a centered single-column content area
- [ ] `variant="centered-wide"` renders a wider centered content area
- [ ] `variant="side"` renders a narrow sidebar column
- [ ] `variant="main"` renders a main content column that fills remaining space
- [ ] Omitting `variant` renders a plain Column without preset width

### Controls

| Control (Column) | Type   | Options                                           | Default |
| ---------------- | ------ | ------------------------------------------------- | ------- |
| variant          | string | `centered` \| `centered-wide` \| `side` \| `main` | —       |

---

## Notes

- Column widths are controlled via `className` utility classes, not props.
- Related stories: `01-page`, `02-section`.
