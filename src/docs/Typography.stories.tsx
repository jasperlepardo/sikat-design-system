import type { Meta, StoryObj } from '@storybook/react';
import { semanticTokens, type DesignToken } from '../tokens';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SIZE_ORDER = ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

// Tokens have path: ["semantic", "text", "heading"|"body", <size>, <prop>]
function buildRamp(group: 'body' | 'heading') {
  const bySize: Record<string, Record<string, DesignToken>> = {};
  for (const t of semanticTokens) {
    if (t.path[1] !== 'text' || t.path[2] !== group) continue;
    (bySize[t.path[3]] ??= {})[t.path[4]] = t;
  }
  return SIZE_ORDER.filter((s) => bySize[s]).map((s) => ({ size: s, props: bySize[s] }));
}

// Weight tokens: ["semantic", "text", <weight-name>] with type fontWeight
const weightTokens = semanticTokens.filter(
  (t) => t.path[1] === 'text' && t.path.length === 3 && t.type === 'fontWeight',
);

// One representative family token per group
const familyTokens = (['heading', 'body'] as const)
  .map((g) => semanticTokens.find((t) => t.name === `text-${g}-base-font-family`))
  .filter((t): t is DesignToken => t != null);

function RampSection({ group }: { group: 'body' | 'heading' }) {
  const label = group === 'heading' ? 'Heading — Urbanist' : 'Body — DM Sans';
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">{label}</h2>
      <div className="flex flex-col">
        {buildRamp(group)
          .slice()
          .reverse()
          .map(({ size, props }) => (
            <div key={size} className="flex items-baseline gap-4 border-b border-default py-3">
              <code className="w-12 flex-none text-xs text-muted">{size}</code>
              <span
                className="flex-1 truncate text-heading"
                style={{
                  fontFamily: `var(${props['font-family'].cssVar})`,
                  fontSize: `var(${props['font-size'].cssVar})`,
                  lineHeight: `var(${props['line-height'].cssVar})`,
                  letterSpacing: `var(${props['letter-spacing'].cssVar})`,
                }}
              >
                The quick brown fox jumps over the lazy dog
              </span>
              <code className="ml-auto flex-none text-xs text-muted">
                {props['font-size'].value} / {props['line-height'].value}
              </code>
            </div>
          ))}
      </div>
    </section>
  );
}

export const Typography: Story = {
  render: () => (
    <div className="bg-default p-6 text-body">
      <h1 className="mb-1 text-2xl font-semibold text-heading">Typography</h1>
      <p className="mb-8 text-sm text-muted">
        The type ramp bundles font-size, line-height, font-family and letter-spacing into two semantic
        groups — <code>heading</code> (Urbanist) and <code>body</code> (DM Sans) — across 14 sizes.
      </p>

      <RampSection group="heading" />
      <RampSection group="body" />

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Families</h2>
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {familyTokens.map((t) => (
            <div key={t.cssVar} className="rounded-md border border-default p-3">
              <code className="text-xs text-muted">{t.cssVar}</code>
              <p className="mt-2 text-lg text-heading" style={{ fontFamily: `var(${t.cssVar})` }}>
                Ag — The quick brown fox
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Weights</h2>
        <div className="flex flex-col gap-3">
          {weightTokens.map((t) => (
            <div key={t.cssVar} className="flex items-baseline gap-4">
              <code className="w-40 flex-none text-xs text-muted">{t.cssVar}</code>
              <span className="text-lg text-heading" style={{ fontWeight: t.value as string }}>
                The quick brown fox ({t.value})
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
