# Button

**Epic:** Actions
**Component:** Button

---

## Basic Rendering

### User Story

As a developer consuming Sikat,
I want to render a Button with a label and a default visual style,
so that I can add a standard call-to-action to my UI without configuring every prop.

### Acceptance Criteria

- [ ] Button renders with only `children` provided and no other props
- [ ] Default `intent` is `primary` and default `variant` is `solid`
- [ ] Button is a `<button type="button">` element by default
- [ ] Rendered output is visually consistent with the Storybook Playground story

### Controls

| Control      | Type      | Options                                                                            | Default   |
| ------------ | --------- | ---------------------------------------------------------------------------------- | --------- |
| children     | ReactNode | —                                                                                  | —         |
| intent       | string    | `default` \| `primary` \| `success` \| `warning` \| `danger` \| `white` \| `black` | `primary` |
| variant      | string    | `solid` \| `outline` \| `ghost` \| `link`                                          | `solid`   |
| size         | string    | `xl` \| `lg` \| `md` \| `sm` \| `xs` \| `2xs`                                      | `md`      |
| type         | string    | `button` \| `submit` \| `reset`                                                    | `button`  |
| disabled     | boolean   | `true` \| `false`                                                                  | `false`   |
| leadingIcon  | ReactNode | —                                                                                  | —         |
| trailingIcon | ReactNode | —                                                                                  | —         |

---

## Variants & Intents

### User Story

As a developer consuming Sikat,
I want to combine any `intent` with any `variant` on a Button,
so that I can communicate the right semantic meaning and visual weight in my UI.

### Acceptance Criteria

- [ ] All 7 `intent` values render distinct color schemes: `default`, `primary`, `success`, `warning`, `danger`, `white`, `black`
- [ ] All 4 `variant` values render distinct visual styles: `solid`, `outline`, `ghost`, `link`
- [ ] Every intent × variant combination (28 total) is visually distinguishable
- [ ] The Storybook Matrix story covers all 28 combinations
- [ ] Figma controls (`figmaControls`) reflect the same intent and variant axes

---

## Sizes

### User Story

As a developer consuming Sikat,
I want to set the size of a Button,
so that it fits the density and hierarchy of the layout I'm building.

### Acceptance Criteria

- [ ] All 6 size values render at distinct heights and font sizes: `xl`, `lg`, `md`, `sm`, `xs`, `2xs`
- [ ] Padding and icon sizes scale proportionally with each size value
- [ ] The Storybook Sizes story covers all 6 size values side-by-side

---

## States

### User Story

As a developer consuming Sikat,
I want the Button to visually reflect its interactive states,
so that users receive clear feedback when an action is unavailable or being interacted with.

### Acceptance Criteria

- [ ] Disabled button (`disabled={true}`) renders with reduced opacity and blocks pointer events
- [ ] Hover state applies a distinct visual change via CSS
- [ ] Focus-visible state displays a visible focus ring for keyboard navigation
- [ ] Disabled state is consistent across all intent × variant combinations
- [ ] `disabled` prop sets the native `disabled` attribute on the `<button>` element

---

## Icon Slots

### User Story

As a developer consuming Sikat,
I want to add icons before or after the button label,
so that I can visually reinforce the button's action or status.

### Acceptance Criteria

- [ ] `leadingIcon` renders an icon to the left of the button label
- [ ] `trailingIcon` renders an icon to the right of the button label
- [ ] Both `leadingIcon` and `trailingIcon` can be used simultaneously
- [ ] Icon size scales proportionally with the `size` prop
- [ ] Icon-only button (no children) renders correctly when paired with `leadingIcon`
- [ ] The Storybook WithIcon story covers leading, trailing, and icon-only variants

---

## Toggle Group

### User Story

As a developer consuming Sikat,
I want to compose a group of toggle buttons where only one can be active at a time,
so that I can build segmented controls or mutually exclusive option selectors.

### Acceptance Criteria

- [ ] `Button.ToggleGroup` renders multiple `Button.Toggle` children in a single row
- [ ] Only one `Button.Toggle` is active at a time (single-select behavior)
- [ ] The active toggle is visually distinct from inactive toggles
- [ ] `Button.ToggleGroup` is keyboard navigable (arrow keys cycle through options)

### Controls (ToggleGroup)

| Control     | Type      | Options                   | Default      |
| ----------- | --------- | ------------------------- | ------------ |
| orientation | string    | `horizontal` \| `stacked` | `horizontal` |
| children    | ReactNode | —                         | —            |

---

## Theming

### User Story

As a developer consuming Sikat,
I want the Button to automatically adapt its colors to the active theme,
so that it looks correct in both light and dark mode without any extra configuration.

### Acceptance Criteria

- [ ] All intent × variant combinations update their colors when `data-theme="dark"` is applied to an ancestor
- [ ] Token-driven CSS variables resolve correctly per theme
- [ ] No hard-coded color values appear on the button element
- [ ] Theme switching at runtime updates the button without a page reload

---

## Accessibility

### User Story

As a developer consuming Sikat,
I want the Button to meet keyboard navigation and ARIA standards,
so that users relying on assistive technology can interact with it.

### Acceptance Criteria

- [ ] Button is focusable via Tab key
- [ ] Button activates with both Enter and Space keys
- [ ] Disabled button is not reachable via Tab
- [ ] Focus ring is visible when focused via keyboard (`:focus-visible` style applied)
- [ ] `type="button"` is set by default to prevent accidental form submission
- [ ] When the button contains only an icon, `aria-label` describes the action

---

## Notes

- Sub-components: `Button.ToggleGroup`, `Button.Toggle`.
- `solid` = filled background; `outline` = border only; `ghost` = no border/background; `link` = text-only.
- `white` and `black` intents are designed for use on dark/colored backgrounds.
- Related stories: `02-icon-button`, `03-button-group`, `04-link`.
