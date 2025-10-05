import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      danger: 'button--danger',
      ghost: 'button--ghost',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps): React.JSX.Element {
  return <button className={clsx(buttonVariants({ variant, size }), className)} {...props} />;
}
