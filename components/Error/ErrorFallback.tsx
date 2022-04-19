import React, { FC } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { withBem } from 'utils/bem';
import ErrorCard from 'components/Error/ErrorCard';

export type ErrorFallbackProps = {
  fallbackType?: 'screen' | 'page' | 'item';
} & FallbackProps;

// screen, page, item, same as loading
const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  fallbackType,
}) => {
  const b = withBem('error-fallback');

  const modifiers = {
    item: fallbackType === 'item',
    page: fallbackType === 'page',
    screen: fallbackType === 'screen',
  };

  return (
    <div className={b(null, modifiers)} role="alert">
      <ErrorCard
        error={error}
        resetErrorBoundary={resetErrorBoundary}
        fallbackType={fallbackType}
      />
    </div>
  );
};

export default ErrorFallback;
