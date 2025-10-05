import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import './Stack.css';

const stackVariants = cva('stack', {
  variants: {
    direction: {
      row: 'stack--row',
      column: 'stack--column',
      'row-reverse': 'stack--row-reverse',
      'column-reverse': 'stack--column-reverse',
      responsive: 'stack--responsive',
    },
    gap: {
      none: 'stack--gap-none',
      sm: 'stack--gap-sm',
      md: 'stack--gap-md',
      lg: 'stack--gap-lg',
      xl: 'stack--gap-xl',
    },
    align: {
      start: 'stack--align-start',
      center: 'stack--align-center',
      end: 'stack--align-end',
      stretch: 'stack--align-stretch',
      baseline: 'stack--align-baseline',
    },
    justify: {
      start: 'stack--justify-start',
      center: 'stack--justify-center',
      end: 'stack--justify-end',
      between: 'stack--justify-between',
      around: 'stack--justify-around',
      evenly: 'stack--justify-evenly',
    },
    wrap: {
      wrap: 'stack--wrap',
      nowrap: 'stack--nowrap',
      'wrap-reverse': 'stack--wrap-reverse',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: 'nowrap',
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

export function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  ...props
}: StackProps): React.JSX.Element {
  return (
    <div
      className={clsx(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  );
}
