import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './button.css';

export const buttonGroupOrientations = ['horizontal', 'stacked'] as const;
export type ButtonGroupOrientation = (typeof buttonGroupOrientations)[number];

export const buttonGroupAligns = ['start', 'center', 'end', 'between'] as const;
export type ButtonGroupAlign = (typeof buttonGroupAligns)[number];

export const buttonGroupTypes = ['default', 'enclosed'] as const;
export type ButtonGroupType = (typeof buttonGroupTypes)[number];

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Row (`horizontal`) or vertical (`stacked`, full-width buttons). */
  orientation?: ButtonGroupOrientation;
  /** Horizontal alignment (ignored when `fill` or `stacked`). Default `end`. */
  align?: ButtonGroupAlign;
  /** Stretch buttons to equal width. */
  fill?: boolean;
  /** `enclosed` joins buttons into a single attached control (no gap, shared borders). */
  type?: ButtonGroupType;
  /** Shell intent — applies button color tokens to the enclosure itself (enclosed only). */
  intent?: string;
  /** Shell variant — applies button style tokens to the enclosure itself (enclosed only). */
  variant?: string;
  /** Injects `intent` into every direct button child. */
  buttonIntent?: string;
  /** Injects `variant` into every direct button child. */
  buttonVariant?: string;
  children?: ReactNode;
}

function withButtonProps(children: ReactNode, intent?: string, variant?: string): ReactNode {
  if (!intent && !variant) return children;
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const props: Record<string, unknown> = {};
    if (intent) props.intent = intent;
    if (variant) props.variant = variant;
    return cloneElement(child, props);
  });
}

/**
 * ButtonGroup — lays out 1–3 actions as a footer/CTA cluster. `type="enclosed"`
 * wraps children in a button-styled shell; use `intent`/`variant` for the shell
 * and `buttonIntent`/`buttonVariant` to inject styles into child buttons.
 */
export function ButtonGroup({
  orientation = 'horizontal',
  align = 'end',
  fill = false,
  type = 'default',
  intent,
  variant,
  buttonIntent,
  buttonVariant,
  className,
  children,
  ...rest
}: ButtonGroupProps) {
  const isEnclosed = type === 'enclosed';
  return (
    <div
      role="group"
      className={cn('sikat-button-group', isEnclosed && 'sikat-btn', className)}
      data-orientation={orientation}
      data-align={align}
      data-fill={fill || undefined}
      data-type={isEnclosed ? type : undefined}
      data-intent={isEnclosed ? (intent ?? 'default') : undefined}
      data-style={isEnclosed ? (variant ?? 'solid') : undefined}
      {...rest}
    >
      {withButtonProps(children, buttonIntent, buttonVariant)}
    </div>
  );
}
