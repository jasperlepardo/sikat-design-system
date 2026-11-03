// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=8919-1174
// source=src/components/Button/IconButton.tsx
// component=IconButton
import figma from 'figma'
const instance = figma.selectedInstance

const intent = instance.getEnum('Type', {
  'Default': 'default',
  'Primary': 'primary',
  'Success': 'success',
  'Warning': 'warning',
  'Danger': 'danger',
  'White': 'white',
  'Black': 'black',
})

const variant = instance.getEnum('Style', {
  'Solid': 'solid',
  'Ghost': 'ghost',
  'Outline': 'outline',
  'Link': 'link',
})

const size = instance.getEnum('Size', {
  'Extra Large': 'extra-large',
  'Large': 'large',
  'Medium': 'medium',
  'Small': 'small',
  'Extra Small': 'extra-small',
  '2xs': '2xs',
})

const disabled = instance.getEnum('State', {
  'Default': false,
  'Hover': false,
  'Disabled': true,
})

const iconInstance = instance.findInstance('Icon')
let iconCode
if (iconInstance && iconInstance.type === 'INSTANCE') {
  iconCode = iconInstance.executeTemplate().example
}

export default {
  example: figma.code`
    <IconButton
      intent="${intent}"
      variant="${variant}"
      size="${size}"
      label="..."
      ${disabled ? 'disabled' : ''}
    >
      ${iconCode}
    </IconButton>
  `,
  imports: ['import { IconButton } from "@jasperlepardo/sikat-design-system"'],
  id: 'icon-button',
  metadata: { nestable: true },
}
