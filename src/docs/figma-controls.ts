/**
 * Helpers for Storybook controls that mirror a Figma component's properties 1:1:
 * same property names (as control labels) and the same option labels, while the
 * underlying args keep the code prop names/values.
 */

/** `select` control whose option labels are the Figma variant values. */
export function figmaSelect<T extends string | boolean>(
  name: string,
  options: readonly T[],
  labels: readonly string[],
) {
  return {
    name,
    options,
    control: {
      type: 'select' as const,
      labels: Object.fromEntries(options.map((o, i) => [String(o), labels[i] ?? String(o)])),
    },
  };
}

/** Controls panel shows only these Figma property names, in this order. */
export function figmaControls(names: readonly string[]) {
  return { controls: { include: [...names], sort: 'none' as const } };
}

/**
 * Args for Figma's shared input adornments (Text Field / Select / Multi Select).
 * Keys avoid the components' own prop names (`prefix`/`suffix`) so Storybook keeps
 * them in Figma order instead of sorting them after the component props.
 */
export type FigmaAdornmentArgs = {
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
  content: string;
  showPrefix: boolean;
  prefixText: string;
  showSuffix: boolean;
  suffixText: string;
};

export const figmaAdornmentDefaults: FigmaAdornmentArgs = {
  showLeadingIcon: true,
  showTrailingIcon: true,
  content: 'Placeholder',
  showPrefix: true,
  prefixText: 'Prefix',
  showSuffix: true,
  suffixText: 'Suffix',
};

/** argTypes for the adornment properties, labelled with the Figma names. */
export const figmaAdornmentArgTypes = {
  showLeadingIcon: { name: 'Show Leading Icon', control: 'boolean' as const },
  showTrailingIcon: { name: 'Show Trailing Icon', control: 'boolean' as const },
  content: { name: 'Content', control: 'text' as const },
  showPrefix: { name: 'Show Prefix', control: 'boolean' as const },
  prefixText: { name: 'Prefix', control: 'text' as const },
  showSuffix: { name: 'Show Suffix', control: 'boolean' as const },
  suffixText: { name: 'Suffix', control: 'text' as const },
};

export const figmaAdornmentNames = [
  'Show Leading Icon',
  'Show Trailing Icon',
  'Content',
  'Show Prefix',
  'Prefix',
  'Show Suffix',
  'Suffix',
] as const;
