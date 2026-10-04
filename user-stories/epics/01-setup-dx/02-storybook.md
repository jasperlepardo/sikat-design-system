# Storybook

**Epic:** Setup & DX

---

## Local Development

### User Story

As a developer contributing to Sikat,
I want to run Storybook locally,
so that I can develop and QA components in isolation before committing.

### Acceptance Criteria

- [ ] `npm run storybook` starts the Storybook dev server without errors
- [ ] All component stories are visible and interactive in the Storybook UI
- [ ] Token/CSS changes are hot-reloaded without a full restart
- [ ] Figma controls (`figmaControls`) are visible in the Storybook controls panel
- [ ] A11y addon reports no critical accessibility violations for default stories

### Controls

| Script                    | Description                             |
| ------------------------- | --------------------------------------- |
| `npm run storybook`       | Start Storybook in development mode     |
| `npm run build-storybook` | Build a static Storybook for deployment |

---

## Notes

- Related stories: `01-installation`.
