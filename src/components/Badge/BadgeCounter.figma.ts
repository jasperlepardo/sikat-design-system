// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=9060-6963
// source=src/components/Badge/Badge.tsx
// component=BadgeCounter
import figma from 'figma';
const instance = figma.selectedInstance;

const content = instance.getString('Content');

const intent = instance.getEnum('Intent', {
  Default: 'default',
  Primary: 'primary',
  Success: 'success',
  Warning: 'warning',
  Danger: 'danger',
  Information: 'information',
  Automation: 'automation',
  Light: 'light',
  Dark: 'dark',
});

const variant = instance.getEnum('Style', {
  Solid: 'solid',
  Outline: 'outline',
  Ghost: 'ghost',
  Link: 'link',
});

export default {
  example: figma.code`
    <BadgeCounter
      intent="${intent}"
      variant="${variant}"
    >
      ${content}
    </BadgeCounter>
  `,
  imports: ['import { BadgeCounter } from "@jasperlepardo/sikat-design-system"'],
  id: 'badge-counter',
  metadata: { nestable: true },
};
