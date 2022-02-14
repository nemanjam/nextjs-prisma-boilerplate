import React, { FC } from 'react';
import { withBem } from 'utils/bem';

type Props = {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
};

const Alert: FC<Props> = ({ message, variant = 'info', className }) => {
  const b = withBem('alert');

  const modifiers = {
    info: variant === 'info',
    success: variant === 'success',
    warning: variant === 'warning',
    error: variant === 'error',
  };

  const _className = className ? ` ${className}` : '';

  return <div className={b(null, modifiers) + _className}>{message}</div>;
};

export default Alert;
