import type { Meta, StoryObj } from '@storybook/react';
import { Text, textVariants } from './Text';
import { semanticTokens, type DesignToken } from '../../tokens';

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'The quick brown fox', variant: 'body' },
  argTypes: { variant: { control: 'select', options: textVariants } },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// ─── helpers ─────────────────────────────────────────────────────────────────

const SIZE_ORDER = [
  '2xs', 'xs', 'sm', 'base', 'lg', 'xl',
  '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl',
];

function buildRamp(group: 'body' | 'heading') {
  const bySize: Record<string, Record<string, DesignToken>> = {};
  for (const t of semanticTokens) {
    if (t.path[1] !== 'text' || t.path[2] !== group) continue;
    (bySize[t.path[3]] ??= {})[t.path[4]] = t;
  }
  return SIZE_ORDER.filter((s) => bySize[s]).map((s) => ({ size: s, props: bySize[s] }));
}

function RampSection({ group }: { group: 'body' | 'heading' }) {
  const label = group === 'heading' ? 'Heading — Urbanist' : 'Body — DM Sans';
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{label}</h2>
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

// ─── stories ─────────────────────────────────────────────────────────────────

export const Scale: Story = {
  render: () => (
    <div className="bg-default p-6">
      <RampSection group="heading" />
      <RampSection group="body" />
    </div>
  ),
};
