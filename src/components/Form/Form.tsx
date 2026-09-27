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
      {heading != null ? (
        <Heading className="sikat-form__heading">{heading}</Heading>
      ) : null}
      {subHeading != null ? (
        <p className="sikat-form__subheading">{subHeading}</p>
      ) : null}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- Form.Group */

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Responsive grid layout: 1 col → 3 cols at md. */
  columns?: boolean;
}

/** Field group — vertical stack (or responsive grid when `columns`) inside a Card. */
function FormGroup({ columns, className, children, ...rest }: FormGroupProps) {
  return (
    <div
      className={cn(
        'sikat-form__group',
        columns && 'grid! gap-2 grid-cols-1 md:grid-cols-3',
        className,
      )}
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
