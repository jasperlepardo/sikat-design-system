// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=8919-4545
// source=src/components/Alert/Alert.tsx
// component=Alert
import figma from 'figma'
const instance = figma.selectedInstance

const intent = instance.getEnum('Intent', {
  'Default': 'default',
  'Primary': 'primary',
  'Success': 'success',
  'Warning': 'warning',
  'Danger': 'danger',
})

const variant = instance.getEnum('Style', {
  'Solid': 'solid',
  'Outline': 'outline',
  'Transparent': 'transparent',
})

const horizontal = instance.getEnum('is Horizontal', {
  'False': false,
  'True': true,
})

const showTitle = instance.getBoolean('Show Alert Title')
const titleText = instance.getString('Alert Title')
const showMessage = instance.getBoolean('Show Alert Message')
const messageText = instance.getString('Alert Message')
const isDismissible = instance.getBoolean('isDismissible')
const showLeadingIcon = instance.getBoolean('Show Leading Icon')
const showButton = instance.getBoolean('Show Button')
const showSecondaryAction = instance.getBoolean('Show Secondary Action')

let iconCode
if (showLeadingIcon) {
  const iconInstance = instance.findInstance('Icon')
  if (iconInstance && iconInstance.type === 'INSTANCE') {
    iconCode = iconInstance.executeTemplate().example
  }
}

let primaryActionCode
if (showButton) {
  const primaryAction = instance.findInstance('Link Button')
  if (primaryAction && primaryAction.type === 'INSTANCE') {
    primaryActionCode = primaryAction.executeTemplate().example
  }
}

let secondaryActionCode
if (showSecondaryAction) {
  const allLinkButtons = instance.findLayers(n => n.type === 'INSTANCE' && n.name === 'Link Button')
  const secondButton = allLinkButtons[1]
  if (secondButton && secondButton.type === 'INSTANCE') {
    secondaryActionCode = secondButton.executeTemplate().example
  }
}

export default {
  example: figma.code`
    <Alert
      intent="${intent}"
      variant="${variant}"
      ${horizontal ? 'horizontal' : ''}
      ${showTitle ? figma.code`title="${titleText}"` : ''}
      ${!showLeadingIcon ? 'icon={null}' : iconCode ? figma.code`icon={${iconCode}}` : ''}
      ${isDismissible ? 'onClose={() => {}}' : ''}
      ${(showButton || showSecondaryAction) ? figma.code`actions={
        <>
          ${primaryActionCode}
          ${secondaryActionCode}
        </>
      }` : ''}
    >
      ${showMessage ? messageText : ''}
    </Alert>
  `,
  imports: ['import { Alert } from "@jasperlepardo/sikat-design-system"'],
  id: 'alert',
  metadata: { nestable: false },
}
