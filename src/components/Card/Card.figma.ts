// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=20725-85540
// source=src/components/Card/Card.tsx
// component=Card
import figma from 'figma'
const instance = figma.selectedInstance

// Card Container is the sole SLOT — all nested content (header, form fields,
// tables, etc.) resolves via each child's own Code Connect template.
const content = instance.getSlot('Card Container')

export default {
  example: figma.code`
    <Card>
      ${content}
    </Card>
  `,
  imports: ['import { Card } from "@jasperlepardo/sikat-design-system"'],
  id: 'card',
  metadata: { nestable: false },
}
