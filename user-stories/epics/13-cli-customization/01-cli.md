# CLI & Customization

**Epic:** CLI & Customization
**Component:** `sikat` CLI

---

## Installation

### User Story

As a developer consuming Sikat,
I want to install and run the `sikat` CLI in my project,
so that I can customize the design system tokens without modifying the source.

### Acceptance Criteria

- [ ] `sikat` CLI is available as a dev dependency or global install
- [ ] Running `sikat init` scaffolds the necessary config files in the consumer project
- [ ] CLI version matches the installed `sikat-design-system` package version
- [ ] CLI runs without errors on Node.js LTS versions

### Controls

| CLI Command   | Description                         |
| ------------- | ----------------------------------- |
| `sikat init`  | Scaffolds CLI config in the project |
| `sikat build` | Compiles customized tokens          |

---

## Role Remapping

### User Story

As a developer consuming Sikat,
I want to remap semantic token roles using the CLI,
so that I can white-label the design system with my brand's color palette.

### Acceptance Criteria

- [ ] CLI config allows remapping a semantic role (e.g. `primary`) to a different raw color
- [ ] Remapped tokens compile to correct CSS variable values
- [ ] All components using the remapped role update their appearance after rebuild
- [ ] Remap config is version-controlled in the consumer project

### Controls

| Config Key | Description                                            |
| ---------- | ------------------------------------------------------ |
| `roles`    | Object mapping semantic role names to raw color values |

---

## Figma Mirroring

### User Story

As a developer consuming Sikat,
I want the CLI to sync token customizations back to Figma,
so that the Figma file always reflects the consumer's actual token overrides.

### Acceptance Criteria

- [ ] CLI reads the consumer's token overrides and pushes them to the Figma token library
- [ ] Figma variables are updated to match the compiled CSS variable values
- [ ] Sync runs without manual edits to the Figma file
- [ ] CLI reports success/failure for each token variable updated

### Controls

| CLI Command        | Description                                    |
| ------------------ | ---------------------------------------------- |
| `sikat sync-figma` | Pushes local token overrides to the Figma file |

---

## Notes

- Code is the source of truth — Figma mirrors code, not the reverse.
- Related stories: `02-theming-tokens/01-token-pipeline`.
