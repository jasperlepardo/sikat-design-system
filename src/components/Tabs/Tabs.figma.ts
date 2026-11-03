// url=https://www.figma.com/design/lFuOcYXanzzbYTJmsEEWR5/Components?node-id=20479-82276
// source=src/components/Tabs/Tabs.tsx
// component=Tabs
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('Type', {
  'Fill': 'solid',
  'Underline': 'outline',
})

// Collect nested Tab Item instances via their Code Connect id
const allTabs = instance.findConnectedInstances(n => n.codeConnectId() === 'tab-item')
const t0 = allTabs[0]
const t1 = allTabs[1]
const t2 = allTabs[2]
const t3 = allTabs[3]

const s0 = t0 ? t0.executeTemplate().example : undefined
const s1 = t1 ? t1.executeTemplate().example : undefined
const s2 = t2 ? t2.executeTemplate().example : undefined
const s3 = t3 ? t3.executeTemplate().example : undefined

export default {
  example: figma.code`
    <Tabs
      variant="${variant}"
      items={[
        ${s0 ? figma.code`${s0},` : ''}
        ${s1 ? figma.code`${s1},` : ''}
        ${s2 ? figma.code`${s2},` : ''}
        ${s3 ? figma.code`${s3},` : ''}
      ]}
    />
  `,
  imports: ['import { Tabs } from "@jasperlepardo/sikat-design-system"'],
  id: 'tabs',
  metadata: { nestable: false },
}
