# Table

**Epic:** Data Display
**Component:** Table

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a data table from columns and rows,
so that I can display structured tabular data with headers and cells.

### Acceptance Criteria

- [ ] `columns` defines the column headers and cell renderers
- [ ] `rows` provides the row data
- [ ] `getRowId` returns a unique id for each row (required)
- [ ] `caption` provides an accessible table caption for screen readers
- [ ] Table renders with correct `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` semantics

### Controls

| Control  | Type     | Options                                             | Default |
| -------- | -------- | --------------------------------------------------- | ------- |
| columns  | array    | `{ key, header, cell, sortable?, srOnlyHeader? }[]` | —       |
| rows     | array    | —                                                   | —       |
| getRowId | function | —                                                   | —       |
| caption  | string   | —                                                   | —       |

---

## Row Selection

### User Story

As a developer consuming Sikat,
I want users to be able to select one or more table rows,
so that I can build bulk action flows.

### Acceptance Criteria

- [ ] `selectable={true}` renders a checkbox in the first column of each row
- [ ] A header checkbox selects/deselects all visible rows
- [ ] `selectedIds` controls which rows are selected (controlled)
- [ ] `onSelectionChange` fires with the updated array of selected row ids
- [ ] `data-selected` is applied to selected row elements

### Controls

| Control           | Type     | Options           | Default |
| ----------------- | -------- | ----------------- | ------- |
| selectable        | boolean  | `true` \| `false` | `false` |
| selectedIds       | array    | —                 | —       |
| onSelectionChange | function | —                 | —       |

---

## Sorting

### User Story

As a developer consuming Sikat,
I want users to be able to sort the table by clicking column headers,
so that they can order data to find what they need quickly.

### Acceptance Criteria

- [ ] Columns with `sortable: true` render a sort indicator in the header
- [ ] Clicking a sortable header fires `onSortChange` with `{ key, direction }`
- [ ] `sort` prop controls the current sort state (controlled)
- [ ] `aria-sort` is applied to the active sort column header
- [ ] Direction cycles: none → ascending → descending → none

### Controls

| Control            | Type              | Options                                       | Default |
| ------------------ | ----------------- | --------------------------------------------- | ------- |
| sort               | TableSort \| null | `{ key: string, direction: 'asc' \| 'desc' }` | —       |
| onSortChange       | function          | —                                             | —       |
| columns[].sortable | boolean           | `true` \| `false`                             | `false` |

---

## Pagination

### User Story

As a developer consuming Sikat,
I want to add pagination controls to a Table,
so that users can navigate through large datasets a page at a time.

### Acceptance Criteria

- [ ] `pagination` prop renders previous/next page controls below the table
- [ ] Page info (e.g. `1–20 of 100`) is displayed
- [ ] Previous button is disabled on the first page
- [ ] Next button is disabled on the last page
- [ ] `pagination.onPrevious` and `pagination.onNext` fire on page navigation

### Controls

| Control    | Type            | Options                                         | Default |
| ---------- | --------------- | ----------------------------------------------- | ------- |
| pagination | TablePagination | `{ page, pageSize, total, onPrevious, onNext }` | —       |

---

## Notes

- Related stories: `01-list`, `03-tabs`.
