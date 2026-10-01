import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tooltip, tooltipAligns, tooltipPositions } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    message: 'Message',
    position: 'top',
    align: 'start',
    label: 'More information',
    onOpenChange: fn(),
  },
  argTypes: {
    message: { control: 'text' },
    position: { control: 'inline-radio', options: tooltipPositions },
    align: { control: 'inline-radio', options: tooltipAligns },
    open: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // The bubble is portaled to <body>, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'More information' });

    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(body.getByRole('tooltip')).toHaveTextContent('Message');
    await expect(trigger).toHaveAccessibleDescription('Message');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);

    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);

    await userEvent.hover(trigger);
    await expect(body.getByRole('tooltip')).toBeVisible();
  },
};

/**
 * The bubble is portaled to `<body>` with `position: fixed`, so an
 * `overflow: hidden` ancestor (a Panel body, Card, scroll area) can't clip it.
 */
export const InsideOverflowHidden: Story = {
  args: { position: 'top', align: 'start' },
  render: (args) => (
    <div
      data-testid="clip"
      style={{
        overflow: 'hidden',
        width: 120,
        padding: 8,
        border: '1px dashed var(--color-border-default)',
        borderRadius: 8,
      }}
    >
      <Tooltip {...args} message="Not clipped by the overflow-hidden box." />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'More information' });
    await userEvent.hover(trigger);

    const bubble = body.getByRole('tooltip');
    await expect(bubble).toBeVisible();
    await expect(canvas.getByTestId('clip')).not.toContainElement(bubble);

    const clip = canvas.getByTestId('clip').getBoundingClientRect();
    const t = trigger.getBoundingClientRect();
    const rect = bubble.getBoundingClientRect();
    // Placed 8px above the trigger, overhanging its left edge by 8px…
    await expect(Math.round(t.top - rect.bottom)).toBe(8);
    await expect(Math.round(t.left - rect.left)).toBe(8);
    // …and full-size even though it spills past the clipping box's top and right.
    await expect(rect.width).toBe(202);
    await expect(rect.top).toBeLessThan(clip.top);
    await expect(rect.right).toBeGreaterThan(clip.right);
  },
};

/** Every Figma Position × Alignment, shown open. */
export const Placements: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 260px)',
          gap: '96px 120px',
          justifyContent: 'center',
          padding: '72px 240px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      {tooltipPositions.flatMap((position) =>
        tooltipAligns.map((align) => (
          <div
            key={`${position}-${align}`}
            style={{
              display: 'flex',
              justifyContent: align === 'start' ? 'flex-start' : 'flex-end',
            }}
          >
            <Tooltip {...args} position={position} align={align} open />
          </div>
        )),
      )}
    </>
  ),
};
