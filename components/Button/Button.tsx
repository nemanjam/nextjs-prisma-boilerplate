import React, {
  ReactNode,
  forwardRef,
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react';
import { withBem } from 'utils/bem';

type Props = {
  children: ReactNode | string;
  className?: string;
  pill?: boolean;
  disabled?: boolean;
  tagName?: 'button' | 'a' | 'span';
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary' | 'danger' | 'transparent' | 'neutral';
  size?: 'sm' | 'base' | 'lg';
} & HTMLAttributes<HTMLElement>;

const Button: ForwardRefRenderFunction<unknown, Props> = (
  {
    children,
    className,
    pill,
    disabled = false,
    tagName = 'button',
    type = 'button',
    variant = 'primary',
    size = 'base',
    ...props
  },
  ref
) => {
  const b = withBem('button');

  const Tag = tagName;
  const modifiers = {
    'size-sm': size === 'sm',
    'size-base': size === 'base',
    'size-lg': size === 'lg',
    primary: variant === 'primary',
    secondary: variant === 'secondary',
    neutral: variant === 'neutral',
    danger: variant === 'danger',
    transparent: variant === 'transparent',
    pill,
    disabled,
  };
  const _className = className ? ` ${className}` : '';

  return (
    <Tag
      ref={ref as any}
      disabled={disabled}
      type={type}
      className={b(null, modifiers) + _className}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default forwardRef(Button);
