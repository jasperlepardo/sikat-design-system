import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { FormField, TextField } from '../Field/Field';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const ArtTrackIcon = <Icon size={24}>art_track</Icon>;

const AvatarIcon = <Icon size={20}>person</Icon>;

const AddCircleIcon = <Icon size={20}>add_circle</Icon>;

const CircleIcon = <Icon size={20}>radio_button_unchecked</Icon>;

/** Figma node 18266:140530 — Customer Details section card. */
export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 600 }}>
      <Card.Header icon={ArtTrackIcon}>Customer Details</Card.Header>
      <Card.Content>
        <Form.Group className="grid grid-cols-2 gap-2">
          <FormField label="Customer">
            {(props) => <TextField {...props} placeholder="[Name of Customer]" />}
          </FormField>
          <FormField label="Contact Person">
            {(props) => (
              <TextField {...props} placeholder="Agatha Harkness" leadingIcon={AvatarIcon} />
            )}
          </FormField>

          <FormField label="Currency">
            {(props) => <TextField {...props} placeholder="United State Dollar (USD)" />}
          </FormField>
          <FormField label="Billing Address">
            <Button intent="primary" variant="link" leadingIcon={AddCircleIcon}>
              Add new address
            </Button>
          </FormField>

          <FormField label="Shipping Address">
            <Button intent="primary" variant="link" leadingIcon={AddCircleIcon}>
              Add new address
            </Button>
          </FormField>
        </Form.Group>
      </Card.Content>
    </Card>
  ),
};

/** Card with trailing actions in the header. */
export const WithHeaderActions: Story = {
  render: () => (
    <Card style={{ maxWidth: 600 }}>
      <Card.Header
        icon={ArtTrackIcon}
        actions={
          <IconButton label="More" intent="default" variant="ghost" size="small">
            {CircleIcon}
          </IconButton>
        }
      >
        Section Title
      </Card.Header>
      <Card.Content>
        <p style={{ color: 'var(--color-text-body)', minHeight: 80, width: '100%' }}>
          Content slot.
        </p>
      </Card.Content>
    </Card>
  ),
};
