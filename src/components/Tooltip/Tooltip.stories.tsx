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
    const trigger = canvas.getByRole('button', { name: 'More information' });

    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(canvas.getByRole('tooltip')).toHaveTextContent('Message');
    await expect(trigger).toHaveAccessibleDescription('Message');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);

    await userEvent.hover(trigger);
    await expect(canvas.getByRole('tooltip')).toBeVisible();
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
