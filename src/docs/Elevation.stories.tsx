import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Foundations/Elevation',
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Role-named elevation aliases (theme.css @theme) — what components should use.
const ELEVATION: { cssVar: string; role: string; size: string; usage: string }[] = [
  {
    cssVar: '--shadow-elevation-flat',
    role: 'flat',
    size: 'none',
    usage: 'Resting / in-flow — border carries separation',
  },
  {
    cssVar: '--shadow-elevation-raised',
    role: 'raised',
    size: 'sm',
    usage: 'Card, raised buttons',
  },
  {
    cssVar: '--shadow-elevation-popover',
    role: 'popover',
    size: 'md',
    usage: 'Panel, non-modal popovers',
  },
  { cssVar: '--shadow-elevation-overlay', role: 'overlay', size: 'xl', usage: 'Dropdown, menus' },
  { cssVar: '--shadow-elevation-modal', role: 'modal', size: 'xl', usage: 'Dialogs, modals' },
  { cssVar: '--shadow-elevation-sheet', role: 'sheet', size: '2xl', usage: 'SidePanel, drawers' },
];

// Underlying Tailwind-aligned size ramp (the primitives elevation aliases point at).
const SIZES = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner'];

function Swatch({ cssVar, sub }: { cssVar: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-24 w-full rounded-2xl border border-default bg-default"
        style={{ boxShadow: `var(${cssVar})` }}
      />
      <span className="flex flex-col items-center text-center">
        <code className="text-xs text-heading">{cssVar}</code>
        {sub ? <code className="text-xs text-muted">{sub}</code> : null}
      </span>
    </div>
  );
}

export const Elevation: Story = {
  render: () => (
    <div className="bg-default p-6 text-body">
      <h1 className="mb-1 text-2xl font-semibold text-heading">Elevation &amp; shadows</h1>
      <p className="mb-2 max-w-3xl text-sm text-muted">
        Following <em>Refactoring UI</em>: a fixed, escalating set of shadows, chosen by how high an
        element floats — not picked ad hoc. Components use the <strong>role-named elevation</strong>{' '}
        tokens below, which alias the underlying size ramp. Shadow geometry is mode-invariant; only
        the color is themed (<code>--color-shadow-*</code>), so shadows read stronger on dark
        surfaces — <strong>toggle the theme to compare</strong>.
      </p>

      <section className="mb-10 mt-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Elevation roles (use these)
        </h2>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
        >
          {ELEVATION.map((e) => (
            <div key={e.cssVar} className="flex flex-col gap-2">
              <Swatch cssVar={e.cssVar} sub={`${e.role} → ${e.size}`} />
              <p className="text-center text-xs text-muted">{e.usage}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Size ramp (primitives)
        </h2>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
        >
          {SIZES.map((s) => (
            <Swatch key={s} cssVar={`--shadow-${s}`} sub={s} />
          ))}
        </div>
      </section>
    </div>
  ),
};
