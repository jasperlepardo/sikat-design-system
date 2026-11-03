// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=17251-5692
// source=src/components/Tabs/Tabs.tsx
// component=Tabs
import figma from 'figma';
const instance = figma.selectedInstance;

const label = instance.getString('Label');

// Active state is controlled by the `value` prop on <Tabs>, not per-item.
const disabled = instance.getEnum('States', {
  Default: false,
  Hover: false,
  Active: false,
  Disabled: true,
});

const showLeadingIcon = instance.getBoolean('Show Leading Icon');
const showBadge = instance.getBoolean('Show Badge Counter');

let iconCode;
if (showLeadingIcon) {
  const iconInst = instance.findInstance('Icon');
  if (iconInst && iconInst.type === 'INSTANCE') {
    iconCode = iconInst.executeTemplate().example;
  }
}

let badgeCode;
if (showBadge) {
  const badgeInst = instance.findInstance('Badge Counter');
  if (badgeInst && badgeInst.type === 'INSTANCE') {
    badgeCode = badgeInst.executeTemplate().example;
  }
}

export default {
  example: figma.code`{ value: "...", label: "${label}"${disabled ? ', disabled: true' : ''}${iconCode ? figma.code`, icon: ${iconCode}` : ''}${badgeCode ? figma.code`, badge: ${badgeCode}` : ''} }`,
  id: 'tab-item',
  metadata: { nestable: true },
};
