// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=72-3820
// source=src/components/Button/Button.tsx
// component=Button
import figma from 'figma';
const instance = figma.selectedInstance;

const label = instance.getString('Button Label');

const intent = instance.getEnum('Type', {
  Default: 'default',
  Primary: 'primary',
  Success: 'success',
  Warning: 'warning',
  Danger: 'danger',
  White: 'white',
  Black: 'black',
});

const variant = instance.getEnum('Style', {
  Solid: 'solid',
  Outline: 'outline',
  Ghost: 'ghost',
  Link: 'link',
});

const size = instance.getEnum('Size', {
  'Extra Large': 'extra-large',
  Large: 'large',
  Medium: 'medium',
  Small: 'small',
  'Extra Small': 'extra-small',
});

const disabled = instance.getEnum('State', {
  Default: false,
  Hover: false,
  Disabled: true,
});

const showLeadingIcon = instance.getBoolean('Show Leading Icon');
const showTrailingIcon = instance.getBoolean('Show Trailing Icon');

let leadingIconCode;
if (showLeadingIcon) {
  const leadingIcon = instance.findInstance('Leading Icon');
  if (leadingIcon && leadingIcon.type === 'INSTANCE') {
    leadingIconCode = leadingIcon.executeTemplate().example;
  }
}

let trailingIconCode;
if (showTrailingIcon) {
  const trailingIcon = instance.findInstance('Trailing Icon');
  if (trailingIcon && trailingIcon.type === 'INSTANCE') {
    trailingIconCode = trailingIcon.executeTemplate().example;
  }
}

export default {
  example: figma.code`
    <Button
      intent="${intent}"
      variant="${variant}"
      size="${size}"
      ${disabled ? 'disabled' : ''}
      ${leadingIconCode ? figma.code`leadingIcon={${leadingIconCode}}` : ''}
      ${trailingIconCode ? figma.code`trailingIcon={${trailingIconCode}}` : ''}
    >
      ${label}
    </Button>
  `,
  imports: ['import { Button } from "@jasperlepardo/sikat-design-system"'],
  id: 'button',
  metadata: { nestable: true },
};
