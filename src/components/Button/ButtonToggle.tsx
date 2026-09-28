import { createContext, useContext, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { ButtonIntent, ButtonSize } from '../../tokens/generated/button.manifest';

interface ToggleGroupContextValue {
  value: string | null;
  onChange: (v: string) => void;
  intent: ButtonIntent;
  size: ButtonSize;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps {
  /** Controlled selected value. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  intent?: ButtonIntent;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function ToggleGroup({
  value,
  defaultValue = null,
  onValueChange,
  intent = 'default',
  size = 'medium',
  className,
  children,
}: ToggleGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const selected = isControlled ? value : internal;

  const onChange = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <ToggleGroupContext.Provider value={{ value: selected, onChange, intent, size }}>
      <div role="group" className={cn('sikat-toggle-group', className)}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export interface ToggleProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function Toggle({ value, disabled, className, children }: ToggleProps) {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error('Button.Toggle must be used inside Button.ToggleGroup');

  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={cn('sikat-btn sikat-toggle', className)}
      data-intent={ctx.intent}
      data-style={active ? 'solid' : 'outline'}
      data-size={ctx.size}
      onClick={() => !disabled && ctx.onChange(value)}
    >
      <span className="sikat-btn__content">{children}</span>
    </button>
  );
}
