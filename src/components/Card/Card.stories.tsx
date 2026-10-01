import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Panel } from '../Panel/Panel';
import { PanelHeader } from '../Panel/PanelHeader';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { FormField, TextField } from '../Field/Field';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../Button/IconButton';

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

/** Card.Header with sticky=true pins the header while content scrolls in a column. */
export const StickyHeader: Story = {
  render: () => (
    <div
      style={{
        height: 320,
        overflowY: 'auto',
        padding: 'var(--spacing-3)',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--rounded-lg)',
      }}
    >
      <Card style={{ maxWidth: 600 }}>
        <Card.Header icon={ArtTrackIcon} sticky>
          Customer Details
        </Card.Header>
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
            <FormField label="Payment Terms">
              {(props) => <TextField {...props} placeholder="Net 30" />}
            </FormField>
            <FormField label="Tax ID">
              {(props) => <TextField {...props} placeholder="123-456-789" />}
            </FormField>
            <FormField label="Notes">
              {(props) => <TextField {...props} placeholder="Additional notes…" />}
            </FormField>
          </Form.Group>
        </Card.Content>
      </Card>
    </div>
  ),
};

/** Multiple cards with sticky headers inside a scrollable Panel.Body. */
export const InPanel: Story = {
  render: () => (
    <Panel style={{ width: 632, height: 600 }}>
      <PanelHeader
        icon="inventory_2"
        iconVariant="solid"
        title="Business Partner"
        subcopy="BP-0015"
      />
      <Panel.Body>
        <Card>
          <Card.Header icon={<Icon size={24}>art_track</Icon>} sticky>
            General Information
          </Card.Header>
          <Card.Content>
            <Form.Group className="grid grid-cols-2 gap-2">
              <FormField label="Name">
                {(props) => <TextField {...props} placeholder="Acme Corporation" />}
              </FormField>
              <FormField label="Code">
                {(props) => <TextField {...props} placeholder="BP-0015" />}
              </FormField>
              <FormField label="Tax ID">
                {(props) => <TextField {...props} placeholder="123-456-789" />}
              </FormField>
              <FormField label="Industry">
                {(props) => <TextField {...props} placeholder="Manufacturing" />}
              </FormField>
              <FormField label="Website">
                {(props) => <TextField {...props} placeholder="https://acme.com" />}
              </FormField>
              <FormField label="Notes">
                {(props) => <TextField {...props} placeholder="Additional notes…" />}
              </FormField>
            </Form.Group>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header icon={<Icon size={24}>person</Icon>} sticky>
            Contact Details
          </Card.Header>
          <Card.Content>
            <Form.Group className="grid grid-cols-2 gap-2">
              <FormField label="Contact Person">
                {(props) => <TextField {...props} placeholder="Agatha Harkness" />}
              </FormField>
              <FormField label="Email">
                {(props) => <TextField {...props} placeholder="agatha@acme.com" />}
              </FormField>
              <FormField label="Phone">
                {(props) => <TextField {...props} placeholder="+1 555 000 1234" />}
              </FormField>
              <FormField label="Department">
                {(props) => <TextField {...props} placeholder="Procurement" />}
              </FormField>
            </Form.Group>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header icon={<Icon size={24}>location_on</Icon>} sticky>
            Address
          </Card.Header>
          <Card.Content>
            <Form.Group className="grid grid-cols-2 gap-2">
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
              <FormField label="City">
                {(props) => <TextField {...props} placeholder="New York" />}
              </FormField>
              <FormField label="Country">
                {(props) => <TextField {...props} placeholder="United States" />}
              </FormField>
            </Form.Group>
          </Card.Content>
        </Card>
      </Panel.Body>
      <Panel.Footer>
        <Button intent="default" variant="solid" size="extra-large">
          Cancel
        </Button>
        <Button intent="primary" variant="solid" size="extra-large">
          Save
        </Button>
      </Panel.Footer>
    </Panel>
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
