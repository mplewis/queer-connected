import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import './Typography.css';

const typographyVariants = cva('typ', {
  variants: {
    variant: {
      p: 'typ--p',
      h1: 'typ--h1',
      h2: 'typ--h2',
      h3: 'typ--h3',
    },
    color: {
      default: 'typ--color-default',
      muted: 'typ--color-muted',
      primary: 'typ--color-primary',
    },
  },
  defaultVariants: {
    variant: 'p',
    color: 'default',
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {}

export function Typ({
  className,
  variant = 'p',
  color,
  children,
  ...props
}: TypographyProps): React.JSX.Element {
  const classes = clsx(typographyVariants({ variant, color }), className);

  switch (variant) {
    case 'h1':
      return (
        <h1 className={classes} {...props}>
          {children}
        </h1>
      );
    case 'h2':
      return (
        <h2 className={classes} {...props}>
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3 className={classes} {...props}>
          {children}
        </h3>
      );
    default:
      return (
        <p className={classes} {...props}>
          {children}
        </p>
      );
  }
}

export function P(props: Omit<TypographyProps, 'variant'>): React.JSX.Element {
  return <Typ variant="p" {...props} />;
}

export function H1(props: Omit<TypographyProps, 'variant'>): React.JSX.Element {
  return <Typ variant="h1" {...props} />;
}

export function H2(props: Omit<TypographyProps, 'variant'>): React.JSX.Element {
  return <Typ variant="h2" {...props} />;
}

export function H3(props: Omit<TypographyProps, 'variant'>): React.JSX.Element {
  return <Typ variant="h3" {...props} />;
}
