import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import './Grid.css';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid--cols-1',
      2: 'grid--cols-2',
      3: 'grid--cols-3',
      4: 'grid--cols-4',
      auto: 'grid--cols-auto',
    },
    gap: {
      sm: 'grid--gap-sm',
      md: 'grid--gap-md',
      lg: 'grid--gap-lg',
      xl: 'grid--gap-xl',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 'md',
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export function Grid({ className, cols, gap, ...props }: GridProps): React.JSX.Element {
  return <div className={clsx(gridVariants({ cols, gap }), className)} {...props} />;
}
