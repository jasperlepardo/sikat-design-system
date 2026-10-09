import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { SidePanel } from './SidePanel';
import { Panel } from '../Panel/Panel';
import { PanelHeader } from '../Panel/PanelHeader';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Icon } from '../Icon/Icon';
import { Tabs } from '../Tabs/Tabs';
import { Card } from '../Card/Card';
import { Form } from '../Form/Form';
import { FormField, TextField } from '../Field/Field';

const meta = {
  title: 'Components/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SidePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------- helpers */

const emailTabs = [
  { value: 'items', label: 'Items', icon: <Icon size={20}>inventory_2</Icon> },
  { value: 'accounting', label: 'Accounting', icon: <Icon size={20}>account_box</Icon> },
  { value: 'logistics', label: 'Logistics', icon: <Icon size={20}>local_shipping</Icon> },
];

const entityTabs = [
  { value: 'general', label: 'General' },
  { value: 'payment-terms', label: 'Payment Terms' },
  { value: 'payment-run', label: 'Payment Run' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'properties', label: 'Properties' },
];

const SectionCard = ({ title }: { title: string }) => (
  <Card>
    <Card.Header
      icon={<Icon size={24}>art_track</Icon>}
      actions={
        <IconButton label="More options" intent="default" variant="ghost" size="small">
          <Icon size={20}>more_vert</Icon>
        </IconButton>
      }
    >
      {title}
    </Card.Header>
    <Card.Content>
      <Button intent="default" variant="ghost" leadingIcon={<Icon size={20}>add_circle</Icon>}>
        Add
      </Button>
    </Card.Content>
  </Card>
);

/* ---------------------------------------------------------------- stories */

/** Single-column — overlay drawer with tabs and scrollable body. */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ height: '100vh', background: 'var(--color-bg-tertiary)' }}>
        <div style={{ margin: 16 }}>
          <Button intent="primary" variant="solid" size="small" onClick={() => setOpen(true)}>
            Open Panel
          </Button>
        </div>
        {open && (
          <SidePanel
            overlay
            onOverlayClick={() => setOpen(false)}
            style={{ '--sikat-side-panel-width': '560px' } as React.CSSProperties}
          >
            <PanelHeader
              leading={
                <IconButton label="Back" intent="default" variant="outline" size="small">
                  <Icon size={20}>loyalty</Icon>
                </IconButton>
              }
              title="Send Email"
              actions={
                <>
                  <Button intent="default" variant="solid" size="small">
                    Discard
                  </Button>
                  <Button intent="primary" variant="solid" size="small">
                    Save
                  </Button>
                </>
              }
            />
            <Panel.Body>
              <Tabs items={emailTabs} variant="secondary" />
              <Card>
                <Card.Content>
                  <Form.Group>
                    <FormField label="From">
                      <TextField placeholder="United State Dollar (USD)" />
                    </FormField>
                    <FormField label="Send to">
                      <TextField placeholder="123 456 789 00000" />
                    </FormField>
                    <FormField label="CC:">
                      <TextField placeholder="[shipping type]" />
                    </FormField>
                    <FormField label="Subject">
                      <TextField placeholder="[shipping type]" />
                    </FormField>
                  </Form.Group>
                </Card.Content>
              </Card>
              <Card>
                <Card.Header
                  icon={<Icon size={24}>art_track</Icon>}
                  actions={
                    <>
                      <IconButton label="Remove" intent="default" variant="solid" size="small">
                        <Icon size={20}>remove</Icon>
                      </IconButton>
                      <IconButton label="Add" intent="default" variant="solid" size="small">
                        <Icon size={20}>add</Icon>
                      </IconButton>
                    </>
                  }
                >
                  Attachments
                </Card.Header>
                <Card.Content>
                  <p style={{ color: 'var(--color-text-caption)', minHeight: 80 }}>
                    No attachments added yet.
                  </p>
                </Card.Content>
              </Card>
            </Panel.Body>
          </SidePanel>
        )}
      </div>
    );
  },
};

