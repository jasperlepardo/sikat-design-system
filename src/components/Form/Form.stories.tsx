import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Form } from './Form';
import { TextField, Select, FormField } from '../Field/Field';
import { Divider } from '../Divider/Divider';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { Button } from '../Button/Button';

const meta = {
  title: 'Layout/Form',
  component: Form,
  tags: ['autodocs'],
  args: { onSubmit: fn() },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  render: (args) => (
    <Form
      style={{ maxWidth: 480 }}
      onSubmit={(e) => {
        e.preventDefault();
        args.onSubmit?.(e);
      }}
    >
      <Form.Section>
        <Form.Header heading="Your details" subHeading="How we'll reach you" />
        <Form.Group>
          <FormField label="Full name">{(p) => <TextField {...p} />}</FormField>
          <FormField label="Email">{(p) => <TextField type="email" {...p} />}</FormField>
        </Form.Group>
      </Form.Section>
      <Divider />
      <Form.Section>
        <Form.Header heading="Preferences" />
        <Form.Group>
          <FormField label="Country">
            {(p) => (
              <Select {...p}>
                <option>Philippines</option>
                <option>Singapore</option>
              </Select>
            )}
          </FormField>
        </Form.Group>
      </Form.Section>
      <ButtonGroup>
        <Button intent="default" variant="ghost">
          Cancel
        </Button>
        <Button intent="primary" type="submit">
          Save
        </Button>
      </ButtonGroup>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Full name'), 'Ada Lovelace');
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@example.com');
    await userEvent.selectOptions(canvas.getByLabelText('Country'), 'Singapore');

    // Cancel is type="button" and must not submit.
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onSubmit).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(args.onSubmit).toHaveBeenCalledOnce();
  },
};
