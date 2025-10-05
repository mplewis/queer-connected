import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import './Section.css';

const sectionVariants = cva('section', {
  variants: {
    spacing: {
      none: 'section--spacing-none',
      sm: 'section--spacing-sm',
      md: 'section--spacing-md',
      lg: 'section--spacing-lg',
      xl: 'section--spacing-xl',
    },
    paddingY: {
      none: 'section--py-none',
      sm: 'section--py-sm',
      md: 'section--py-md',
      lg: 'section--py-lg',
      xl: 'section--py-xl',
    },
    paddingX: {
      none: 'section--px-none',
      sm: 'section--px-sm',
      md: 'section--px-md',
      lg: 'section--px-lg',
      xl: 'section--px-xl',
    },
  },
  defaultVariants: {
    spacing: 'md',
    paddingY: 'none',
    paddingX: 'none',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

export function Section({
  className,
  spacing,
  paddingY,
  paddingX,
  ...props
}: SectionProps): React.JSX.Element {
  return (
    <section
      className={clsx(sectionVariants({ spacing, paddingY, paddingX }), className)}
      {...props}
    />
  );
}
