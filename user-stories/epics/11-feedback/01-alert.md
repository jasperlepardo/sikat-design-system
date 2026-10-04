# Alert

**Epic:** Feedback
**Component:** Alert

---

## Variants & Intents

### User Story
As a developer consuming Sikat,
I want to render a contextual alert message with different intents and visual styles,
so that I can communicate success, warnings, errors, and informational messages consistently.

### Acceptance Criteria
- [ ] All 5 `intent` values render distinct alert colors: `default`, `primary`, `success`, `warning`, `danger`
- [ ] All 3 `variant` values render distinct visual styles: `solid`, `outline`, `transparent`
- [ ] Alert renders with `role="alert"` for assistive technology
- [ ] `title` renders a bold heading above the alert body
- [ ] `icon` slot renders an icon to the left of the content

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| intent | string | `default` \| `primary` \| `success` \| `warning` \| `danger` | `default` |
| variant | string | `solid` \| `outline` \| `transparent` | `solid` |
| title | ReactNode | — | — |
| icon | ReactNode | — | — |
| children | ReactNode | — | — |

---

## Layout

### User Story
As a developer consuming Sikat,
I want to switch the Alert between vertical and horizontal layouts,
so that I can fit inline alerts within tight layouts like form fields or banners.

### Acceptance Criteria
- [ ] Default layout stacks icon, title, and body vertically
- [ ] `horizontal={true}` renders icon and content side-by-side in a single row
- [ ] `data-horizontal` is applied to the root element for CSS targeting

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| horizontal | boolean | `true` \| `false` | `false` |

---

## Actions & Dismiss

### User Story
As a developer consuming Sikat,
I want to add action buttons and a dismiss button to an Alert,
so that users can take remedial action or close the alert.

### Acceptance Criteria
- [ ] `actions` slot renders one or more action buttons inside the alert
- [ ] `onClose` prop renders a dismiss button; clicking it fires `onClose`
- [ ] `closeLabel` provides an accessible label for the dismiss button
- [ ] `Alert.Action` sub-component provides styled action links/buttons within the alert

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| actions | ReactNode | — | — |
| onClose | function | — | — |
| closeLabel | string | — | — |

---

## Notes
- Sub-components: `Alert.Root`, `Alert.Icon`, `Alert.Content`, `Alert.Text`, `Alert.Title`, `Alert.Body`, `Alert.Actions`, `Alert.Action`, `Alert.Close` for custom compositions.
- Related stories: `02-tooltip`.
