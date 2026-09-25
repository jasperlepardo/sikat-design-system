import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tabs, tabsVariants, type TabItem, type TabsVariant } from './Tabs';
import { Icon } from '../Icon/Icon';
import { figmaControls, figmaSelect } from '../../docs/figma-controls';

/** Figma's placeholder "Tab Icon" (circle). */
const CircleGlyph = (
  <Icon size={20}>
    <circle cx="12" cy="12" r="9" />
  </Icon>
);

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { items: [], onValueChange: fn() },
} satisfies Meta<typeof Tabs>;

export default meta;

/**
 * Controls mirror the Figma tab-button properties 1:1 (Type, Tab Titles,
 * Show Leading Icon, Show Badge); State comes from interaction.
 */
type TabsPlaygroundArgs = {
  Type: TabsVariant;
  tabTitles: string;
  showLeadingIcon: boolean;
  showBadge: boolean;
  onValueChange: (value: string) => void;
};

const makeItems = (a: TabsPlaygroundArgs): TabItem[] =>
  ['overview', 'activity', 'settings'].map((value, i) => ({
    value,
    label: i === 0 ? a.tabTitles : `${a.tabTitles} ${i + 1}`,
    icon: a.showLeadingIcon ? CircleGlyph : undefined,
    badge: a.showBadge ? '+9' : undefined,
  }));

export const Playground: StoryObj<TabsPlaygroundArgs> = {
  args: {
    Type: 'primary',
    tabTitles: 'Tabs',
    showLeadingIcon: true,
    showBadge: true,
    onValueChange: fn(),
  },
  argTypes: {
    Type: figmaSelect('Type', tabsVariants, ['Primary', 'Secondary']),
    tabTitles: { name: 'Tab Titles', control: 'text' },
    showLeadingIcon: { name: 'Show Leading Icon', control: 'boolean' },
    showBadge: { name: 'Show Badge', control: 'boolean' },
  },
  parameters: figmaControls(['Type', 'Tab Titles', 'Show Leading Icon', 'Show Badge']),
  render: (a) => (
    <Tabs
      aria-label="Example"
      variant={a.Type}
      items={makeItems(a)}
      onValueChange={a.onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => Math.round(t.getBoundingClientRect().height))).toEqual([
      32, 32, 32,
    ]);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(tabs[1]).toHaveAttribute('tabindex', '-1');

    // Click selects; arrows / Home / End move focus + selection (roving tabindex).
    await userEvent.click(tabs[1]);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('activity');
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveFocus();
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[0]).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('settings');
  },
};

/** Every Figma tab-button State, for both Types. */
export const States: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex flex-col gap-4">
      {tabsVariants.map((variant) => (
        <Tabs
          key={variant}
          aria-label={variant}
          variant={variant}
          defaultValue="active"
          items={[
            { value: 'active', label: 'Active', icon: CircleGlyph, badge: '+9' },
            { value: 'default', label: 'Default', icon: CircleGlyph, badge: '+9' },
            {
              value: 'disabled',
              label: 'Disabled',
              icon: CircleGlyph,
              badge: '+9',
              disabled: true,
            },
          ]}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getAllByRole('tab', { name: /Disabled/ });
    for (const tab of disabled) await expect(tab).toBeDisabled();
    // Keyboard skips disabled tabs.
    const primary = within(canvas.getByRole('tablist', { name: 'primary' })).getAllByRole('tab');
    primary[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(primary[0]).toHaveFocus();
  },
};
