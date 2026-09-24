import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Alert, alertIntents, alertStyles, type AlertIntent, type AlertStyle } from './Alert';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    intent: 'primary',
    variant: 'outline',
    horizontal: false,
    title: 'Heads up',
    children: 'This is an informational message driven by semantic tokens.',
  },
  argTypes: {
    intent: { control: 'inline-radio', options: alertIntents },
    variant: { control: 'inline-radio', options: alertStyles },
    horizontal: { control: 'boolean' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls mirror the Figma Alert component properties 1:1 — same names, options
 * and order (args keyed by the Figma property names).
 */
type AlertPlaygroundArgs = {
  showAlertTitle: boolean;
  showAlertMessage: boolean;
  alertTitle: string;
  alertMessage: string;
  isDismissible: boolean;
  showLeadingIcon: boolean;
  showSecondaryAction: boolean;
  showButton: boolean;
  Intent: AlertIntent;
  Style: AlertStyle;
  isHorizontal: boolean;
  onClose: () => void;
};

export const Playground: StoryObj<AlertPlaygroundArgs> = {
  args: {
    showAlertTitle: true,
    showAlertMessage: true,
    alertTitle: 'Title',
    alertMessage: 'Message',
    isDismissible: true,
    showLeadingIcon: true,
    showSecondaryAction: true,
    showButton: true,
    Intent: 'default',
    Style: 'solid',
    isHorizontal: false,
    onClose: fn(),
  },
  argTypes: {
    showAlertTitle: { name: 'Show Alert Title', control: 'boolean' },
    showAlertMessage: { name: 'Show Alert Message', control: 'boolean' },
    alertTitle: { name: 'Alert Title', control: 'text' },
    alertMessage: { name: 'Alert Message', control: 'text' },
    isDismissible: { name: 'isDismissible', control: 'boolean' },
    showLeadingIcon: { name: 'Show Leading Icon', control: 'boolean' },
    showSecondaryAction: { name: 'Show Secondary Action', control: 'boolean' },
    showButton: { name: 'Show Button', control: 'boolean' },
    Intent: figmaSelect('Intent', alertIntents, [
      'Default',
      'Primary',
      'Success',
      'Warning',
      'Danger',
    ]),
    Style: figmaSelect('Style', alertStyles, ['Solid', 'Outline', 'Transparent']),
    isHorizontal: figmaSelect('is Horizontal', [false, true], ['False', 'True']),
  },
  parameters: figmaControls([
    'Show Alert Title',
    'Show Alert Message',
    'Alert Title',
    'Alert Message',
    'isDismissible',
    'Show Leading Icon',
    'Show Secondary Action',
    'Show Button',
    'Intent',
    'Style',
    'is Horizontal',
  ]),
  render: (a) => (
    <div style={{ width: 400 }}>
      <Alert
        intent={a.Intent}
        variant={a.Style}
        horizontal={a.isHorizontal}
        icon={a.showLeadingIcon ? undefined : null}
        title={a.showAlertTitle ? a.alertTitle : undefined}
        onClose={a.isDismissible ? a.onClose : undefined}
        actions={
          a.showButton || a.showSecondaryAction ? (
            <>
              {a.showButton ? <Alert.Action href="#">Button</Alert.Action> : null}
              {a.showSecondaryAction ? <Alert.Action href="#">Button</Alert.Action> : null}
            </>
          ) : undefined
        }
      >
        {a.showAlertMessage ? a.alertMessage : undefined}
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Title')).toBeInTheDocument();
    await expect(canvas.getByText('Message')).toBeInTheDocument();
  },
};

export const WithActionsAndDismissInteraction: Story = {
  args: {
    intent: 'warning',
    variant: 'outline',
    title: 'Unsaved changes',
    children: 'You have unsaved changes.',
    onClose: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const closeBtn = canvas.getByRole('button', { name: /dismiss/i });
    await userEvent.click(closeBtn);
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

/** Mirrors the Figma Alert frame: rows = intent, columns = style, vertical then horizontal. */
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {[false, true].map((horizontal) => (
        <div
          key={String(horizontal)}
          className="grid gap-x-10 gap-y-10"
          style={{ gridTemplateColumns: 'repeat(3, 400px)' }}
        >
          {alertIntents.flatMap((intent) =>
            alertStyles.map((variant) => (
              <Alert
                key={`${intent}-${variant}`}
                intent={intent}
                variant={variant}
                horizontal={horizontal}
                title="Title"
                onClose={() => {}}
                actions={
                  <>
                    <Alert.Action href="#">Button</Alert.Action>
                    <Alert.Action href="#">Button</Alert.Action>
                  </>
                }
              >
                Message
              </Alert>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};

export const WithActionsAndDismiss: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ maxWidth: 560 }}>
      <Alert
        intent="warning"
        variant="outline"
        title="Unsaved changes"
        onClose={() => {}}
        actions={
          <>
            <Alert.Action href="#">Save</Alert.Action>
            <Alert.Action href="#">Discard</Alert.Action>
          </>
        }
      >
        You have unsaved changes that will be lost.
      </Alert>

      <Alert
        intent="success"
        variant="solid"
        horizontal
        title="Payment received"
        onClose={() => {}}
      >
        Your transaction completed successfully.
      </Alert>
    </div>
  ),
};

/** Compound parts for a custom layout; actions use the themed `Alert.Action` (Link). */
export const Compound: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Alert.Root intent="danger" variant="outline">
        <Alert.Icon />
        <Alert.Content>
          <Alert.Text>
            <Alert.Title>Couldn’t save your changes</Alert.Title>
            <Alert.Body>Check your connection and try again.</Alert.Body>
          </Alert.Text>
          <Alert.Actions>
            <Alert.Action onClick={() => {}}>Retry</Alert.Action>
            <Alert.Action onClick={() => {}}>Dismiss</Alert.Action>
          </Alert.Actions>
        </Alert.Content>
        <Alert.Close onClick={() => {}} />
      </Alert.Root>
    </div>
  ),
};
