import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import './Responsive.css';

const responsiveVariants = cva('', {
  variants: {
    hide: {
      mobile: 'responsive--hide-mobile',
      sm: 'responsive--hide-sm',
      md: 'responsive--hide-md',
      lg: 'responsive--hide-lg',
    },
    show: {
      mobile: 'responsive--show-mobile',
      sm: 'responsive--show-sm',
      md: 'responsive--show-md',
      lg: 'responsive--show-lg',
    },
  },
});

export interface ResponsiveProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof responsiveVariants> {}

export function Responsive({
  className,
  hide,
  show,
  ...props
}: ResponsiveProps): React.JSX.Element {
  return <div className={clsx(responsiveVariants({ hide, show }), className)} {...props} />;
}
