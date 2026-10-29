# Figma Badge — add Information & Automation intents (design-system owner task)

**Status:** deferred from the 2026-10-29 Badge sync. Code already has these intents
(`tokens/components/badge.json`); Figma does not. This is a **shared-architecture**
change, so it needs an owner to apply deliberately in Figma.

## Why this isn't a simple variant add

The Figma Badge (`Components` file `lFuOcYXanzzbYTJmsEEWR5`, set `177:6516`) is **not**
bound to semantic tokens directly. Colors are driven by **collection modes**:

- Each variant pins modes: `00 Intent` (= intent), `01 Style`, `03 Sizing`.
- Nodes bind to 4 variables in **`00 Intent`**: `Badge/background-color`,
  `Badge/border-color`, `Badge/icon-color`, `Badge/text-color`.
- In each intent **mode**, those alias to `Badge/<Intent>/<role>` (e.g.
  `Badge/Danger/background-color`), which ultimately resolve to semantic tokens.

**`00 Intent` is shared across Alert, Button, Icon, and Badge.** Its modes today are
`Default, Primary, Success, Warning, Danger, Light, Dark` — there is **no Information
or Automation mode**. Adding them touches every component that reads `00 Intent`.

## Steps

1. **Decide scope.** Adding `Information`/`Automation` modes to `00 Intent` makes them
   available to **all** components on that collection (Alert/Button/Icon). If they
   should be Badge-only, a separate approach (Badge-local intent variables) is needed
   instead — discuss before proceeding.
2. **Add two modes** to the `00 Intent` collection: `Information`, `Automation`.
3. **Create per-intent variable branches** `Badge/Information/*` and
   `Badge/Automation/*` (`background-color`, `border-color`, `icon-color`,
   `text-color`) with a value **per `01 Style` mode** (Solid/Outline/Ghost/Link),
   bound to the semantic tokens in the table below. (Mirror how `Badge/Danger/*` is
   built.)
4. **Wire `00 Intent`**: in the new `Information`/`Automation` modes, set
   `Badge/background-color` → alias `Badge/Information/background-color`, etc.
5. **Add variants** to set `177:6516`: for `Intent = Information` and
   `Intent = Automation`, add `Style(4) × Size(2) = 8` variants each (16 total).
   Easiest: duplicate the `Danger` variants, set the `Intent` variant property, and
   re-pin the `00 Intent` mode to the new mode. Target total: 56 → **72 variants**.
6. **Verify** parity with code: `Intent 9 × Style 4 (incl. Link) × Size 2`.

## Color mapping (must match `tokens/components/badge.json`)

Semantic tokens live in the Tokens library (`dhDHo6ZpJnAOpB3WUZoZFg`).

| Intent · Style | background | text | icon | border |
|---|---|---|---|---|
| Information · Solid | `color/bg/information` | `color/text/heading_on-primary` | `color/fg/white` | transparent |
| Information · Outline | `color/bg/information-subtle` | `color/text/heading` | `color/fg/information` | `color/border/information-subtle` |
| Information · Ghost | `color/bg/information-subtle` | `color/text/heading` | `color/fg/information` | transparent |
| Information · Link | transparent | `color/text/information` | `color/fg/information` | transparent |
| Automation · Solid | `color/bg/automation` | `color/text/heading_on-primary` | `color/fg/white` | transparent |
| Automation · Outline | `color/bg/automation-subtle` | `color/text/heading` | `color/fg/automation` | `color/border/automation-subtle` |
| Automation · Ghost | `color/bg/automation-subtle` | `color/text/heading` | `color/fg/automation` | transparent |
| Automation · Link | transparent | `color/text/automation` | `color/fg/automation` | transparent |

## Already done in this sync (for reference)

- Removed the `isDismissable` property + its 140 nested dismiss instances.
- Deleted the `Extra Small / Large / Extra Large` size variants (kept `Small`,
  `Medium`); 140 → 56 variants; re-gridded.
- Code: Badge is `9 intents × 4 styles (incl. link) × 2 sizes`, no dismiss.
