// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=9326-2069
// source=src/components/Divider/Divider.tsx
// component=Divider
import figma from 'figma';

// Figma has Default/Dashed variants but the code Divider has no variant prop.
// Both map to the same component; dashed styling would require a className override.

export default {
  example: figma.code`<Divider />`,
  imports: ['import { Divider } from "@jasperlepardo/sikat-design-system"'],
  id: 'divider',
  metadata: { nestable: true },
};
