import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CardField, type CardFieldOption } from './CardField';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';
import { FormField } from './FormField';

const options: CardFieldOption[] = [
  {
    value: 'co',
    label: 'Sikat Tech Inc.',
    icon: <Icon size={16}>business</Icon>,
    fields: [
      { label: 'Street', value: 'Unit 1203, Tektite East Tower, Exchange Road' },
      { label: 'Barangay', value: 'San Antonio' },
      { label: 'City', value: 'City of Pasig' },
      { label: 'Province', value: 'Metro Manila 1605' },
    ],
  },
  {
    value: 'mnl',
    label: 'Manila distribution center',
    icon: <Icon size={16}>warehouse</Icon>,
    fields: [
      { label: 'Street', value: '20 C. Raymundo Ave.' },
      { label: 'Barangay', value: 'Ugong' },
      { label: 'City', value: 'City of Pasig' },
      { label: 'Province', value: 'Metro Manila 1604' },
    ],
  },
  {
    value: 'ceb',
    label: 'Cebu store',
    icon: <Icon size={16}>warehouse</Icon>,
    fields: [
      { label: 'Street', value: 'Salinas Dr.' },
      { label: 'Barangay', value: 'Lahug' },
      { label: 'City', value: 'Cebu' },
      { label: 'Province', value: 'Cebu 6000' },
    ],
  },
  {
    value: 'dvo',
    label: 'Davao store',
    icon: <Icon size={16}>warehouse</Icon>,
    fields: [
      { label: 'Street', value: 'J.P. Laurel Ave.' },
      { label: 'Barangay', value: 'Buhangin' },
      { label: 'City', value: 'Davao' },
      { label: 'Province', value: 'Davao 8000' },
    ],
  },
];

const meta = {
  title: 'Components/Field/CardField',
  component: CardField,
  tags: ['autodocs'],
  args: { options, placeholder: 'Select a location' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CardField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * When a value is selected the card shows full detail with a clear (✕) action.
 * Clicking ✕ removes the selection and shows the Combobox. Opening the Combobox
 * dropdown shows each option as name + full address on one line.
 */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('mnl');
    const [editText, setEditText] = useState('');
    return (
      <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CardField
          {...args}
          label="Ship to"
          value={value}
          onValueChange={setValue}
          onEdit={() =>
            setEditText(
              options
                .find((o) => o.value === value)
                ?.fields?.map((f) => String(f.value))
                .join('\n') ?? '',
            )
          }
        />
        {editText ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 12,
              background: 'var(--color-bg-secondary)',
              borderRadius: 8,
            }}
          >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
              Edit address (simulated side panel)
            </p>
            <textarea
              rows={5}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 8,
                fontFamily: 'inherit',
                fontSize: 13,
              }}
              value={editText}
              onChange={(e) => setEditText(e.currentTarget.value)}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  alert(`Saved: ${editText}`);
                  setEditText('');
                }}
              >
                Save
              </button>
              <button onClick={() => setEditText('')}>Cancel</button>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
};

/** Empty state — shows the Combobox immediately. */
export const NoSelection: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 420 }}>
        <CardField {...args} aria-label="Ship to" value={value} onValueChange={setValue} />
      </div>
    );
  },
};

/**
 * The `footer` prop is passed to the Combobox dropdown — shown at the bottom
 * of the open option list for a contextual action like "+ New address".
 */
export const WithFooter: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 420 }}>
        <CardField
          {...args}
          aria-label="Ship to"
          value={value}
          onValueChange={setValue}
          footer={
            <Button type="button" size="small" variant="ghost">
              + New address
            </Button>
          }
        />
      </div>
    );
  },
};

/** Two fields side by side — the PO address layout. */
export const SideBySide: Story = {
  render: (args) => {
    const [shipTo, setShipTo] = useState('mnl');
    const [billTo, setBillTo] = useState('co');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 860 }}>
        <FormField label="Ship to">
          {(p) => <CardField {...args} {...p} value={shipTo} onValueChange={setShipTo} />}
        </FormField>
        <FormField label="Bill to">
          {(p) => (
            <CardField
              {...args}
              {...p}
              options={options.filter((o) => o.value === 'co')}
              value={billTo}
              onValueChange={setBillTo}
            />
          )}
        </FormField>
      </div>
    );
  },
};

/** Read-only: no clear action; card is display-only. */
export const IsReadOnly: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <CardField {...args} aria-label="Ship to" value="mnl" readOnly />
    </div>
  ),
};
