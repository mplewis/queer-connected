import { Icon } from '@iconify/react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import type React from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
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
    prefix: {
      true: 'button--icon-prefix',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type BaseButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  prefix?: { icon: string } | { value: string };
  children?: React.ReactNode;
};

type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    href?: never;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * A versatile button component that can render as either a button or link element.
 * When href is provided, renders as an anchor tag styled as a button.
 */
export function Button({
  className,
  variant,
  size,
  prefix,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const classes = clsx(buttonVariants({ variant, size, prefix: !!prefix }), className);
  let prefixElem: React.JSX.Element | undefined;
  if (prefix) {
    if ('icon' in prefix) {
      prefixElem = (
        <span className="button__icon-prefix">
          <Icon icon={prefix.icon} />
        </span>
      );
    } else if ('value' in prefix) {
      prefixElem = <span className="button__icon-prefix">{prefix.value}</span>;
    }
  }
  const content = (
    <>
      {prefixElem}
      {children}
    </>
  );

  if ('href' in props && props.href) {
    return (
      <a className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
