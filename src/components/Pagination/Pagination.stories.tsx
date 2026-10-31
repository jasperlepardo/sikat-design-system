import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    page: 1,
    pageSize: 10,
    total: 100,
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled: wires `page`/`pageSize` state so the controls actually move. */
export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page);
    const [pageSize, setPageSize] = useState(args.pageSize);
    return (
      <Pagination
        {...args}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange(p);
        }}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
          args.onPageSizeChange?.(s);
        }}
      />
    );
  },
};

/** First page — the previous button is disabled. */
export const FirstPage: Story = {
  args: { page: 1, pageSize: 10, total: 100 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(2);
  },
};

/** Last page — the next button is disabled. */
export const LastPage: Story = {
  args: { page: 10, pageSize: 10, total: 100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled();
  },
};

/** A single page — both navigation buttons are disabled. */
export const SinglePage: Story = {
  args: { page: 1, pageSize: 25, total: 8 },
};

/** Without `onPageSizeChange`, the rows-per-page value is static text. */
export const FixedPageSize: Story = {
  args: { page: 1, pageSize: 10, total: 100, onPageSizeChange: undefined },
};
