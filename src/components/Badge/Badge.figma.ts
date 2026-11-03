// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=177-6516
// source=src/components/Badge/Badge.tsx
// component=Badge
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Badge Label')

const intent = instance.getEnum('Intent', {
  'Default': 'default',
  'Primary': 'primary',
  'Success': 'success',
  'Warning': 'warning',
  'Danger': 'danger',
  'Information': 'information',
  'Automation': 'automation',
  'White': 'white',
  'Black': 'black',
})

const variant = instance.getEnum('Style', {
  'Solid': 'solid',
  'Outline': 'outline',
  'Ghost': 'ghost',
  'Link': 'link',
})

const size = instance.getEnum('Size', {
  'Small': 'small',
  'Medium': 'medium',
})

const dot = instance.getBoolean('Show Dot')
const showLeadingIcon = instance.getBoolean('Show Leading Icon')
const showTrailingIcon = instance.getBoolean('Show Trailing Icon')

let leadingIconCode
if (showLeadingIcon) {
  const leadingIcon = instance.findInstance('Leading Icon')
  if (leadingIcon && leadingIcon.type === 'INSTANCE') {
    leadingIconCode = leadingIcon.executeTemplate().example
  }
}

let trailingIconCode
if (showTrailingIcon) {
  const trailingIcon = instance.findInstance('Trailing Icon')
  if (trailingIcon && trailingIcon.type === 'INSTANCE') {
    trailingIconCode = trailingIcon.executeTemplate().example
  }
}

export default {
  example: figma.code`
    <Badge
      intent="${intent}"
      variant="${variant}"
      size="${size}"
      ${dot ? 'dot' : ''}
      ${leadingIconCode ? figma.code`leadingIcon={${leadingIconCode}}` : ''}
      ${trailingIconCode ? figma.code`trailingIcon={${trailingIconCode}}` : ''}
    >
      ${label}
    </Badge>
  `,
  imports: ['import { Badge } from "@jasperlepardo/sikat-design-system"'],
  id: 'badge',
  metadata: { nestable: true },
}
