import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SidePanel } from './SidePanel';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Icon } from '../Icon/Icon';
import { Tabs } from '../Tabs/Tabs';
import { Card } from '../Card/Card';
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

const TwoColFields = ({ labels }: { labels: [string, string][] }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
    {labels.map(([label, placeholder]) => (
      <FormField key={label} label={label}>
        <TextField placeholder={placeholder} />
      </FormField>
    ))}
  </div>
);

/* ---------------------------------------------------------------- stories */

/**
 * Single-column with overlay — tabs at the top, scrollable body, backdrop overlay.
 * Mirrors Figma node 18249:110237.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ height: '100vh', background: 'var(--color-bg-tertiary)', position: 'relative' }}>
        <div style={{ margin: 16 }}>
          <Button intent="primary" variant="solid" size="small" onClick={() => setOpen(true)}>
            Open Panel
          </Button>
        </div>
        {open && (
          <SidePanel overlay onOverlayClick={() => setOpen(false)}
            style={{ '--sikat-side-panel-width': '560px' } as React.CSSProperties}>
            <SidePanel.Header
              leading={
                <IconButton label="Back" intent="default" variant="outline" size="small">
                  <Icon size={20}>loyalty</Icon>
                </IconButton>
              }
              title="Send Email"
              actions={
                <>
                  <Button intent="default" variant="solid" size="small">Discard</Button>
                  <Button intent="primary" variant="solid" size="small">Save</Button>
                </>
              }
            />
            <SidePanel.Tabs>
              <Tabs items={emailTabs} variant="secondary" />
            </SidePanel.Tabs>
            <SidePanel.Body>
              <Card>
                <Card.Content>
                  <FormField label="From"><TextField placeholder="United State Dollar (USD)" /></FormField>
                  <FormField label="Send to"><TextField placeholder="123 456 789 00000" /></FormField>
                  <FormField label="CC:"><TextField placeholder="[shipping type]" /></FormField>
                  <FormField label="Subject"><TextField placeholder="[shipping type]" /></FormField>
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
            </SidePanel.Body>
          </SidePanel>
        )}
      </div>
    );
  },
};

/**
 * Two-column with overlay — sidebar + tabbed main, tabs at the top.
 * Mirrors Figma node 18249:110237 (Create Customer).
 */
export const TwoColumn: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ height: '100vh', background: 'var(--color-bg-tertiary)', position: 'relative' }}>
        <div style={{ margin: 16 }}>
          <Button intent="primary" variant="solid" size="small" onClick={() => setOpen(true)}>
            Open Panel
          </Button>
        </div>
        {open && (
          <SidePanel overlay onOverlayClick={() => setOpen(false)}
            style={{ '--sikat-side-panel-width': '900px' } as React.CSSProperties}>
            <SidePanel.Header
              leading={
                <IconButton label="Back" intent="default" variant="outline" size="small">
                  <Icon size={20}>loyalty</Icon>
                </IconButton>
              }
              title="Create Customer"
              actions={
                <>
                  <Button intent="default" variant="solid" size="small">Discard</Button>
                  <Button intent="primary" variant="solid" size="small">Save</Button>
                </>
              }
            />
            <SidePanel.Body columns>
              <SidePanel.Sidebar>
                <SidePanel.Summary
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
              </SidePanel.Sidebar>
              <SidePanel.Main>
                <Tabs items={entityTabs} variant="secondary" defaultValue="general" />
                <Card>
                  <Card.Header icon={<Icon size={24}>art_track</Icon>}>General Details</Card.Header>
                  <Card.Content>
                    <TwoColFields labels={[
                      ['Currency', 'United State Dollar (USD)'],
                      ['Tax ID', '123 456 789 00000'],
                      ['Website', '[shipping type]'],
                      ['Shipping Type', '[shipping type]'],
                      ['Industry', 'Technology Industry'],
                      ['Type of Business', '[type of business]'],
                      ['Sales Employee', '[sales employee]'],
                      ['Technician', '[technician]'],
                      ['Territory', '[territory]'],
                    ]} />
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Header icon={<Icon size={24}>art_track</Icon>}>Banks</Card.Header>
                  <Card.Content>
                    <TwoColFields labels={[
                      ['Currency', 'United State Dollar (USD)'],
                      ['Tax ID', '123 456 789 00000'],
                      ['Website', '[shipping type]'],
                      ['Shipping Type', '[shipping type]'],
                    ]} />
                  </Card.Content>
                </Card>
              </SidePanel.Main>
            </SidePanel.Body>
          </SidePanel>
        )}
      </div>
    );
  },
};

/** Inline (no overlay) — fills its container. Useful for split-pane layouts. */
export const Inline: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, background: 'var(--color-bg-tertiary)' }} />
      <div style={{ width: 560, display: 'flex' }}>
        <SidePanel>
          <SidePanel.Header
            leading={
              <IconButton label="Close" intent="default" variant="outline" size="small">
                <Icon size={20}>close</Icon>
              </IconButton>
            }
            title="Details"
            actions={
              <Button intent="primary" variant="solid" size="small">Save</Button>
            }
          />
          <SidePanel.Tabs>
            <Tabs items={emailTabs} variant="secondary" />
          </SidePanel.Tabs>
          <SidePanel.Body>
            <Card>
              <Card.Content>
                <p style={{ color: 'var(--color-text-body)' }}>Content slot.</p>
              </Card.Content>
            </Card>
          </SidePanel.Body>
        </SidePanel>
      </div>
    </div>
  ),
};
