# Navbar

**Epic:** Navigation
**Component:** Navbar

---

## App Type

### User Story
As a developer consuming Sikat,
I want to render an app-level top navigation bar,
so that users can access the app name, logo, search, and user account menu.

### Acceptance Criteria
- [ ] `type="app"` renders the standard app navbar with logo, app name, and account area
- [ ] `appName` renders the current application name
- [ ] `logo` slot renders a custom logo beside the app name
- [ ] `avatar` slot renders the user avatar in the top-right account area
- [ ] Navbar is always dark-themed regardless of the page theme

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| type | string | `app` \| `control-plane` | `app` |
| appName | ReactNode | — | `'[App Name]'` |
| logo | ReactNode | — | — |
| avatar | ReactNode | — | — |
| searchPlaceholder | string | — | `'Search'` |
| onSearchChange | function | — | — |
| onCreateClick | function | — | — |
| onNotificationsClick | function | — | — |
| onSettingsClick | function | — | — |
| accountItems | array | `NavbarMenuItem[]` | — |
| aria-label | string | — | `'Main'` |

---

## Control Plane Type

### User Story
As a developer consuming Sikat,
I want to render a control-plane navbar for admin or multi-org views,
so that users can switch between organizations and applications.

### Acceptance Criteria
- [ ] `type="control-plane"` renders the control-plane variant of the navbar
- [ ] `organization` slot renders the active organization name/logo
- [ ] `organizations` list renders a dropdown of switchable organizations
- [ ] `onOrganizationChange` fires when the user selects a different organization
- [ ] `apps` list renders a switcher for available applications
- [ ] `onAppChange` fires when the user selects a different app

### Controls
| Control | Type | Options | Default |
|---------|------|---------|---------|
| organization | ReactNode | — | — |
| onOrganizationClick | function | — | — |
| organizations | array | `NavbarMenuItem[]` | — |
| organizationId | string | — | — |
| onOrganizationChange | function | — | — |
| apps | array | `{ id, label, text, disabled, onSelect }[]` | — |
| appId | string | — | — |
| onAppChange | function | — | — |
| onAppsClick | function | — | — |

---

## Interactions

### User Story
As a developer consuming Sikat,
I want the Navbar's interactive areas to fire callbacks,
so that I can wire up navigation and action handling in my application.

### Acceptance Criteria
- [ ] `onSearchChange` fires with the current query string as the user types
- [ ] `onCreateClick` fires when the create action is triggered
- [ ] `onNotificationsClick` fires when the notifications icon is clicked
- [ ] `onSettingsClick` fires when the settings icon is clicked
- [ ] `accountItems` renders a dropdown menu under the user avatar with custom action items

---

## Notes
- Navbar renders with `data-theme="dark"` by default.
- Related stories: `02-side-nav`, `03-side-panel`, `04-footer`.
