import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './form.css';

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

/** Form — a semantic `<form>` that stacks `Form.Section`s (and `Divider`s). */
export function Form({ className, children, ...rest }: FormProps) {
  return (
    <form className={cn('sikat-form', className)} {...rest}>
      {children}
    </form>
  );
}

/* ------------------------------------------------------------ Form.Section */

export type FormSectionProps = HTMLAttributes<HTMLElement>;

/** A titled group within a Form — a `Form.Header` over a `Form.Group`. */
function FormSection({ className, children, ...rest }: FormSectionProps) {
  return (
    <section className={cn('sikat-form__section', className)} {...rest}>
      {children}
    </section>
  );
}

/* ---------------------------------------------------------- Form.Fieldset */

export type FormFieldsetProps = HTMLAttributes<HTMLFieldSetElement>;

/**
 * Form.Fieldset — the semantic variant of `Form.Section`, rendered as a
 * `<fieldset>` for grouped inputs (radios, checkboxes). Pair with a `<legend>`.
 */
function FormFieldset({ className, children, ...rest }: FormFieldsetProps) {
  return (
    <fieldset className={cn('sikat-form__fieldset', className)} {...rest}>
      {children}
    </fieldset>
  );
}

/* ------------------------------------------------------------- Form.Header */

export type FormHeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface FormHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Section heading text. */
  heading?: ReactNode;
  /** Optional brand-colored sub-heading below the heading. */
  subHeading?: ReactNode;
  /** Heading element to render — defaults to `'h3'`. */
  as?: FormHeadingLevel;
}

/** Form.Header — a section's heading and optional brand sub-heading. */
function FormHeader({
  heading,
  subHeading,
  as: Heading = 'h3',
  className,
  children,
  ...rest
}: FormHeaderProps) {
  return (
    <div className={cn('sikat-form__header', className)} {...rest}>
      {heading != null ? <Heading className="sikat-form__heading">{heading}</Heading> : null}
      {subHeading != null ? <p className="sikat-form__subheading">{subHeading}</p> : null}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- Form.Group */

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Responsive grid layout: number of columns at md+ breakpoint (1 col on mobile always).
   * `1` = single column, `2` = two columns, `3` = three columns.
   */
  columns?: 1 | 2 | 3;
  /**
   * Matches the `orientation` of the `FormField`s inside: `horizontal` (default,
   * label above) uses 16px; `vertical` (label beside, fixed) uses 4px;
   * `responsive` (label beside when wide, stacked when narrow) uses 4px → 16px.
   */
  orientation?: 'horizontal' | 'vertical' | 'responsive';
}

const COLS_CLASS: Record<1 | 2 | 3, string> = {
  1: 'grid! gap-2 grid-cols-1',
  2: 'grid! gap-2 grid-cols-1 md:grid-cols-2',
  3: 'grid! gap-2 grid-cols-1 md:grid-cols-3',
};

/** Field group — vertical stack (or responsive grid when `columns`) inside a Card. */
function FormGroup({ columns, orientation, className, children, ...rest }: FormGroupProps) {
  return (
    <div
      className={cn('sikat-form__group', columns != null && COLS_CLASS[columns], className)}
      data-orientation={orientation}
      {...rest}
    >
      {children}
    </div>
  );
}

Form.Section = FormSection;
Form.Fieldset = FormFieldset;
Form.Header = FormHeader;
Form.Group = FormGroup;
