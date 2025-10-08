import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      ghost: 'button--ghost',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
    iconPrefix: {
      true: 'button--icon-prefix',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconPrefix?: string;
  children?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  iconPrefix,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={clsx(buttonVariants({ variant, size, iconPrefix: !!iconPrefix }), className)}
      {...props}
    >
      {iconPrefix && <span className="button__icon-prefix">{iconPrefix}</span>}
      {children}
    </button>
  );
}
