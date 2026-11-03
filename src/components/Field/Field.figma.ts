// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=6905-936
// source=src/components/Field/FormField.tsx
// component=FormField
import figma from 'figma';
const instance = figma.selectedInstance;

const orientation = instance.getEnum('Orientation', {
  Stacked: 'stacked',
  Inline: 'inline',
});

const showLabel = instance.getBoolean('Show Label');
const showHelper = instance.getBoolean('Show Helper');
const helperText = instance.getString('Helper');

// State maps to two separate code props
const isDisabled = instance.getEnum('State', {
  Default: false,
  Hover: false,
  Error: false,
  Disabled: true,
  'Read-only': false,
});

const hasError = instance.getEnum('State', {
  Default: false,
  Hover: false,
  Error: true,
  Disabled: false,
  'Read-only': false,
});

// Label text lives inside the nested _Form Label instance
const labelHandle = showLabel ? instance.findText('Label', { traverseInstances: true }) : null;
const labelText = labelHandle ? labelHandle.textContent : '';

// The swapped input control (TextField, Select, Textarea, etc.)
const control = instance.getInstanceSwap('Type');
let controlCode;
if (control && control.type === 'INSTANCE') {
  controlCode = control.executeTemplate().example;
}

export default {
  example: figma.code`
    <FormField
      orientation="${orientation}"
      ${showLabel ? figma.code`label="${labelText}"` : ''}
      ${showHelper ? figma.code`hint="${helperText}"` : ''}
      ${hasError ? 'error="..."' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
      {(props) => ${controlCode}}
    </FormField>
  `,
  imports: ['import { FormField } from "@jasperlepardo/sikat-design-system"'],
  id: 'form-field',
  metadata: { nestable: true },
};
