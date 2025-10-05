import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import './Container.css';

const containerVariants = cva('container', {
  variants: {
    size: {
      sm: 'container--sm',
      md: 'container--md',
      lg: 'container--lg',
      xl: 'container--xl',
      full: 'container--full',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps): React.JSX.Element {
  return <div className={clsx(containerVariants({ size }), className)} {...props} />;
}
