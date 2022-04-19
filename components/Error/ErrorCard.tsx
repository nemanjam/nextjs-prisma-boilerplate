import React, { FC } from 'react';
import { BiError } from 'react-icons/bi';
import { withBem } from 'utils/bem';
import { ErrorFallbackProps } from 'components/Error/ErrorFallback';

const ErrorCard: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  fallbackType,
}) => {
  const b = withBem('error-card');

  const modifiers = {
    item: fallbackType === 'item',
    page: fallbackType === 'page',
    screen: fallbackType === 'screen',
  };

  return (
    <div className={b(null, modifiers)}>
      <h1>Something went wrong.</h1>
      <div className={b('content')}>
        <BiError className={b('icon')} />
        <p className={b('message')}>
          <span className={b('label')}>UI:</span>
          <span className={b('text')}>{fallbackType}</span>
          <span className={b('label')}>Message:</span>
          <span className={b('text')}>{error.message}</span>
        </p>
      </div>
      <a
        href=""
        className={b('try-again-link')}
        onClick={(e) => {
          e.preventDefault();
          resetErrorBoundary();
        }}
      >
        Try again
      </a>
    </div>
  );
};

export default ErrorCard;
