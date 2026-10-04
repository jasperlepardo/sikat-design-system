# Token Pipeline

**Epic:** Theming & Tokens

---

## Four-Tier Token Architecture

### User Story
As a developer consuming Sikat,
I want to understand the four-tier token pipeline,
so that I know which token layer to override when customizing the design system.

### Acceptance Criteria
- [ ] Raw tokens (Step 1) define the base color palette (e.g. `sikat-orange-50` through `sikat-orange-900`)
- [ ] Primitive tokens (Step 2) map raw values to named primitives
- [ ] Semantic tokens (Step 3) map primitives to intent-based CSS variables (e.g. `--color-primary`, `--color-danger`)
- [ ] Component tokens (Step 4) map semantic tokens to component-specific variables (e.g. `--btn-bg`)
- [ ] All tokens compile to CSS custom properties accessible at runtime

### Controls
| Token Layer | File | Purpose |
|-------------|------|---------|
| Raw | `src/tokens/base.tokens.ts` | Color palette steps |
| Semantic | `src/tokens/semantic.tokens.ts` | Theme-aware intent aliases |
| Component | `src/tokens/button.manifest.ts` etc. | Component-specific variables |

---

## Notes
- Code is the source of truth — Figma mirrors this pipeline, not the other way around.
- Related stories: `02-theming`, `13-cli-customization/01-cli`.