/** Two-column — sidebar (entity summary + sections) and tabbed main area. */
export const TwoColumn: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ height: '100vh', background: 'var(--color-bg-tertiary)' }}>
        <div style={{ margin: 16 }}>
          <Button intent="primary" variant="solid" size="small" onClick={() => setOpen(true)}>
            Open Panel
          </Button>
        </div>
        {open && (
          <SidePanel
            overlay
            onOverlayClick={() => setOpen(false)}
            style={{ '--sikat-side-panel-width': '900px' } as React.CSSProperties}
          >
            <PanelHeader
              leading={
                <IconButton label="Back" intent="default" variant="outline" size="small">
                  <Icon size={20}>loyalty</Icon>
                </IconButton>
              }
              title="Create Customer"
              actions={
                <>
                  <Button intent="default" variant="solid" size="small">
                    Discard
                  </Button>
                  <Button intent="primary" variant="solid" size="small">
                    Save
                  </Button>
                </>
              }
            />
            <Panel.Body columns>
              <Panel.Sidebar>
                <Panel.Summary
                  icon="add"
                  iconVariant="outline"
                  iconSize={40}
                  name="Customer Name"
                  code="BP-00001"
                />
                <SectionCard title="Contact Person" />
                <SectionCard title="Billing Address" />
                <SectionCard title="Shipping Address" />
                <SectionCard title="Remarks" />
              </Panel.Sidebar>
              <Panel.Main>
                <Tabs items={entityTabs} variant="secondary" defaultValue="general" />
                <Card>
                  <Card.Header icon={<Icon size={24}>art_track</Icon>}>General Details</Card.Header>
                  <Card.Content>
                    <Form.Group columns={2}>
                      <FormField label="Currency">
                        <TextField placeholder="United State Dollar (USD)" />
                      </FormField>
                      <FormField label="Tax ID">
                        <TextField placeholder="123 456 789 00000" />
                      </FormField>
                      <FormField label="Website">
                        <TextField placeholder="[website]" />
                      </FormField>
                      <FormField label="Shipping Type">
                        <TextField placeholder="[shipping type]" />
                      </FormField>
                      <FormField label="Industry">
                        <TextField placeholder="Technology Industry" />
                      </FormField>
                      <FormField label="Type of Business">
                        <TextField placeholder="[type of business]" />
                      </FormField>
                      <FormField label="Sales Employee">
                        <TextField placeholder="[sales employee]" />
                      </FormField>
                      <FormField label="Technician">
                        <TextField placeholder="[technician]" />
                      </FormField>
                      <FormField label="Territory">
                        <TextField placeholder="[territory]" />
                      </FormField>
                    </Form.Group>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Header icon={<Icon size={24}>art_track</Icon>}>Banks</Card.Header>
                  <Card.Content>
                    <Form.Group columns={2}>
                      <FormField label="Currency">
                        <TextField placeholder="United State Dollar (USD)" />
                      </FormField>
                      <FormField label="Tax ID">
                        <TextField placeholder="123 456 789 00000" />
                      </FormField>
                      <FormField label="Website">
                        <TextField placeholder="[website]" />
                      </FormField>
                      <FormField label="Shipping Type">
                        <TextField placeholder="[shipping type]" />
                      </FormField>
                    </Form.Group>
                  </Card.Content>
                </Card>
              </Panel.Main>
            </Panel.Body>
          </SidePanel>
        )}
      </div>
    );
  },
};

/** On a dark page the drawer stays light — shell and Panel alike, no dark ring. */
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      style={{ height: 320, padding: 8, background: 'var(--color-bg-secondary)' }}
    >
      <SidePanel>
        <PanelHeader icon="inventory_2" title="Details" subcopy="Light on a dark page" />
        <Panel.Body>
          <SectionCard title="Section" />
        </Panel.Body>
      </SidePanel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector<HTMLElement>('.sikat-side-panel')!;
    const panel = canvasElement.querySelector<HTMLElement>('.sikat-panel')!;
    const bg = getComputedStyle(shell).backgroundColor;
    await expect(bg).toBe('rgb(255, 255, 255)');
    await expect(getComputedStyle(panel).backgroundColor).toBe(bg);
  },
};
