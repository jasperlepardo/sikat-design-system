# Installation

**Epic:** Setup & DX

---

## Package Installation

### User Story
As a developer consuming Sikat,
I want to install the design system package in my project,
so that I can import components and start building.

### Acceptance Criteria
- [ ] Package is installable via `npm install` or `yarn add` from GitHub Packages
- [ ] Installing the package does not require manual token build steps
- [ ] Components are importable from the package root: `import { Button } from 'sikat-design-system'`
- [ ] TypeScript types are included and resolve correctly in the consumer project
- [ ] CSS is importable as a single stylesheet entry

### Controls
| Config | Description |
|--------|-------------|
| `package.json` | Dependency entry |

---

## GitHub Packages Configuration

### User Story
As a developer consuming Sikat,
I want to configure my project to authenticate with GitHub Packages,
so that `npm install` resolves the private package without errors.

### Acceptance Criteria
- [ ] `.npmrc` is configured with the correct GitHub Packages registry scope
- [ ] Auth token is set via an environment variable (not hard-coded)
- [ ] `npm install` succeeds in CI without manual steps
- [ ] Scoped package name resolves correctly (e.g. `@jasperlepardo/sikat-design-system`)

### Controls
| Config File | Key Setting |
|-------------|-------------|
| `.npmrc` | `@scope:registry=https://npm.pkg.github.com` |
| `.npmrc` | `//npm.pkg.github.com/:_authToken=${NPM_TOKEN}` |

---

## Notes
- Related stories: `02-storybook`.
